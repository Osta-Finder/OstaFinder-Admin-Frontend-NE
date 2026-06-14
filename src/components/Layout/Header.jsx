import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { workerAPI, requestAPI } from '../../services/adminApi';

const Header = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const SEARCH_ITEMS = [
    { label: 'لوحة التحكم', path: '/dashboard' },
    { label: 'إدارة الطلبات', path: '/orders' },
    { label: 'اعتماد الفنيين', path: '/technicians' },
    { label: 'إدارة المستخدمين', path: '/users' },
    { label: 'التحليلات والإحصائيات', path: '/analytics' },
    { label: 'إدارة الخدمات', path: '/services' },
    { label: 'التقارير', path: '/reports' },
    { label: 'الدعم الفني', path: '/support' },
    { label: 'الإعدادات', path: '/settings' },
    { label: 'الملف الشخصي', path: '/profile' }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Restore saved avatar if not already on the user object
      const savedAvatar = localStorage.getItem('userAvatar');
      if (savedAvatar && !parsed.avatar) {
        parsed.avatar = savedAvatar;
      }
      setUser(parsed);
    }

    const handleUserUpdate = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        const parsed = JSON.parse(updatedUser);
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar && !parsed.avatar) {
          parsed.avatar = savedAvatar;
        }
        setUser(parsed);
      }
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  // جيب الإشعارات من الباك‌اند
  useEffect(() => {
    loadNotifications();
    // بيحدث كل دقيقة
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const [pending, orders] = await Promise.all([
        workerAPI.getPendingWorkers(),
        requestAPI.getAllRequests(),
      ]);

      const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
      const notifs = [];

      // إشعارات الفنيين المعلقين
      pending.forEach((w) => {
        const id = `worker-${w._id}`;
        if (!clearedIds.includes(id)) {
          notifs.push({
            id,
            message: `فني جديد بانتظار الاعتماد: ${w.name || 'بدون اسم'}`,
            time: w.createdAt ? new Date(w.createdAt).toLocaleDateString('ar-SA') : 'مؤخراً',
            read: readIds.includes(id),
            type: 'worker',
            link: '/technicians',
          });
        }
      });

      // إشعارات الطلبات الجديدة المعلقة
      const pendingOrders = orders.filter(o => o.status === 'معلقة');
      pendingOrders.forEach((o) => {
        const id = `order-${o._id}`;
        if (!clearedIds.includes(id)) {
          notifs.push({
            id,
            message: `طلب جديد معلق من: ${o.user?.name || 'عميل'}`,
            time: o.date ? new Date(o.date).toLocaleDateString('ar-SA') : 'مؤخراً',
            read: readIds.includes(id),
            type: 'order',
            link: '/orders',
          });
        }
      });

      // Sort unread first, then limit to top 10
      notifs.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
      setNotifications(notifs.slice(0, 10));
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowNotifications(false);
        setShowProfile(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    navigate('/profile');
    setShowProfile(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUser = {
          ...user,
          avatar: event.target?.result,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        // Save avatar separately so it persists across logout/login
        localStorage.setItem('userAvatar', event.target?.result);
        window.dispatchEvent(new Event('userUpdated'));
        toast.success('تم تحديث الصورة بنجاح');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readIds.includes(notif.id)) {
      localStorage.setItem('readNotifications', JSON.stringify([...readIds, notif.id]));
    }
    if (notif.link) {
      navigate(notif.link);
      setShowNotifications(false);
    }
  };

  const handleClearNotifications = () => {
    const allIds = notifications.map(n => n.id);
    const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
    const newClearedIds = [...new Set([...clearedIds, ...allIds])];
    localStorage.setItem('clearedNotifications', JSON.stringify(newClearedIds));
    setNotifications([]);
    setShowNotifications(false);
    toast.info('تم حذف جميع الاشعارات');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = SEARCH_ITEMS.filter(item => 
      item.label.includes(query)
    );
    setSearchResults(results);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery('');
    setSearchResults([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header ref={headerRef} className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-lg flex items-center justify-between px-8 shadow-sm border-b border-gray-100/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[#D97706] leading-tight">Osta Finder</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="بحث..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/50"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              {searchResults.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(item.path)}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-sm text-gray-700"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
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
                          onClick={() => handleNotificationClick(notif)}
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

                <label className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-200 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>تحديث الصورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>

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
