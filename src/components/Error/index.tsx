import { Typography, Container } from '@mui/material';
import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Stack } from '@mui/system';


const ErrorBoundary: React.FC<{ errorText?: string }> = ({ errorText }) => {
    const error = useRouteError() as Error || { message: errorText } || {};
    return (
        <Container sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ maxWidth: '400px', m: '0 auto' }} alignItems='center'>
                <>
                    <Typography mb={4} textAlign={'center'} variant="h1">Упс...что-то пошло не так</Typography>
                    <Typography>{error.message || 'Непредвиденная ошибка'}</Typography>
                </>
            </Stack>
        </Container>
    );
};

export class ErrorBoundaryClass extends React.Component<{ children: React.ReactNode; }, { hasError: boolean; errorText?: string}> {
    constructor(props: { children: React.ReactNode; }) {
        super(props);
        this.state = {
            hasError: false,
            errorText: undefined
        };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            errorText: error.message
        };
    }

    render() {
        if (this.state.hasError) {
            return <ErrorBoundary errorText={this.state.errorText}/>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
