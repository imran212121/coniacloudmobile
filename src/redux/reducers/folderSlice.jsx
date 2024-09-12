import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  folderPath: [],
  currentFolderId: null, // Initial folder or root folder
};

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    setFolderPath: (state, action) => {
      state.folderPath = action.payload;
    },
    setCurrentFolderId: (state, action) => {
      state.currentFolderId = action.payload;
    },
    resetFolderPath: (state) => {
      state.folderPath = [];
    },
  },
});

export const { setFolderPath, setCurrentFolderId, resetFolderPath } = folderSlice.actions;
export default folderSlice.reducer;
