import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    Inbox: [],
    InboxCount: null,
    Sent: [],
    SentCount: null,
    Single: null,
    status: 'idle',
    error: null,
}

export const fetchInbox = createAsyncThunk('analytics/fetchInbox', async (payload) => {
    const response = await axiosWithCredentials.get('/message/inbox', { params: payload });

    return response.data;
})

export const fetchSent = createAsyncThunk('analytics/fetchSent', async (payload) => {
    const response = await axiosWithCredentials.get('/message/sent', { params: payload });

    return response.data;
})

export const fetchMessage = createAsyncThunk('analytics/fetchMessage', async (payload) => {
    const response = await axiosWithCredentials.get('/message', {params: payload});
    return response.data;
})

export const fulfillMessage = createAsyncThunk('analytics/fulfillMessage', async (payload) => {
    const response = await axiosWithCredentials.post('/message', payload);
    return response.data;
})

export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInbox.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchInbox.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Inbox = action.payload.Messages;
                state.InboxCount = action.payload.Count;
            })
            .addCase(fetchInbox.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSent.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchSent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Sent = action.payload.Messages;
                state.SentCount = action.payload.Count;
            })
            .addCase(fetchSent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fulfillMessage.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fulfillMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(fulfillMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMessage.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Single = action.payload;
            })
            .addCase(fetchMessage.rejected, (state, action) => {
                state.status = 'failed';
                window.location.href = '/messages'
                state.error = action.error.message;
            })

    }
})

// Action creators are generated for each case reducer function
export const getInbox = (state) => state.message.Inbox;
export const getInboxCount = (state) => state.message.InboxCount;
export const getSent = (state) => state.message.Sent;
export const getSentCount = (state) => state.message.SentCount;
export const getMessage = (state) => state.message.Single;

export default messageSlice.reducer