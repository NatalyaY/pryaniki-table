import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Remove, selectTableDeleteError } from '../../../../features/table/tableSlice';
import { Alert, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { selectTableStatus } from '../../../../features/table/tableSlice';
import { dialogActionStyle, dialogButtonStyle, dialogProps, dialogTitleProps } from './styles';

const DeleteDialog: React.FC<{ id: string; handleClose: () => void; }> = ({ id, handleClose }) => {

    const [shouldClose, setShouldClose] = useState(false);

    const dispatch = useAppDispatch();
    const tableStatus = useAppSelector(selectTableStatus);
    const error = useAppSelector(selectTableDeleteError);

    useEffect(() => {
        if (tableStatus === 'iddle' && shouldClose && !error)
            handleClose();
    }, [tableStatus, shouldClose, handleClose, error]);

    const handleDelete = () => {
        setShouldClose(true);
        dispatch(Remove(id));
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
                        Удаление записи
                    </DialogTitle>
                    <CircularProgress />
                </>
                :
                <>
                    <DialogTitle {...dialogTitleProps}>
                        Удалить запись?
                    </DialogTitle>
                    <DialogActions sx={dialogActionStyle}>
                        <Button autoFocus variant='contained' onClick={handleDelete} sx={dialogButtonStyle}>
                            Удалить
                        </Button>
                        <Button onClick={handleClose} sx={dialogButtonStyle}>
                            Отменить
                        </Button>
                    </DialogActions>
                    <Collapse in={Boolean(error)}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Collapse>
                </>}
        </Dialog>
    );
};

export default DeleteDialog;
