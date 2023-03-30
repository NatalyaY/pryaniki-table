import { Button, Link, Typography } from '@mui/material';
import React from 'react';


const NotFound = () => {
    return (
        <>
            <Typography mb={4} textAlign={'center'} variant="h1">Упс...нет такой страницы</Typography>
            <Button variant="contained" component={Link} href='/' >На главную</Button>
        </>
    );
};

export default NotFound;
