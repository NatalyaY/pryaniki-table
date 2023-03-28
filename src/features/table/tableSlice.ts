import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { COOKIE_NAME, getCookie, mainLoaderData } from '../../Router';


type table = Exclude<mainLoaderData, Response>['table']['data'];
type tableEntry = Omit<table[number], 'id'>;
type postResponce = Omit<Exclude<mainLoaderData, Response>['table'], 'data'> & { data: table[number] };

const visibleFields = [
    'companySigDate' as const,
    'companySignatureName' as const,
    'documentName' as const,
    'documentStatus' as const,
    'documentType' as const,
    'employeeNumber' as const,
    'employeeSigDate' as const,
    'employeeSignatureName' as const
];

export interface TableState {
    data?: table,
    visibleFields: typeof visibleFields,
    status: 'loading' | 'iddle',
    error?: string
}

const initialState: TableState = {
    visibleFields,
    status: 'iddle'
};

export const Add = createAsyncThunk<
    table[number],
    tableEntry,
    {
        rejectValue: { message: string }
    }
>('table/add', async (item, { rejectWithValue }) => {
    try {
        const url = process.env.REACT_APP_POST_URL;
        const userCookie = getCookie(COOKIE_NAME);

        if (!url) return rejectWithValue({ message: 'process.env unavailable' });
        if (!userCookie) {
            window.location.href = '/auth';
            return rejectWithValue({ message: 'Необходима авторизация' });
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'x-auth': userCookie
            },
            body: JSON.stringify(item)
        });
        const responseData = await response.json() as postResponce;
        if (responseData.error_code) {
            return rejectWithValue({ message: responseData.error_text || 'Непредвиденная ошибка' })
        } else {
            return responseData.data;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as Error).message })
    };
});

export const Remove = createAsyncThunk<
    string,
    string,
    {
        rejectValue: { message: string }
    }
>('table/remove', async (id, { rejectWithValue }) => {
    try {
        const url = process.env.REACT_APP_DELETE_URL;
        const userCookie = getCookie(COOKIE_NAME);

        if (!url) return rejectWithValue({ message: 'process.env unavailable' });
        if (!userCookie) {
            window.location.href = '/auth';
            return rejectWithValue({ message: 'Необходима авторизация' });
        };
        const response = await fetch(url + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'x-auth': userCookie
            },
        });
        const responseData = await response.json() as Omit<postResponce, "data">;
        if (responseData.error_code) {
            return rejectWithValue({ message: responseData.error_text || 'Непредвиденная ошибка' })
        } else {
            return id;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as Error).message })
    };
});

export const Edit = createAsyncThunk<
    table[number],
    table[number],
    {
        rejectValue: { message: string }
    }
>('table/edit', async (item, { rejectWithValue }) => {
    try {
        const {id, ...post} = item;
        const url = process.env.REACT_APP_PUT_URL;
        const userCookie = getCookie(COOKIE_NAME);

        if (!url) return rejectWithValue({ message: 'process.env unavailable' });
        if (!userCookie) {
            window.location.href = '/auth';
            return rejectWithValue({ message: 'Необходима авторизация' });
        };
        const response = await fetch(url + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'x-auth': userCookie
            },
            body: JSON.stringify(post)
        });
        const responseData = await response.json() as postResponce;
        if (responseData.error_code) {
            return rejectWithValue({ message: responseData.error_text || 'Непредвиденная ошибка' })
        } else {
            return responseData.data;
        };
    } catch (err) {
        return rejectWithValue({ message: (err as Error).message })
    };
});

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<table>) => {
            state.data = action.payload;
        },
        sortTable: (state, action: PayloadAction<{field: typeof visibleFields[number], order: 'asc' | 'desc'}>) => {
            const { field, order } = action.payload;
            const ifBigger = order === 'asc' ? 1: -1;
            const ifSmaller = ifBigger * -1;

            if (state.data) {
                state.data.sort((a, b) => {
                    if (a[field] === b[field]) return 1;
                    return a[field] > b[field] ? ifBigger : ifSmaller
                })
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(Add.fulfilled, (state, action) => {
            state.data = [...state.data || [], action.payload as NonNullable<typeof state['data']>[number]];
            state.status = 'iddle';
        })
            .addCase(Add.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(Add.rejected, (state, action) => {
                state.status = 'iddle';
                state.error = action.payload?.message || action.error.message;
            })
            .addCase(Remove.fulfilled, (state, action) => {
                if (state.data) {
                    const index = state.data.findIndex(t => t.id === action.payload);
                    if (index !== -1) {
                        state.data.splice(index, 1);
                    }
                }
                state.status = 'iddle';
            })
            .addCase(Remove.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(Remove.rejected, (state, action) => {
                state.status = 'iddle';
                state.error = action.payload?.message || action.error.message;
            })
            .addCase(Edit.fulfilled, (state, action) => {
                if (state.data) {
                    const index = state.data.findIndex(t => t.id === action.payload.id);
                    if (index !== -1) {
                        state.data[index] = action.payload;
                    }
                }
                state.status = 'iddle';
            })
            .addCase(Edit.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(Edit.rejected, (state, action) => {
                state.status = 'iddle';
                state.error = action.payload?.message || action.error.message;
            })
    },
});

export const { setTableData, sortTable } = tableSlice.actions;
export const selectTable = (state: RootState) => state.table.data;
export const selectTableFields = (state: RootState) => state.table.visibleFields;


export default tableSlice.reducer;