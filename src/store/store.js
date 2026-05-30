import { configureStore } from '@reduxjs/toolkit';
import navReducer from './slices/navSlice';
import themeReducer from './slices/themeSlice';
import ordersReducer from './slices/ordersSlice';
import techniciansReducer from './slices/techniciansSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    nav: navReducer,
    theme: themeReducer,
    orders: ordersReducer,
    technicians: techniciansReducer,
    users: usersReducer,
  },
});

export default store;
