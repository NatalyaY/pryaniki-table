import {
    ActionFunctionArgs,
    createBrowserRouter,
    LoaderFunctionArgs,
    redirect
} from "react-router-dom";

import App from './components/Main';
import Auth from './components/Auth/index';
import ErrorComp from "./components/Error";
import Layer from './components/Layer/Layer';

export const COOKIE_NAME = 'user';


export const getCookie = (name: string) => {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const deleteCookie = (name: string) => document.cookie = `${name}=;expires=Thu, 01-Jan-1970 00:00:01 GMT`;
const setCookie = (name: string, value: string) => document.cookie = `${name}=${value};max-age=86400`;
const getSearchParams = (req: Request) => Object.fromEntries(new URL(req.url).searchParams.entries());

export type mainLoaderData = Awaited<ReturnType<typeof mainLoader>>;
export type authLoaderData = Awaited<ReturnType<typeof authLoader>>;
export type authActionData = Awaited<ReturnType<typeof authAction>>;


interface mainTableData {
    error_code?: string;
    error_text?: string;
    data: {
        companySigDate: string,
        companySignatureName: string,
        documentName: string,
        documentStatus: string,
        documentType: string,
        employeeNumber: string,
        employeeSigDate: string,
        employeeSignatureName: string,
        id: string,
    }[] | []
}

interface authData extends Omit<mainTableData, 'data'> {
    data: {
        token: string
    }
}

const mainLoader = async ({ params, request }: LoaderFunctionArgs) => {
    const SQ = getSearchParams(request);
    const url = process.env.REACT_APP_GET_URL;
    const userCookie = getCookie(COOKIE_NAME);

    if (!url) throw new Error('process.env unavailable');
    if (!userCookie) {
        return redirect('/auth');
    };

    const res = await fetch(url, {
        headers: {
            'x-auth': userCookie
        }
    });

    const data = await res.json() as mainTableData;

    if (!res.ok || data.error_code) {
        deleteCookie(COOKIE_NAME);
        return redirect('/auth');
    }

    return { query: SQ, table: data };
};

const authLoader = ({ params, request }: LoaderFunctionArgs) => {
    const SQ = getSearchParams(request);

    const userCookie = getCookie(COOKIE_NAME);

    if (userCookie) { return redirect('/') };

    return SQ;
};

const authAction = async ({ params, request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const url = process.env.REACT_APP_AUTH_URL;

    if (!url) throw new Error('process.env unavailable');
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates)
    });
    const body = await res.json() as authData;

    if (res.ok && !body.error_code) {
        setCookie(COOKIE_NAME, body.data.token);
    }

    return body;

}

export default createBrowserRouter([
    {
        path: '/',
        loader: mainLoader,
        action: () => {
            deleteCookie(COOKIE_NAME);
            return null;
        },
        element: <App />,
    },
    {
        element: <Layer />,
        children: [
            {
                path: '/auth',
                loader: authLoader,
                action: authAction,
                element: <Auth />,
            },
            {
                path: '/*',
                element: <ErrorComp />,
            },
        ]
    }
]);
