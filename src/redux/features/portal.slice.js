import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials, axiosWithoutCredentials } from '../../configs/axios';
import ColorTheme from '../../configs/color-themes';

const initialState = {
    data: null,
    status: 'idle',
    users: null,
    error: null,
    theme: null
}

export const fetchPortal = createAsyncThunk('portal/fetchPortal', async (subdomain) => {
    const response = await axiosWithCredentials.get('/portal/' + subdomain);
    if(!response.data.portal){
        window.location.href = "https://familylynk.com"
    }
    document.title = response.data.portal.Name + " | FamilyLynk";

    return response.data;
})

export const fetchUsers = createAsyncThunk('portal/fetchUsers', async (ID) => {
    const response = await axiosWithCredentials.get('/user/portal?id=' + ID);

    return response.data;
})
export const portalSlice = createSlice({
    name: 'portal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortal.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPortal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.portal;
                state.theme = ColorTheme.find(x => x.ID === Number(action.payload.portal.Theme));
            })
            .addCase(fetchPortal.rejected, (state, action) => {
                state.status = 'failed';
                // window.location.href = "/not-found";
                state.error = action.error.message;
            })
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

// Action creators are generated for each case reducer function
export const getPortal = (state) => state.portal.data;
export const getPortalStatus = (state) => state.portal.status;
export const getPortalError = (state) => state.portal.error;
export const getPortalTheme = (state) => state.portal.theme;
export const getUsers = (state) => state.portal.users;
export default portalSlice.reducer