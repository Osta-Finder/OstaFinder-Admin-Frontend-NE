import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: `USR-00${state.users.length + 1}`,
        date: new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      };
      state.users.unshift(newUser);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    toggleUserStatus: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.status = user.status === 'نشط' ? 'محظور' : 'نشط';
      }
    }
  },
});

export const { addUser, deleteUser, toggleUserStatus } = usersSlice.actions;
export default usersSlice.reducer;
