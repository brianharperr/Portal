import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';
import Case from '../../data/Case';
import Patient from '../../data/Patient';
import Contact from '../../data/Contact';
import User from '../../data/User';
import Service from '../../data/Service';
import Home from '../../data/Home';
const initialState = {
    data: new Case()
};

export const fetchCase = createAsyncThunk('case/fetchCase', async (payload) => {
    const response = await axiosWithCredentials.get('/case', { params: payload });
    return response.data;
})

export const updatePatient = createAsyncThunk('/case/updatePatient', async (payload) => {
    const response = await axiosWithCredentials.patch('/patient/' + payload.Method, payload);
    return response.data;
});

export const updateContact = createAsyncThunk('/case/updateContact', async (payload) => {
    const response = await axiosWithCredentials.patch('/contact/' + payload.Method, payload);
    return response.data;
});

export const updateCase = createAsyncThunk('/case/updateCase', async (payload) => {
    const response = await axiosWithCredentials.patch('/case/' + payload.Method, payload);
    return response.data;
});
export const updateOption = createAsyncThunk('/case/updateOption', async (payload) => {
    const response = await axiosWithCredentials.patch('/task/option', payload);
    return response.data;
});

export const completeTask = createAsyncThunk('/case/completeTask', async (payload) => {
    const response = await axiosWithCredentials.patch('/task/complete', payload);
    return response.data;
});
export const editTask = createAsyncThunk('/case/editTask', async (payload) => {
    const response = await axiosWithCredentials.patch('/task/edit', payload);
    return response.data;
});

export const caseSlice = createSlice({
    name: 'case',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCase.fulfilled, (state, action) => {
                state.data = new Case(action.payload);
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                state.data.Patient = new Patient(action.payload);
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                state.data.Contact = new Contact(action.payload);
            })
            .addCase(updateCase.fulfilled, (state, action) => {
                state.data.Tasks = action.payload.Tasks;
                state.data.Home = new Home(action.payload.Home);
                state.data.Service = new Service(action.payload.Service);
                state.data.User = new User(action.payload.User);
                state.data.Status = action.payload.Status;
                state.data.LocationID = action.payload.LocationID;
                state.data.PreArranged = action.payload.PreArranged;
                state.data.DateCreated = action.payload.DateCreated;
                state.data.DateCompleted = action.payload.DateCompleted;
            })
            .addCase(completeTask.fulfilled, (state, action) => {
                var newCase = {
                    ...state.data,
                    Tasks: state.data.Tasks.map(x => x.ID === action.payload.ID ? action.payload : x)
                };
                state.data = newCase;
            })
            .addCase(updateOption.fulfilled, (state, action) => {
                var newCase = {
                    ...state.data,
                    Tasks: state.data.Tasks.map(x => ({
                        ...x, 
                        TaskOptions: x.TaskOptions.map(y => y.ID === action.payload.ID ? action.payload : y)
                    }))
                };
                state.data = newCase;
            })
            .addCase(editTask.fulfilled, (state, action) => {
                var newCase = {
                    ...state.data,
                    Tasks: state.data.Tasks.map(x => x.ID === action.payload.ID ? action.payload : x)
                };
                state.data = newCase;
            })
    }
})

export const getCase = (state) => state.caseTwo.data;

export default caseSlice.reducer