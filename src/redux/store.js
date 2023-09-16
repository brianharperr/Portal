import { combineReducers, configureStore } from '@reduxjs/toolkit'

import portalReducer from './features/portal.slice';
import caseReducer from './features/case.slice';
import userReducer from './features/user.slice';
import analyticReducer from './features/analytic.slice';
import messageReducer from './features/message.slice';


const reducer = combineReducers({
    portal: portalReducer,
    case: caseReducer,
    user: userReducer,
    analytic: analyticReducer,
    message: messageReducer
});


export const store =  configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});