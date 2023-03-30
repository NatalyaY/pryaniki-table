import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Add, Edit, PostErrors, selectTableEditErrors, selectTableError, selectTablePostErrors, selectTableStatus } from '../../../../features/table/tableSlice';
import { Alert, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogTitle, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { dialogActionStyle, dialogButtonStyle, dialogProps, dialogTitleProps } from './styles';
import { Record } from '../Table';

type AddArg = Parameters<typeof Add>[0];



const PostOrEditDialog: React.FC<{ handleClose: () => void, record?: Record, }> = ({ handleClose, record }) => {

    const [shouldClose, setShouldClose] = useState(false);
    const [shouldShowErrors, setShouldShowErrors] = useState(false);

    const dispatch = useAppDispatch();
    const tableStatus = useAppSelector(selectTableStatus);
    const errors = useAppSelector(selectTablePostErrors);
    const editErrors = useAppSelector(selectTableEditErrors);
    const serverErrors = record ? editErrors : errors;

    const tableError = useAppSelector(selectTableError);

    const [errorsToDisplay, setErrorsToDisplay] = useState<PostErrors>(serverErrors || {} as PostErrors);
    const { id, ...restRecord } = record || { id: '' };
    const [values, setValues] = useState<Partial<AddArg>>(record ? restRecord : {
        companySigDate: new Date().toISOString(),
        companySignatureName: undefined,
        documentName: undefined,
        documentStatus: undefined,
        documentType: undefined,
        employeeNumber: undefined,
        employeeSigDate: new Date().toISOString(),
        employeeSignatureName: undefined
    });

    const saveValue = (key: keyof typeof values) => (v: string | undefined) => {
        setValues({ ...values, [key]: v })
    };

    useEffect(() => {
        if (tableStatus === 'iddle' && shouldClose && !serverErrors && !tableError) {
            handleClose();
        }
    }, [tableStatus, shouldClose, handleClose, serverErrors, tableError]);

    useEffect(() => {
        setErrorsToDisplay(serverErrors || {} as PostErrors);
    }, [serverErrors]);

    const handlePost = () => {

        setShouldShowErrors(true);

        const emptyFields = Object.entries(values).filter(([k, v]) => !Boolean(v));
        if (emptyFields.length) {
            const emptyErrors = Object.fromEntries(emptyFields.map(([k, v]) => [k, ['Заполните поле']])) as PostErrors;
            setErrorsToDisplay({ ...emptyErrors, ...(serverErrors || {}) });
            return;
        }

        setShouldClose(true);
        if (record) {
            const recordToSave = { ...values as AddArg, id };
            dispatch(Edit(recordToSave));
        } else {
            dispatch(Add(values as AddArg));
        }
    };

    const getFieldError = (field: keyof typeof values) => {
        if (!shouldShowErrors || !errorsToDisplay[field]) return false;
        return true;
    };

    const getFieldErrorText = (field: keyof typeof values) => {
        if (!shouldShowErrors || !errorsToDisplay[field]) return;
        return errorsToDisplay[field][0];
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            {...dialogProps}
        >
                {tableStatus === 'loading' && shouldClose ?
                    <>
                        <DialogTitle {...dialogTitleProps}>
                            Сохранение
                        </DialogTitle>
                        <CircularProgress />
                    </>
                    :
                    <>
                        <DialogTitle {...dialogTitleProps}>
                            {record ? 'Редактировать запись' : 'Создать новую запись'}
                        </DialogTitle>
                        <Stack minWidth='70%' gap={3}>
                            {
                                Object.keys(values).map(key => {
                                    const field = key as keyof typeof values;
                                    return <FormInput
                                        isDate={key === 'companySigDate' || key === 'employeeSigDate'}
                                        saveValue={saveValue(field)}
                                        error={getFieldError(field)}
                                        helperText={getFieldErrorText(field)}
                                        name={key.replace(/([A-Z]+)/g, ' $1')}
                                        key={key}
                                        defaultValue={values[field]}
                                    />
                                })
                            }
                        </Stack>
                        <DialogActions sx={dialogActionStyle}>
                            <Button fullWidth sx={dialogButtonStyle} onClick={handlePost} variant='contained'>
                                {record ? 'Изменить' : 'Создать'}
                            </Button>
                            <Button fullWidth sx={dialogButtonStyle} onClick={handleClose}>
                                Отменить
                            </Button>
                        </DialogActions>
                        <Collapse in={Boolean(tableError)}>
                            <Alert severity="error">
                                {tableError}
                            </Alert>
                        </Collapse>
                    </>}
        </Dialog>
    );
};

interface IFormInput {
    isDate: boolean,
    defaultValue?: string,
    saveValue: (v?: string) => void,
    error: boolean,
    helperText?: string,
    name: string,
}

const FormInput: React.FC<IFormInput> = ({ isDate, saveValue, error, helperText, name, defaultValue }) => {

    const [value, setValue] = useState(defaultValue || '');
    const [customError, setCustomError] = useState(error);

    const handleChange = (value?: string) => {
        setValue(value || '');
        saveValue(value);
    };

    const handleFocus = () => {
        setCustomError(false);
    };

    const handleBlur = () => {
        if (!value) {
            setCustomError(error);
        }
    };

    useEffect(() => {
        setCustomError(error);
    }, [error])

    return (
        isDate ?
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                <MobileDateTimePicker
                    label={name}
                    value={dayjs(value)}
                    onChange={v => handleChange(v?.toISOString())}
                    closeOnSelect
                    slotProps={{
                        textField: {
                            required: true,
                            error: customError,
                            helperText: customError ? helperText : undefined,
                            onFocus: handleFocus,
                            onBlur: handleBlur,
                            FormHelperTextProps: {
                                sx: {
                                    position: 'absolute',
                                    bottom: 0,
                                    transform: 'translateY(100%)'
                                }
                            }
                        }
                    }}
                />
            </LocalizationProvider>
            :
            <TextField
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={customError}
                helperText={customError ? helperText : undefined}
                FormHelperTextProps={{
                    sx: {
                        position: 'absolute',
                        bottom: '3px',
                        transform: 'translateY(100%)'
                    }
                }}
                variant='outlined'
                label={name}
                required
            />
    )
}

export default PostOrEditDialog;
