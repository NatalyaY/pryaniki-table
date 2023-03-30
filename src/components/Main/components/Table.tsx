import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectTable, selectTableFields, sortTable } from '../../../features/table/tableSlice';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import DeleteDialog from './Dialogs/DeleteDialog';
import PostOrEditDialog from './Dialogs/PostOrEditDialog';

export type Record = NonNullable<ReturnType<typeof selectTable>>[number];

const Table: React.FC = () => {
    const [deleteItem, setdeleteItem] = useState<string | undefined>();
    const handleDeleteDialogClose = () => setdeleteItem(undefined);

    const [editedItem, setEditedItem] = useState<Record | undefined>();
    const handleEditDialogClose = () => setEditedItem(undefined);

    const dispatch = useAppDispatch();
    const tableFields = useAppSelector(selectTableFields);
    const data = useAppSelector(selectTable);
    const mappedData = data?.map(record => ({
        ...record,
        companySigDate: new Date(record.companySigDate).toLocaleString(),
        employeeSigDate: new Date(record.employeeSigDate).toLocaleString(),
    }));

    type SortArgs = Parameters<typeof sortTable>[0];

    const handleSort = (field: SortArgs['field'], order: SortArgs['order']) => () => dispatch(sortTable({ field, order }));

    const tableRowStyles: SxProps = {
        p: 1,
        verticalAlign: 'middle',
        border: '1px solid',
        borderColor: 'primary.main'
    };

    const tableHeaderStyle: SxProps = {
        backgroundColor: 'primary.main',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'primary.contrastText',
        gap: 1 / 2,
        ...tableRowStyles
    };

    const tableDataExists = Boolean(mappedData?.length);

    return (
        tableDataExists ?
            <Box
                sx={{
                    display: 'grid',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    width: '100%',
                    overflowY: 'auto',
                    gridTemplateColumns: {
                        xs: 'min-content',
                        xl: `repeat(${tableFields.length}, minmax(min-content, 1fr)) max-content`
                    },
                    gridTemplateRows: {
                        xs: `repeat(${tableFields.length + 1}, auto)`,
                        xl: 'unset'
                    },
                    gridAutoColumns: {
                        xs: 'minmax(max-content, 1fr)',
                        xl: 'unset'
                    },
                    gridAutoFlow: {
                        xs: 'column',
                        xl: 'unset'
                    }
                }}>
                {tableFields.map(k =>
                    <Stack sx={tableHeaderStyle} key={k}>
                        <Typography fontWeight='bold' component='span'>
                            {k.replace(/([A-Z]+)/g, ' $1')}
                        </Typography>
                        <Stack>
                            <IconButton sx={{ p: 0 }} color='inherit' onClick={handleSort(k, 'asc')}>
                                <ArrowDropUpIcon />
                            </IconButton>
                            <IconButton sx={{ p: 0 }} color='inherit' onClick={handleSort(k, 'desc')}>
                                <ArrowDropDownIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                )}
                <Stack sx={tableHeaderStyle} />
                {mappedData!.map((record, row) =>
                    <React.Fragment key={record.id + row}>
                        {tableFields.map((field, i) => (
                            field && record[field] ?
                                <Stack justifyContent='center' sx={tableRowStyles} key={record[field] + record.id + i}>
                                    <Typography component='span' >
                                        {record[field]}
                                    </Typography>
                                </Stack>
                                : null
                        ))}
                        <Stack sx={{ ...tableHeaderStyle, gap: 0, p: 1 / 2 }}>
                            <IconButton sx={{ p: 1 }} color='inherit' onClick={() => setEditedItem(data?.find(rec => rec.id === record.id))}>
                                <EditIcon />
                            </IconButton>
                            <IconButton sx={{ p: 1 }} color='inherit' onClick={() => setdeleteItem(record.id)}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Stack>
                    </React.Fragment>
                )}
                {
                    deleteItem !== undefined &&
                    <DeleteDialog id={deleteItem} handleClose={handleDeleteDialogClose} />
                }
                {
                    editedItem !== undefined &&
                    <PostOrEditDialog handleClose={handleEditDialogClose} record={editedItem} />
                }
            </Box>
            :
            <Typography>
                Нет данных
            </Typography>
    );
};

export default Table;
