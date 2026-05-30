import React from 'react';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#A85121] leading-tight">أوستا أدمن</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="بحث..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E56E24]/50"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Cog6ToothIcon className="w-6 h-6" />
          </button>

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
