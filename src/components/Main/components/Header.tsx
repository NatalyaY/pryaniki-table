import React from 'react';
import { AppBar, Avatar, Button, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import { Form } from "react-router-dom";

import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';

const Header = () => {
    const user = useAppSelector(selectUser);
    const avatarContent = user.name? user.name[0].toLocaleUpperCase() + user.name.replace(/^\D+/g, '') : 'U';

    return (
        <AppBar position="static" component={'header'} sx={{ py: 2, mb: 4 }}>
            <Container sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack flexDirection='row' gap={1} alignItems='center'>
                    <Avatar sx={{ bgcolor: 'primary.main', p: 4 }}>{avatarContent}</Avatar>
                    <Typography variant='h4' component='span'>{user.name}</Typography>
                </Stack>
                <Form method='post'>
                    <Button type="submit" variant='contained' color='primary'>Выйти</Button>
                </Form>
            </Container>
        </AppBar>
    )
}

export default Header;