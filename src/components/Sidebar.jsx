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
          isOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg rtl`}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                أ
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-lg">أوستا أمن</h2>
                <p className="text-xs text-green-200">الإدارة الإلكترونية</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative group hover:bg-gray-700`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="p-4 border-t border-gray-700 space-y-3">
          <button 
            onClick={handleCreateReport}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <span>+</span>
            {isOpen && <span>إنشاء تقرير جديد</span>}
          </button>

          {isOpen && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white py-2 transition-colors duration-200"
            >
              <span className="text-sm">تسجيل الخروج</span>
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
