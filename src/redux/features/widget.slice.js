import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    widgets: [],
    status: 'idle',
    error: null,
}

export const createWidget = createAsyncThunk('/widget/createWidget', async (payload) => {
    const response = await axiosWithCredentials.post('/widget', payload);
    return response.data;
})

export const fetchWidgets = createAsyncThunk('/widget/fetchWidgets', async () => {
    const response = await axiosWithCredentials.get('/widget');
    return response.data;
})

export const deleteWidget = createAsyncThunk('/widget/deleteWidget', async (id) => {
    const response = await axiosWithCredentials.delete('/widget', { params: { id: id }});
    return response.data;   
})

export const widgetSlice = createSlice({
    name: 'widget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createWidget.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createWidget.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.widgets = action.payload;
            })
            .addCase(createWidget.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchWidgets.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchWidgets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.widgets = action.payload;
            })
            .addCase(fetchWidgets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteWidget.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteWidget.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.widgets = action.payload;
            })
            .addCase(deleteWidget.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

// Action creators are generated for each case reducer function
export const getWidgets = (state) => state.widget.widgets;
export const getWidgetStatus = (state) => state.widget.status;
export const getWidgetError = (state) => state.widget.error;

export default widgetSlice.reducer