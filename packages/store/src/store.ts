import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import productSelectionReducer from './slices/productSelectionSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import paymentReducer from './slices/paymentSlice';

/**
 * Configure the Redux store with RTK Query and slices
 */
export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Feature slices
    productSelection: productSelectionReducer,
    enrollment: enrollmentReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

/**
 * Enable refetchOnFocus and refetchOnReconnect behaviors
 */
setupListeners(store.dispatch);

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
