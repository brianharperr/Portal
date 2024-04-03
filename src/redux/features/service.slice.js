import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithCredentials } from '../../configs/axios'

const initialState = {
    data: [],
    single: null,
    status: 'idle',
    error: null
}

export const fetchService = createAsyncThunk('/services/fetchService', async (payload) => {   
    const response = await axiosWithCredentials.get('/service', { params: payload });
    return response.data;

})

export const createService = createAsyncThunk('/services/createService', async (payload, {rejectWithValue}) => {
    try{ 
        const response = await axiosWithCredentials.post('/service', payload);
        return response.data;
    }catch(err)
    {
          return rejectWithValue(err.response.data.code)
    }
})
export const fetchServices = createAsyncThunk('/services/fetchServices', async (portalID) => {   
    const response = await axiosWithCredentials.post('/procedure/services', {
        PortalID: portalID
    });
    return response.data;

})

export const updateDescription = createAsyncThunk('/services/updateDescription', async (payload) => {   
    const response = await axiosWithCredentials.put('/service/description', payload);
    return response.data;

})

export const updateTaskName = createAsyncThunk('/services/updateTaskName', async (payload) => {
    const response = await axiosWithCredentials.put('/service/task/name', payload);

    return response.data;
})

export const updateName = createAsyncThunk('/services/updateName', async (payload, {rejectWithValue}) => {  
    try{ 
        const response = await axiosWithCredentials.put('/service/name', payload);
        return response.data;
    }catch(err)
    {
          return rejectWithValue(err.response.data.code)
    }

})
export const updateService = createAsyncThunk('/services/updateService', async (payload) => {
    const response = await axiosWithCredentials.put('/service', payload);

    return response.data;
});

export const duplicateService = createAsyncThunk('/services/duplicateService', async (payload) => {
    const response = await axiosWithCredentials.post('/service/duplicate', payload);

    return response.data;
});

export const swapTaskPositions = createAsyncThunk('/services/swapTaskPositions', async (payload) => {
    const response = await axiosWithCredentials.put('/service/task/swap-position', payload);

    return response.data;
});

export const swapOptionPositions = createAsyncThunk('/services/swapOptionPositions', async (payload) => {
    const response = await axiosWithCredentials.put('/service/task/option/swap-position', payload);

    return response.data;
});

export const deleteService = createAsyncThunk('/services/deleteService', async (payload, {rejectWithValue}) => {

    try{
        var response = await axiosWithCredentials.post('/service/delete', payload);
        if(response && response.status === 200){
            return response.data;
        }
        throw response;
    }catch(err)
    {
          return rejectWithValue(err.response.data.code)
    }

})

export const updateOption = createAsyncThunk('/services/updateOption', async (payload) => {
    const response = await axiosWithCredentials.put('/service/option', payload);
    
    return response.data;
});

export const deleteOption = createAsyncThunk('/services/deleteOption', async (payload) => {
    const response = await axiosWithCredentials.post('/procedure/defaulttaskoption/delete', payload);
    
    return response.data;
});

export const reorderDefaultTasks = createAsyncThunk('/services/reorderDefaultTasks', async (payload) => {
    const response = await axiosWithCredentials.post('/procedure/task/reorder', payload);
    
    return response.data;
});

export const deleteDefaultTask = createAsyncThunk('/procedure/deleteDefaultTask', async (payload) => {
    const response = await axiosWithCredentials.post('/procedure/defaulttask/delete', payload);
    
    return response.data;
});


export const reorderDefaultTaskOptions = createAsyncThunk('/procedure/reorderDefaultTaskOptions', async (payload) => {
    const response = await axiosWithCredentials.post('/procedure/option/reorder', payload);
    
    return response.data;
});

export const createTask = createAsyncThunk('/services/createTask', async (payload) => {
    const response = await axiosWithCredentials.post('/service/task', {
        PortalID: payload.PortalID,
        ServiceID: payload.ServiceID,
        Name: payload.Name
    });
    
    return response.data;
});

export const createOption = createAsyncThunk('/services/createOption', async (payload) => {
    const response = await axiosWithCredentials.post('/service/option/create', payload);
    
    return response.data;
});

export const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        updateOptionType: (state, action) => {
            const { taskID, optionID, newType } = action.payload;

            return {
              ...state,
              single: {
                ...state.single,
                DefaultTasks: state.single.DefaultTasks.map(task => {
                  if (task.ID === taskID) {
                    return {
                      ...task,
                      DefaultTaskOptions: task.DefaultTaskOptions.map(option => {
                        if (option.ID === optionID) {
                          return {
                            ...option,
                            Type: newType,
                          };
                        }
                        return option;
                      }),
                    };
                  }
                  return task;
                }),
              },
            };
        },
        updateOptionName: (state, action) => {
            const { taskID, optionID, newName } = action.payload;
            console.log(newName)
            return {
              ...state,
              single: {
                ...state.single,
                DefaultTasks: state.single.DefaultTasks.map(task => {
                  if (task.ID === taskID) {
                    return {
                      ...task,
                      DefaultTaskOptions: task.DefaultTaskOptions.map(option => {
                        if (option.ID === optionID) {
                          return {
                            ...option,
                            Name: newName,
                          };
                        }
                        return option;
                      }),
                    };
                  }
                  return task;
                }),
              },
            };
        },
        updateOptionValue: (state, action) => {
            const { taskID, optionID, newValue } = action.payload;

            return {
              ...state,
              single: {
                ...state.single,
                DefaultTasks: state.single.DefaultTasks.map(task => {
                  if (task.ID === taskID) {
                    return {
                      ...task,
                      DefaultTaskOptions: task.DefaultTaskOptions.map(option => {
                        if (option.ID === optionID) {
                          return {
                            ...option,
                            Value: newValue,
                          };
                        }
                        return option;
                      }),
                    };
                  }
                  return task;
                }),
              },
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.status = 'succeeded';

                state.data = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(createService.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(createService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateService.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateTaskName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateDescription.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(swapOptionPositions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(duplicateService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteService.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOption.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updateOption.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload
            })
            .addCase(updateOption.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTask.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            
            .addCase(createTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(swapTaskPositions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteOption.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteOption.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload
            })
            .addCase(deleteOption.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(reorderDefaultTasks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(reorderDefaultTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(reorderDefaultTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteDefaultTask.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deleteDefaultTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(deleteDefaultTask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createOption.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(createOption.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(createOption.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(reorderDefaultTaskOptions.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(reorderDefaultTaskOptions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(reorderDefaultTaskOptions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
// Action creators are generated for each case reducer function
export const { updateOptionType, updateOptionName, updateOptionValue } = serviceSlice.actions;
export const getServices = (state) => state.services.data;
export const getService = (state) => state.services.single;
export const getServicesStatus = (state) => state.services.status;
export const getServicesError = (state) => state.services.error;

export default serviceSlice.reducer