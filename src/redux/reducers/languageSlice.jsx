// src/redux/reducers/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../helper/Language/LocalizedStrings';

const initialState = {
  language: 'eng',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      strings.setLanguage(action.payload); // Assuming this function correctly sets the language
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const loadLanguageFromStorage = () => async (dispatch) => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
  }
};

export default languageSlice.reducer;
