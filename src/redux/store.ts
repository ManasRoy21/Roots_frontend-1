import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import familyReducer from './slices/familySlice';
import memoryReducer from './slices/memorySlice';
import dashboardReducer from './slices/dashboardSlice';
import treeReducer from './slices/treeSlice';

// Configure the store with typed reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    family: familyReducer,
    memory: memoryReducer,
    dashboard: dashboardReducer,
    tree: treeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for File objects in memory uploads
        ignoredActions: ['memory/uploadPhotos/pending', 'memory/uploadPhotos/fulfilled'],
        // Ignore these paths in the state for File objects
        ignoredPaths: ['memory.uploadingFiles'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed versions of the `useDispatch` and `useSelector` hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the store as default for backward compatibility
export default store;