
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import workspaceSlice from './reducers/workspaceSlice';
import languageSlice , { loadLanguageFromStorage } from './reducers/languageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageSlice,
    workspace:workspaceSlice,
  },
});
store.dispatch(loadLanguageFromStorage());
export default store;

