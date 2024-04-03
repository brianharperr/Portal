import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios'

const initialState = {
    data: [],
    status: 'idle',
    error: null
}

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (portalID) => {
        const response = await axiosWithCredentials.post('/procedure/roles', {
            PortalID: portalID
        });

        var roles = response.data;
        
        roles.forEach(x => {
            x.Permissions = x.Permissions[0];
        });

        return response.data;

})

export const createRole = createAsyncThunk('/roles/createRole', async (payload) => {
    const response = await axiosWithCredentials.post('/role', payload);
    
    var roles = response.data;

    roles.forEach(x => {
        x.Permissions = x.Permissions[0];
    });

    return response.data;
});

export const updateRole = createAsyncThunk('/roles/updateRole', async (payload) => {
    const response = await axiosWithCredentials.put('/role', payload);

    var roles = response.data;
        
    roles.forEach(x => {
        x.Permissions = x.Permissions[0];
    });

    return response.data;
});

export const deleteRole = createAsyncThunk('/roles/deleteRole', async (payload) => {
    const response = await axiosWithCredentials.post('/role/delete', payload);

    var roles = response.data;
        
    roles.forEach(x => {
        x.Permissions = x.Permissions[0];
    });
    
    return response.data;
})

export const updateDefaultRole = createAsyncThunk('users/updateDefaultRole', async (payload) => {
    const response = await axiosWithCredentials.patch('/user/defaultrole', payload);

    var roles = response.data;
    
    roles.forEach(x => {
        x.Permissions = x.Permissions[0];
    });

    return response.data;
}); 

export const updatePermission = createAsyncThunk('role/updatePermissions', async (payload) => {
    const response = await axiosWithCredentials.patch('/role/permission', payload);
    return response.data;
}); 

export const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';

                state.data = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createRole.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateRole.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateDefaultRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteRole.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const idx = state.data.findIndex(x => x.Permissions.ID === action.payload.ID);
                state.data[idx].Permissions = action.payload;
            })
    }
})
// Action creators are generated for each case reducer function
export const {  } = roleSlice.actions;
export const getRoles = (state) => state.roles.data;
export const getRolesStatus = (state) => state.roles.status;
export const getRolesError = (state) => state.roles.error;

export default roleSlice.reducer