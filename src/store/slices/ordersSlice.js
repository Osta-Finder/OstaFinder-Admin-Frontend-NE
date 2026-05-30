import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [
    { id: 'ORD-001', customerName: 'أحمد محمود', assignedTech: 'محمد علي', category: 'سباكة', status: 'مكتمل', date: '10 أكتوبر 2023' },
    { id: 'ORD-002', customerName: 'سارة إبراهيم', assignedTech: 'غير معين', category: 'كهرباء', status: 'قيد الانتظار', date: '11 أكتوبر 2023' },
    { id: 'ORD-003', customerName: 'كريم حسن', assignedTech: 'ياسر حسين', category: 'نجارة', status: 'جاري العمل', date: '12 أكتوبر 2023' },
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
    }
  },
});

export const { deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
