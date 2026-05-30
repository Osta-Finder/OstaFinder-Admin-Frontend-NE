import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';
import techniciansReducer from './slices/techniciansSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    technicians: techniciansReducer,
    users: usersReducer,
  },
});

export default store;
