import { Alert, Button, Collapse, FormGroup, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useActionData, Form, useLoaderData } from "react-router-dom";
import { clearState } from '../../features/clearState/clearStateSlice';
import { setName } from '../../features/user/userSlice';
import { authActionData, authLoaderData } from '../../Router';
import { useAppDispatch } from './../../app/hooks';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Auth: React.FC = () => {
    const dispatch = useAppDispatch();
    const [login, setlogin] = useState('');

    const searchQueries = useLoaderData() as authLoaderData;
    const formType = searchQueries instanceof Response ? null : (searchQueries.type || 'login');

    const errorsFromAction = useActionData() as authActionData | undefined;
    const hasError = Boolean(errorsFromAction?.error_code);

    if (errorsFromAction && !hasError) dispatch(setName(login));

    useEffect(() => { dispatch(clearState()) }, [dispatch]);

    return <AuthForm hasError={hasError} error_text={errorsFromAction?.error_text} formType={formType} saveLogin={setlogin} />;
}

interface IAuthForm {
    hasError: boolean,
    error_text?: string,
    formType: string | null,
    saveLogin: React.Dispatch<React.SetStateAction<string>>
}

const AuthForm: React.FC<IAuthForm> = ({ hasError, error_text, formType, saveLogin }) => {
    if (formType === 'login') return <Login {...{ hasError, error_text, saveLogin }} />
    return null;
}

interface ILogin extends Omit<IAuthForm, 'formType'> { }

const Login: React.FC<ILogin> = ({ hasError, error_text, saveLogin }) => {

    const [login, setlogin] = useState('');
    const [password, setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Paper width='100%' component={Stack} gap={4} p={4} sx={{borderRadius: 4}} >
            <Typography variant='h1' textAlign='center'>
                Войдите в личный кабинет
            </Typography>
            <Form method='post'>
                <FormGroup sx={{ gap: 2 }}>
                    <TextField
                        required
                        name='username'
                        label='Login:'
                        autoComplete='username'
                        variant='outlined'
                        value={login}
                        onChange={(e) => { setlogin(e.target.value); saveLogin(e.target.value) }}
                    />
                    <TextField
                        required
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='current-password'
                        label='Password:'
                        variant='outlined'
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <Button variant='contained' type='submit'>Войти</Button>
                    <Collapse in={hasError}>
                        <Alert severity="error">
                            {error_text ? error_text : 'Произошла ошибка, попробуйте позже'}
                        </Alert>
                    </Collapse>
                </FormGroup>
            </Form>
        </Paper>
    )
}

export default Auth;