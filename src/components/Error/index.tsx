import React from 'react';
import { Link } from 'react-router-dom';


const Error = () => {
    return (
        <>
            <h1>Упс...нет такой страницы</h1>
            <Link to='/' >На главную</Link>
        </>
    );
};

export default Error;
