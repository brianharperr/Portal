import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios';

const initialState = {
    data: [],
    CasesOverTime: [],
    CasesPerService: [],
    CasesPerHome: [],
    CasesPerDirector: [],
    AvgCaseCompletion: [],
    AvgServiceCompletion: [],
    YearlyGoal: null,
    status: 'idle',
    error: null,
}

export const fetchCasesOverTime = createAsyncThunk('analytics/fetchCasesOverTime', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/cases-over-time', { params: payload });
    return response.data;
})

export const fetchCasesPerService = createAsyncThunk('analytics/fetchCasesPerService', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/cases-per-service', { params: payload });
    return response.data;
})

export const fetchAvgCaseCompletion = createAsyncThunk('analytics/fetchAvgCaseCompletion', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/avg-case-completion', { params: payload });
    return response.data;
})

export const fetchCasesPerHome = createAsyncThunk('analytics/fetchCasesPerHome', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/cases-per-home', { params: payload });
    return response.data;
})

export const fetchCasesPerDirector = createAsyncThunk('analytics/fetchCasesPerDirector', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/cases-per-user', { params: payload });
    return response.data;
})

export const fetchAvgServiceCompletion = createAsyncThunk('analytics/fetchAvgServiceCompletion', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/avg-service-completion', { params: payload });
    return response.data;
})

export const fetchYearlyGoal = createAsyncThunk('analytics/fetchYearlyGoal', async (payload) => {
    const response = await axiosWithCredentials.get('/analytics/yearly-goal', { params: payload });
    return response.data;
})

export const updateYearlyGoal = createAsyncThunk('analytics/updateYearlyGoal', async (payload) => {
    const response = await axiosWithCredentials.put('/analytics/yearly-goal', payload);
    return response.data;
})

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCasesOverTime.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCasesOverTime.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.CasesOverTime = action.payload;
            })
            .addCase(fetchCasesOverTime.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCasesPerService.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCasesPerService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.CasesPerService = action.payload;
            })
            .addCase(fetchCasesPerService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAvgCaseCompletion.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchAvgCaseCompletion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.AvgCaseCompletion = action.payload;
            })
            .addCase(fetchAvgCaseCompletion.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCasesPerHome.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCasesPerHome.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.CasesPerHome = action.payload;
            })
            .addCase(fetchCasesPerHome.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCasesPerDirector.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCasesPerDirector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.CasesPerDirector = action.payload;
            })
            .addCase(fetchCasesPerDirector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchAvgServiceCompletion.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchAvgServiceCompletion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.AvgServiceCompletion = action.payload;
            })
            .addCase(fetchAvgServiceCompletion.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchYearlyGoal.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchYearlyGoal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.YearlyGoal = action.payload;
            })
            .addCase(fetchYearlyGoal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateYearlyGoal.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateYearlyGoal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.YearlyGoal.YearlyGoal = action.payload;
            })
            .addCase(updateYearlyGoal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

    }
})

// Action creators are generated for each case reducer function
export const getCasesOverTime = (state) => state.analytic.CasesOverTime;
export const getCasesPerService = (state) => state.analytic.CasesPerService;
export const getAvgCaseCompletion = (state) => state.analytic.AvgCaseCompletion;
export const getCasesPerHome = (state) => state.analytic.CasesPerHome;
export const getCasesPerDirector = (state) => state.analytic.CasesPerDirector;
export const getAvgServiceCompletion = (state) => state.analytic.AvgServiceCompletion;
export const getYearlyGoal = (state) => state.analytic.YearlyGoal;

export default analyticsSlice.reducer