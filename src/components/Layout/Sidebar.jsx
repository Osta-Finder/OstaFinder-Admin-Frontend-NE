import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Squares2X2Icon, 
  CheckBadgeIcon, 
  UsersIcon, 
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'لوحة القيادة', icon: Squares2X2Icon, path: '/dashboard' },
  { name: 'اعتمادات الفنيين', icon: CheckBadgeIcon, path: '/technicians' },
  { name: 'إدارة المستخدمين', icon: UsersIcon, path: '/users' },
  { name: 'التحليلات', icon: ChartBarIcon, path: '/analytics' },
  { name: 'إدارة الطلبات', icon: WrenchScrewdriverIcon, path: '/orders' },
  { name: 'الدعم الفني', icon: ChartBarIcon, path: '/support' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNewReport = () => {
    toast.success('تم إنشاء تقرير جديد بنجاح!');
    setTimeout(() => {
      navigate('/reports');
    }, 500);
  };

  const handleLogout = () => {
    toast.success('تم تسجيل الخروج بنجاح');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#1F2937] to-[#111827] text-white flex flex-col justify-between h-full rounded-tl-3xl rounded-bl-3xl">
      <div>
        <div className="flex items-center justify-center h-24 border-b border-white/10">
          <div className="flex flex-col items-center">
            <div className="bg-[#D97706] p-2 rounded-full mb-2">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#D97706]">Osta Finder</h1>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#D97706] text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-4">
        <button
          onClick={handleNewReport}
          className="w-full flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white py-3 rounded-xl transition-colors text-sm font-bold"
        >
          <span>إنشاء تقرير جديد</span>
          <PlusIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-colors text-sm"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
