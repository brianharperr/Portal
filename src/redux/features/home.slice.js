import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios'

const initialState = {
    data: [],
    status: 'idle',
    error: null
}

export const fetchHomes = createAsyncThunk('/homes/fetchHomes', async (portalID) => {
        const response = await axiosWithCredentials.post('/procedure/homes', {
            PortalID: portalID
        });

        return response.data;

})

export const createHome = createAsyncThunk('/homes/createHome', async (payload) => {
    try{
        var response = await axiosWithCredentials.post('/location/home', payload);
        if(response && response.status === 200){
            return response.data;
        }
        throw response;
    }catch(err)
    {
        throw err;
    }
});

export const updateHome = createAsyncThunk('/homes/updateHome', async (payload) => {
    const response = await axiosWithCredentials.put('/location/home', payload);

    return response.data;
});

export const deleteHome = createAsyncThunk('/homes/deleteHome', async (payload, {rejectWithValue}) => {
    try{
    const response = await axiosWithCredentials.post('/location/home/delete', payload);
    
    return response.data;
    }catch(err){
        if(!err.response){
            throw err;
        }
        return rejectWithValue(err.response.data)
    }
})

export const homeSlice = createSlice({
    name: 'homes',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomes.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchHomes.fulfilled, (state, action) => {
                state.status = 'succeeded';

                state.data = action.payload;
            })
            .addCase(fetchHomes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createHome.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createHome.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload
            })
            .addCase(createHome.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateHome.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateHome.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateHome.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteHome.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteHome.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteHome.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
// Action creators are generated for each case reducer function
export const {  } = homeSlice.actions;
export const getHomes = (state) => state.homes.data;
export const getHomesStatus = (state) => state.homes.status;
export const getHomesError = (state) => state.homes.error;

export default homeSlice.reducer