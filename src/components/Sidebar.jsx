import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveNav } from '../store/slices/navSlice';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: '📊', path: '/' },
  { id: 'reports', label: 'التقارير', icon: '📈', path: '/reports' },
  { id: 'customers', label: 'العملاء', icon: '👥', path: '/customers' },
  { id: 'services', label: 'الخدمات', icon: '⚙️', path: '/services' },
  { id: 'settings', label: 'الإعدادات', icon: '🔧', path: '/settings' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    dispatch(setActiveNav(item.id));
    navigate(item.path);
  };

  const handleCreateReport = () => {
    navigate('/reports');
    toast.success('تم الانتقال إلى صفحة التقارير');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    toast.success('تم تسجيل الخروج بنجاح');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-72' : 'w-24'
        } bg-black text-white transition-all duration-300 flex flex-col shadow-2xl rtl`}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                أ
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-xl">أوستا</h2>
                <p className="text-xs text-orange-400">أدمن</p>
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg mx-auto">
              أ
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-8 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex flex-col items-center gap-2 px-4 py-4 rounded-2xl transition-all duration-200 group hover:bg-orange-500/10 active:bg-orange-500/20`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{item.icon}</span>
              {isOpen && (
                <span className="font-semibold text-xs text-center group-hover:text-orange-400 transition-colors">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        {/* CTA Button */}
        <div className="p-4 space-y-3">
          <button 
            onClick={handleCreateReport}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center gap-2"
          >
            <span className="text-2xl">+</span>
            {isOpen && <span className="text-xs">إنشاء تقرير</span>}
          </button>

          {isOpen && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-orange-400 py-3 transition-colors duration-200 text-xs font-medium"
            >
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
