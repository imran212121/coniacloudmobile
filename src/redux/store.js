
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import languageSlice , { loadLanguageFromStorage } from './reducers/languageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageSlice,
  },
});
store.dispatch(loadLanguageFromStorage());
export default store;

