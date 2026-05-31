import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'طلب جديد من أحمد محمود', time: 'منذ 5 دقائق', read: false },
    { id: 2, message: 'تم إكمال الصيانة للعميل سارة', time: 'منذ ساعة', read: false },
    { id: 3, message: 'تقييم جديد: 5 نجوم من كريم حسن', time: 'منذ ساعتين', read: true },
  ]);

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
                  <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
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
              <img 
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                alt="Admin Profile" 
                className="w-full h-full object-cover"
              />
            </button>

            {showProfile && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                      alt="Admin Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-right">
                      <p className="font-bold text-gray-900">أحمد محمود</p>
                      <p className="text-xs text-gray-500">مدير النظام</p>
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
                  <ArrowRightOnRectangleIcon className="w-5 h-5 rotate-180" />
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
