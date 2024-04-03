import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios'

const initialState = {
    data: [],
    roles: [],
    loggedIn: null,
    status: 'idle',
    error: null
}


export const fetchUsers = createAsyncThunk('portal/fetchUsers', async (portalID) => {
        const response = await axiosWithCredentials.post('/procedure/users', {
            portal: portalID
        });
        return response.data;
});

export const inviteUsers = createAsyncThunk('users/inviteUsers', async (payload) => {
    const response = await axiosWithCredentials.post('/email/portal-invite', payload);
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (payload, {rejectWithValue}) => {
    try{
        const response = await axiosWithCredentials.post('/user/delete', payload);
        return response.data;
    }catch(err){
        if(!err.response){
            throw err;
        }
        return rejectWithValue(err.response.data)
    }
});


export const updateRole = createAsyncThunk('users/updateRole', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/role', payload);
    return response.data;
});

export const updateActiveStatus = createAsyncThunk('users/updateActiveStatus', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/activeStatus', payload);
    return response.data;
});

export const getUser = createAsyncThunk('users/getUser', async (payload) => {
    const response = await axiosWithCredentials.get('/user');
    return response.data;
});

export const toggleNotificationsPreference = createAsyncThunk('users/toggleNotificationsPreference', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/notifications', payload);
    return response.data;
});

export const updateEmail = createAsyncThunk('users/updateEmail', async (payload) => {
    const response = await axiosWithCredentials.post('/email/change-email', payload);
    return response.data;
});

export const updateName = createAsyncThunk('users/updateName', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/name', payload);
    return response.data;
});


export const updatePassword = createAsyncThunk('users/updatePassword', async (payload, {rejectWithValue}) => {
    try{
        const response = await axiosWithCredentials.patch('/user/password', payload);
        return response.data;
    }catch(err){
        if(!err.response){
            throw err;
        }
        return rejectWithValue(err.response.data)
    }
});

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.data = action.payload;
        } 
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.Users;
                state.roles = action.payload.Roles;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.Users;
                state.roles = action.payload.Roles;
            })
            .addCase(updateActiveStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.Users;
                state.roles = action.payload.Roles;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loggedIn = action.payload;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loggedIn = action.payload;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(toggleNotificationsPreference.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loggedIn = action.payload;
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(inviteUsers.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(inviteUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(inviteUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
// Action creators are generated for each case reducer function
export const { setUsers } = usersSlice.actions;
export const getLoggedInUser = (state) => state.users.loggedIn;
export const getUsers = (state) => state.users.data;
export const getRoles = (state) => state.users.roles;
export const getUsersStatus = (state) => state.users.status;
export const getUsersError = (state) => state.users.error;

export default usersSlice.reducer