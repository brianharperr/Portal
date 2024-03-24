import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    users: null,
    data: null,
    permissions: null,
    status: 'idle',
    error: null,
    role: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axiosWithCredentials.get('/user/portal/single');

    return response.data;
})

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
    const response = await axiosWithCredentials.get('/user/portal');

    return response.data;
})

export const resetPassword = createAsyncThunk('user/resetPassword', async (payload) => {
    const response = await axiosWithCredentials.post('/user/portal/reset');

    return response.data;
})

export const updateUser = createAsyncThunk('user/updateUser', async (payload) => {
    const response = await axiosWithCredentials.patch('/user', payload);
    return response.data;
})

export const updateProfilePicture = createAsyncThunk('user/updateProfilePicture', async (payload) => {
    const formData = new FormData();
    formData.append('file', payload);
    const response = await axiosWithCredentials.patch('/user/portal/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
})

export const updateActiveStatus = createAsyncThunk('user/updateActiveStatus', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/activeStatus', payload);
    return response.data;
})

export const updateNotificationSettings = createAsyncThunk('user/updateNotifications', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/portal/notifications', payload);

    return response.data;
})

export const fetchPermissions = createAsyncThunk('user/fetchPermissions', async () => {
    const response = await axiosWithCredentials.get('/user/portal/permissions');

    return response.data;
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetPassword.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateActiveStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedMessageIndex = state.users.findIndex(user => user.ID === Number(action.payload.ID));
                if (deletedMessageIndex !== -1) {
                    state.users[deletedMessageIndex] = {
                      ...state.users[deletedMessageIndex],
                      Activated: action.payload.Activated,
                    };
                }
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.permissions = action.payload;
            })
            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data =  {
                    ...state.data,
                    Pic: action.payload,
                };
            })
            .addCase(updateNotificationSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const getUsers = (state) => state.user.users;
export const getUser = (state) => state.user.data;
export const getUserStatus = (state) => state.user.status;
export const getUserError = (state) => state.user.error;
export const getUserPermissions = (state) => state.user.permissions;

export default userSlice.reducer