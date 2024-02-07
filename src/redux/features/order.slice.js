import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    Messages: null,
    status: 'idle',
    error: null,
}

export const fetchOrders = createAsyncThunk('case/fetchOrders', async (payload) => {
 
    var payload = {
        id: payload.PortalID,
        limit: payload.pageView,
        offset: payload.page * payload.pageView,
        name: payload.filter.name,
        home: payload.filter.home,
        service: payload.filter.service,
        director: payload.filter.director,
        status: payload.filter.status
    }
    return await axiosWithCredentials.get('/procedure/order-table', { params: payload })
})

export const fetchCase = createAsyncThunk('case/fetchCase', async (payload) => {
    const response = await axiosWithCredentials.get('/case', { params: payload });

    return response.data;
})

export const createCase = createAsyncThunk('case/createCase', async (payload) => {
    const response = await axiosWithCredentials.post('/case', payload);

    return response.data;
})

export const deleteCase = createAsyncThunk('case/deleteCase', async (caseID) => {
    const response = await axiosWithCredentials.delete('/case?id=' + caseID);

    return response.data;
})

export const downloadTags = createAsyncThunk('/case/downloadTags', async (payload) => {
    const response = await axiosWithCredentials.get('case/tag?id=' + payload.ID, {
        responseType: 'blob'
    })
    .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ToeTag-'+ payload.Name +'.pdf');
        document.body.appendChild(link);
        link.click();
    })
    .catch(err => {
        props.redirect("/", err);
    })
    return response.data;
})


export const downloadReport = createAsyncThunk('/case/downloadReport', async (payload) => {
    const response = await axiosWithCredentials.get('case/report?portal=' + payload.PortalID + '&id=' + payload.DisplayID, {
        responseType: 'blob'
    })
    .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Report-'+ payload.Name +'.docx');
        document.body.appendChild(link);
        link.click();
    })
    .catch(err => {
        props.redirect("/", err);
    })
    return response.data;
})

export const editContact = createAsyncThunk('/case/editContact', async (payload) => {
    const response = await axiosWithCredentials.post('/case/contact', payload);

    return response.data;
})

export const editPatient = createAsyncThunk('/case/editPatient', async (payload) => {
    const response = await axiosWithCredentials.post('/case/patient', payload);

    return response.data;
})

export const editProcessing = createAsyncThunk('/case/editProcessing', async (payload) => {
    const response = await axiosWithCredentials.post('/case/processing', payload);

    return response.data;
})

export const editTask = createAsyncThunk('/case/editTask', async (payload) => {
    const response = await axiosWithCredentials.post('/case/task/update', payload);

    return response.data;
});

export const toggleTaskComplete = createAsyncThunk('/case/editTask', async (ID) => {
    const response = await axiosWithCredentials.post('/case/task/complete?id=' + ID);

    return response.data;
});

export const toggleCaseStatus = createAsyncThunk('/case/toggleCaseStatus', async (payload) => {

    const response = await axiosWithCredentials.put('/case/status', payload);
    return response.data;
});

export const updateCase = createAsyncThunk('/case/updateCase', async (payload) => {
    const response = await axiosWithCredentials.patch('/case' + payload.Method, payload);
    return response.data;
});

export const uncompleteCase = createAsyncThunk('/case/uncompleteCase', async (payload) => {
    const response = await axiosWithCredentials.patch('/case/task/status', payload);
    return response.data;
});

export const updateCaseAndReload = createAsyncThunk('/case/updateAndReloadCase', async (payload) => {
    const response = await axiosWithCredentials.patch('/case' + payload.Method, payload);
    return response.data;
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uncompleteCase.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(fetchOrders.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.Messages = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCase.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCase.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(editTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(updateCase.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(updateCaseAndReload.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(editPatient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(editProcessing.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(fetchCase.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCase.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createCase.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                window.location.href = "/";
            })
            .addCase(createCase.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteCase.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteCase.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                window.location.href = "/";
            })
            .addCase(deleteCase.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(editContact.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(editContact.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(editContact.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(toggleCaseStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
    }
})

// Action creators are generated for each case reducer function
export const getOrders = (state) => state.case.data;

export default orderSlice.reducer