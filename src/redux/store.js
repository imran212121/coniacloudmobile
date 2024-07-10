
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import languageSlice from './reducers/languageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageSlice,
  },
});

export default store;

