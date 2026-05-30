import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    { id: 'USR-001', name: 'أحمد محمود', email: 'ahmed@example.com', role: 'عميل', status: 'نشط', date: '10 أكتوبر 2023' },
    { id: 'USR-002', name: 'سارة إبراهيم', email: 'sara@example.com', role: 'مسؤول', status: 'نشط', date: '11 أكتوبر 2023' },
    { id: 'USR-003', name: 'كريم حسن', email: 'karim@example.com', role: 'عميل', status: 'محظور', date: '12 أكتوبر 2023' },
  ],
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
