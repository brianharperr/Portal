import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios'
import ColorTheme from '../../configs/color-themes';

const initialState = {
    data: [],
    selected: null,
    status: 'idle',
    error: null,
    theme: null
}

export const fetchPortals = createAsyncThunk('portal/fetchPortals', async () => {
        const response = await axiosWithCredentials.get('/procedure/FetchPortalsFromUser');
        return response.data;

})

export const updateColorTheme = createAsyncThunk('portal/updateColorTheme', async (payload) => {
    const response = await axiosWithCredentials.post('/portal/color-theme', payload);

    return response.data;
})

export const updateLogo = createAsyncThunk('portal/updateLogo', async (payload) => {
    const response = await axiosWithCredentials.post('/portal/logo', payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
     });

    return response.data;
})

export const deleteLogo = createAsyncThunk('portal/deleteLogo', async (ID) => {
    const response = await axiosWithCredentials.delete('/portal/logo?id=' + ID);

    return response.data;
})

export const updateSubdomain = createAsyncThunk('portal/updateSubdomain', async (payload) => {
    const response = await axiosWithCredentials.post('/portal/subdomain', payload);

    return response.data;
})

export const updateAutomaticRenewal = createAsyncThunk('portal/updateAutomaticRenewal', async (data) => {

    var payload = {
        SubscriptionID: data.SubscriptionID,
        Value: data.Value
    };

    const response = await axiosWithCredentials.patch('/stripe/auto-renewal', payload);

    return response.data;
})

export const deletePortal = createAsyncThunk('portal/deletePortal', async (portal) => {

    var payload = {
        PortalID: portal.ID,
        MasterPortalID: portal.MasterID,
        UserID: portal.UserID
    };

    const response = await axiosWithCredentials.post('/portal/delete', payload);

    return response.data;
})

export const adminPortalSlice = createSlice({
    name: 'adminPortals',
    initialState,
    reducers: {
        select: (state, action) => {
            state.theme = ColorTheme.find(x => x.ID === Number(action.payload.Theme));
            state.selected = action.payload.ID;
            localStorage.setItem('SelectedPortal', action.payload.ID);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortals.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPortals.fulfilled, (state, action) => {
                state.status = 'succeeded';

                if(action.payload.length === 0){
                    window.location.href = '/create-portal';
                }

                if(!state.selected){
                    state.selected = action.payload[0].ID;
                    localStorage.setItem('SelectedPortal', action.payload[0].ID);
                }
                state.data = action.payload;

                state.theme = ColorTheme.find(x => x.ID === Number(state.data.find(x => x.ID === state.selected).Theme));
            })
            .addCase(fetchPortals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateColorTheme.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateColorTheme.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.theme = ColorTheme.find(x => x.ID === action.payload);

                var tmp_portal_idx = state.data.findIndex(x => x.ID === state.selected);
                state.data[tmp_portal_idx].Theme = action.payload;
            })
            .addCase(updateColorTheme.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateLogo.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateLogo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                var tmp_portal_idx = state.data.findIndex(x => x.ID === state.selected);
                state.data[tmp_portal_idx].LogoSource = action.payload;
            })
            .addCase(updateAutomaticRenewal.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(updateLogo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteLogo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.find(x => x.ID === state.selected).LogoSource = action.payload;
            })
            .addCase(updateSubdomain.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateSubdomain.fulfilled, (state, action) => {
                state.status = 'succeeded';
                var tmp_portal_idx = state.data.findIndex(x => x.ID === state.selected);
                if(action.payload.Name){
                    state.data[tmp_portal_idx].Name = action.payload.Name;
                }
                if(action.payload.Subdomain){
                    state.data[tmp_portal_idx].Subdomain = action.payload.Subdomain;
                }
            })
            .addCase(updateSubdomain.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deletePortal.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deletePortal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if(action.payload.length === 0){
                    window.location.href = '/create-portal';
                }else{
                    window.location.href= '/';
                }
                state.selected = action.payload[0].ID;
                state.data = action.payload;

                state.theme = ColorTheme.find(x => x.ID === Number(state.data.find(x => x.ID === state.selected).Theme));

            })
            .addCase(deletePortal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
// Action creators are generated for each case reducer function
export const { select } = adminPortalSlice.actions;

export const getPortals = (state) => state.adminPortal.data;
export const getPortalsStatus = (state) => state.adminPortal.status;
export const getPortalsError = (state) => state.adminPortal.error;
export const getSelectedPortal = (state) => {
    if(state.adminPortal &&
    state.adminPortal.data &&
    state.adminPortal.selected){
        return state.adminPortal.data.find(x => x.ID === state.adminPortal.selected);
    }else{
        return null
    }
};
export const getTheme = (state) => state.adminPortal.theme;

export default adminPortalSlice.reducer