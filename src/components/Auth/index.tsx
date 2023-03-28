import React, { useEffect, useState } from 'react';
import { useActionData, Form, useLoaderData } from "react-router-dom";
import { clearState } from '../../features/clearState/clearStateSlice';
import { setName } from '../../features/user/userSlice';
import { authActionData, authLoaderData } from '../../Router';
import { useAppDispatch } from './../../app/hooks';


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
    if (formType === 'login') return <Login {...{hasError, error_text, saveLogin}}  />
    return null;
}

interface ILogin extends Omit<IAuthForm, 'formType'> {}

const Login: React.FC<ILogin> = ({ hasError, error_text, saveLogin }) => {

    const [login, setlogin] = useState('');
    const [password, setpassword] = useState('');

    return (
        <Form method='post'>
            <label>
                Login:
                <input type="text" name='username' value={login} onChange={(e) => {setlogin(e.target.value); saveLogin(e.target.value)}} />
            </label>
            <label>
                Password:
                <input type="text" name='password' value={password} onChange={(e) => setpassword(e.target.value)} />
            </label>
            <input type="submit" value="Войти" />
            {
                hasError &&
                <span>{error_text ? error_text : 'Произошла ошибка, попробуйте позже'}</span>
            }
        </Form>
    )
}

export default Auth;