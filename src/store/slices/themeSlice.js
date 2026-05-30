import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  primaryColor: 'orange',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
  },
});

export const { setThemeMode, setPrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;
