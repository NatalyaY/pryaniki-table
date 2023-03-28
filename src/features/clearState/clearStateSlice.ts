import { createSlice } from '@reduxjs/toolkit';


export const clearStateSlice = createSlice({
    name: 'clearState',
    initialState: {},
    reducers: {
        clearState: () => {}
    },
});

export const { clearState } = clearStateSlice.actions;

export default clearStateSlice.reducer;