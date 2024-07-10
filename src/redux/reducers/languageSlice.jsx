import { createSlice } from '@reduxjs/toolkit';
import strings from '../../helper/Language/LocalizedStrings';

const initialState = {
  language: 'eng',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      strings.setLanguage(action.payload); 
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
