import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { useLoaderData } from "react-router-dom";
import { handleLoaderError, mainLoaderData } from '../../Router';
import { setTableData } from '../../features/table/tableSlice';

import { Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';

import Header from './components/Header';
import { SxProps } from '@mui/system';
import Table from './components/Table';
import PostOrEditDialog from './components/Dialogs/PostOrEditDialog';
import { mainTableData } from './../../Router';
import { useNavigate } from "react-router-dom";
import { ErrorBoundaryClass } from '../Error';


const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const handleDeleteDialogClose = () => setPostDialogOpen(false);
    const [loadedTableData, setLoadedTableData] = useState<mainTableData['data'] | null>(null);
    const [tableDataLoading, setTableDataLoading] = useState(true);

    const loaderData = useLoaderData() as mainLoaderData;

    useEffect(() => {
        if (loadedTableData && loadedTableData.filter(Boolean).length) {
            dispatch(setTableData(loadedTableData))
        }
    }, [loadedTableData, dispatch])

    useEffect(() => {
        if (loaderData && !(loaderData instanceof Response)) {
            loaderData.table
                .then(data => {
                    if (data) {
                        if (data.error_code === 2004) {
                            handleLoaderError();
                            navigate('/auth');
                            return;
                        }
                        setLoadedTableData(data.data);
                        setTableDataLoading(false);
                    }
                })
                .catch(e => {
                    if (!tableDataLoading) return;
                    setTableDataLoading(false);
                })
        }
    }, [loaderData, navigate, tableDataLoading])

    const paperStyle: SxProps = {
        height: '100%',
        gap: 10,
        px: {xs: 1, sm: 4},
        py: 4,
        alignItems: 'center',
        borderRadius: 2,
    };

    return (
        <ErrorBoundaryClass>
            <Header />
            <Container component={'main'}>
                <Paper component={Stack} elevation={0} sx={paperStyle}>
                    <ErrorBoundaryClass>
                        <Stack alignItems='center' gap={1} textAlign='center'>
                            <Typography variant='h1'>
                                Таблица данных по документам
                            </Typography>
                            <Typography mb={3} variant='h4' whiteSpace={{ xs: 'normal', sm: 'pre-line' }}>
                                {`Здесь вы можете просмотреть, изменить, удалить
                            или добавить данные о документах`}
                            </Typography>
                            {
                                loadedTableData &&
                                <Button variant='contained' onClick={() => setPostDialogOpen(true)}>
                                    Добавить запись
                                </Button>
                            }
                        </Stack>
                        {
                            tableDataLoading ?
                                <CircularProgress />
                                :
                                <ErrorBoundaryClass>
                                    <Table />
                                </ErrorBoundaryClass>
                        }
                        {
                            postDialogOpen &&
                            <PostOrEditDialog handleClose={handleDeleteDialogClose} />
                        }
                    </ErrorBoundaryClass>
                </Paper>
            </Container>
        </ErrorBoundaryClass>
    )
};

export default App;


