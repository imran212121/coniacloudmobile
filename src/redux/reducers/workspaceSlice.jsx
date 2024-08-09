import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  workspace: 0,
};

export const updateWorkspaceAsync = createAsyncThunk(
  'workspace/updateWorkspace',
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
      console.log('action.payload', action.payload);
      state.workspace = action.payload; // Update workspace directly
    });
  },
});

export default workspaceSlice.reducer;
