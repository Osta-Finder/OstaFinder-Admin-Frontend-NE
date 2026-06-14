import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminDataProvider } from '../../store/AdminDataContext';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <AdminDataProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans" dir="rtl">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-6 bg-[#FAFBFD] min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
};

export default MainLayout;
