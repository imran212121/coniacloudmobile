
      import { createSlice } from '@reduxjs/toolkit';
      import React, {useState,useEffect } from 'react'
      import axios from 'axios';
      import AsyncStorage from '@react-native-async-storage/async-storage';
      import { baseURL } from '../../constant/settings';
     
      const initialState = {
        isLoggedIn: false,
        user: null,
        loading: false,
        error: null,
      };
      
      export const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
          loginStart: (state) => {
            state.loading = true;
            state.error = null;
          },
          loginSuccess: (state, action) => {
            state.loading = false;
            state.isLoggedIn = true;
            state.user = action.payload;
          },
          loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
          },
        },
      });
      
      export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
      
      export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
      export const selectUser = (state) => state.auth.user;
      
      export const loginAsync = (credentials) => async (dispatch) => {
      console.log("********************");
        dispatch(loginStart());
        try {
          const response = await axios.post(baseURL+'/auth/login', credentials);
          console.log("*******loginStart*************",response.data.user);
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          
          dispatch(loginSuccess(response.data.user));
        } catch (error) {
          console.log("**********loginFailure**********",error);
          dispatch(loginFailure(error.message));
        }
      };
      
      export default authSlice.reducer;
      