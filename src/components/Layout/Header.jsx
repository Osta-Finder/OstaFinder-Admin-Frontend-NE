import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'طلب جديد من أحمد محمود', time: 'منذ 5 دقائق', read: false },
    { id: 2, message: 'تم إكمال الصيانة للعميل سارة', time: 'منذ ساعة', read: false },
    { id: 3, message: 'تقييم جديد: 5 نجوم من كريم حسن', time: 'منذ ساعتين', read: true },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSettings = () => {
    navigate('/settings');
    setShowMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    toast.success('تم تسجيل الخروج بنجاح');
    setShowMenu(false);
    setShowProfile(false);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowMenu(false);
    setShowNotifications(false);
  };

  const handleViewProfile = () => {
    toast.info('ملف المستخدم الشخصي');
    setShowProfile(false);
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
    toast.info('تم حذف جميع الاشعارات');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">الاشعارات</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {notifications.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-200">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id)}
                          className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notif.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={handleClearNotifications}
                        className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        حذف جميع الاشعارات
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-sm">لا توجد اشعارات</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {user && user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#D97706] flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </button>

            {showProfile && user && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#D97706] flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleViewProfile}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-200"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>ملفي الشخصي</span>
                </button>

                <button
                  onClick={handleSettings}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-200"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>الإعدادات</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
