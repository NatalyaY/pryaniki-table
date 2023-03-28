import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface UserState {
    name?: string;
}

const initialState: UserState = {};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
    },
});

export const { setName } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
