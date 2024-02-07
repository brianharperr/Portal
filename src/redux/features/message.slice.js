import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    Messages: [],
    Sent: null,
    status: 'idle',
    error: null,
}

export const fetchMessages = createAsyncThunk('analytics/fetchMessages', async () => {
    const response = await axiosWithCredentials.get('/message');
    return response.data;
})

export const fetchSent = createAsyncThunk('analytics/fetchSent', async (payload) => {
    const response = await axiosWithCredentials.get('/message/sent', { params: payload });

    return response.data;
})

export const fulfillMessage = createAsyncThunk('analytics/fulfillMessage', async (payload) => {
    const response = await axiosWithCredentials.post('/message', payload);
    return response.data;
})

export const deleteMessage = createAsyncThunk('analytics/deleteMessage', async (payload) => {
    const response = await axiosWithCredentials.delete('/message', { params: payload });
    return response;
})

export const flagMessage = createAsyncThunk('analytics/flagMessage', async (payload) => {
    const response = await axiosWithCredentials.patch('/message/flag', payload);
    return response.data;
})


export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Messages = action.payload;
                state.Count = action.payload.length;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const deletedMessageIndex = state.Messages.findIndex(message => message.ID === Number(action.payload.data));
                if (deletedMessageIndex !== -1) {
                    state.Messages[deletedMessageIndex] = {
                      ...state.Messages[deletedMessageIndex],
                      Deleted: 1,
                    };
                }
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(flagMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const flagMessageIndex = state.Messages.findIndex(message => message.ID === action.payload.ID);
                if (flagMessageIndex !== -1) {
                    state.Messages[flagMessageIndex] = {
                      ...state.Messages[flagMessageIndex],
                      Flagged: action.payload.Flagged,
                    };
                }
            })
            .addCase(flagMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSent.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchSent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Sent = action.payload;
            })
            .addCase(fetchSent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

// Action creators are generated for each case reducer function
export const getMessages = (state) => state.message.Messages;
export const getSentMessages = (state) => state.message.Sent;
export const getInbox = (state) => state.message.Messages.filter(x => x.Deleted === 0);
export const getTrash = (state) => state.message.Messages.filter(x => x.Deleted === 1);
export const getFlagged = (state) => state.message.Messages.filter(x => x.Deleted === 0 && x.Flagged === 1);
export const getMessageCount = (state) => state.message.Count;
export const getMessage = (state) => state.message.Single;
export const getMessageStatus = (state) => state.message.status;

export default messageSlice.reducer