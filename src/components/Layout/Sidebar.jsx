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
  PlusIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'لوحة التحكم', icon: Squares2X2Icon, path: '/dashboard' },
  { name: 'اعتمادات الفنيين', icon: CheckBadgeIcon, path: '/technicians' },
  { name: 'إدارة المستخدمين', icon: UsersIcon, path: '/users' },
  { name: 'التحليلات', icon: ChartBarIcon, path: '/analytics' },
  { name: 'إدارة الطلبات', icon: WrenchScrewdriverIcon, path: '/orders' },
  { name: 'رسائل التواصل', icon: EnvelopeIcon, path: '/contacts' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleNewReport = () => {
    toast.success('تم إنشاء تقرير جديد بنجاح!');
    setTimeout(() => {
      navigate('/reports');
      setIsOpen(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userAvatar');
    toast.success('تم تسجيل الخروج بنجاح');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 right-0 z-50 md:static w-64 bg-[#111827] text-white flex flex-col justify-between h-full md:rounded-tl-3xl md:rounded-bl-3xl shadow-2xl border-l border-white/5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="flex items-center justify-between h-28 border-b border-white/5 px-4">
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gradient-to-tr from-[#D97706] to-orange-400 p-2.5 rounded-2xl shadow-[0_0_15px_rgba(217,119,6,0.3)] mb-3 mt-4">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-orange-300 tracking-wide">Osta Finder</h1>
            </div>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-8 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D97706] to-orange-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                <span className="font-semibold text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-5 space-y-4 border-t border-white/5 bg-[#1f2937]/30">
          <button
            onClick={handleNewReport}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D97706] to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm font-bold transform hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5" />
            <span>إنشاء تقرير جديد</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-white/5 hover:text-red-400 rounded-2xl transition-all duration-300 text-sm font-semibold group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
