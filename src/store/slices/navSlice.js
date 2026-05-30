import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeNav: 'dashboard',
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setActiveNav: (state, action) => {
      state.activeNav = action.payload;
    },
  },
});

export const { setActiveNav } = navSlice.actions;
export default navSlice.reducer;
