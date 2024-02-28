import { combineReducers, configureStore } from '@reduxjs/toolkit'

import portalReducer from './features/portal.slice';
import caseReducer from './features/case.slice';
import userReducer from './features/user.slice';
import analyticReducer from './features/analytic.slice';
import messageReducer from './features/message.slice';
import casetwoReducer from './features/casetwo.slice';
import widgetReducer from './features/widget.slice';
import orderReducer from './features/order.slice';

const reducer = combineReducers({
    portal: portalReducer,
    case: caseReducer,
    order: orderReducer,
    user: userReducer,
    analytic: analyticReducer,
    message: messageReducer,
    caseTwo: casetwoReducer,
    widget: widgetReducer
});


export const store =  configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});