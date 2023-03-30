import React from 'react';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Stack } from '@mui/system';

const Layer = () => (
    <Container sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
        <Stack sx={{maxWidth: '400px', m: '0 auto'}} alignItems='center'>
            <Outlet />
        </Stack>
    </Container>
)

export default Layer