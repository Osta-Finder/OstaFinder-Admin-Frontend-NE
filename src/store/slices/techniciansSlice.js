import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  technicians: [
    { id: 1, name: 'أحمد محمود', email: 'ahmed.m@example.com', specialty: 'سباكة عامة', experience: '5 سنوات', status: 'قيد المراجعة', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: 2, name: 'مصطفى علي', email: 'mostafa.a@example.com', specialty: 'كهرباء منازل', experience: '8 سنوات', status: 'بانتظار المقابلة', initials: 'م.ع' },
    { id: 3, name: 'ياسر حسين', email: 'yasser.h@example.com', specialty: 'نجارة', experience: '3 سنوات', status: 'قيد المراجعة', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  ],
  stats: {
    pending: 24,
    approvedToday: 12,
    urgent: 5,
  }
};

const techniciansSlice = createSlice({
  name: 'technicians',
  initialState,
  reducers: {
    approveTechnician: (state, action) => {
      const tech = state.technicians.find(t => t.id === action.payload);
      if (tech && tech.status !== 'معتمد') {
        tech.status = 'معتمد';
        state.stats.pending = Math.max(0, state.stats.pending - 1);
        state.stats.approvedToday += 1;
      }
    },
    blockTechnician: (state, action) => {
      const tech = state.technicians.find(t => t.id === action.payload);
      if (tech) {
        tech.status = 'محظور';
        state.stats.pending = Math.max(0, state.stats.pending - 1);
      }
    }
  },
});

export const { approveTechnician, blockTechnician } = techniciansSlice.actions;
export default techniciansSlice.reducer;
