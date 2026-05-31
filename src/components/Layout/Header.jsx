import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleSettings = () => {
    navigate('/settings');
    setShowMenu(false);
  };

  const handleLogout = () => {
    toast.success('تم تسجيل الخروج بنجاح');
    setShowMenu(false);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[#D97706] leading-tight">أوستا أدمن</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="بحث..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/50"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>

            {showMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  onClick={handleSettings}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>الإعدادات</span>
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm mr-2">
            <img 
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
