import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminDataProvider } from '../../store/AdminDataContext';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminDataProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans" dir="rtl">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAFBFD] min-h-0 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
};

export default MainLayout;
