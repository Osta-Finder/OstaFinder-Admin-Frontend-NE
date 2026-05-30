import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useSelector((state) => state.theme);

  return (
    <div className="flex h-screen bg-gray-50 rtl" dir="rtl">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
