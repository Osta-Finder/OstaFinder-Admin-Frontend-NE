import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Tajawal']" dir="rtl">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAFBFD]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
