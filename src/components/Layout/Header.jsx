import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAdminData } from '../../store/AdminDataContext';

const Header = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { pendingWorkers, orders } = useAdminData(); // ← from shared context, no extra fetch

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const SEARCH_ITEMS = [
    { label: 'لوحة التحكم',          path: '/dashboard' },
    { label: 'إدارة الطلبات',        path: '/orders' },
    { label: 'اعتماد الفنيين',       path: '/technicians' },
    { label: 'إدارة المستخدمين',     path: '/users' },
    { label: 'التحليلات والإحصائيات', path: '/analytics' },
    { label: 'إدارة الخدمات',        path: '/services' },
    { label: 'التقارير',             path: '/reports' },
    { label: 'الدعم الفني',          path: '/support' },
    { label: 'الإعدادات',            path: '/settings' },
    { label: 'الملف الشخصي',         path: '/profile' },
  ];

  // Load user from localStorage
  useEffect(() => {
    const restore = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar && !parsed.avatar) parsed.avatar = savedAvatar;
        setUser(parsed);
      }
    };
    restore();
    window.addEventListener('userUpdated', restore);
    return () => window.removeEventListener('userUpdated', restore);
  }, []);

  // Build notifications from shared context data (no extra API call!)
  useEffect(() => {
    const readIds    = JSON.parse(localStorage.getItem('readNotifications')    || '[]');
    const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
    const notifs = [];

    // Pending technicians
    pendingWorkers.forEach((w) => {
      const id = `worker-${w._id}`;
      if (!clearedIds.includes(id)) {
        notifs.push({
          id,
          message: `فني جديد بانتظار الاعتماد: ${w.name || 'بدون اسم'}`,
          time: w.createdAt
            ? new Date(w.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            : 'مؤخراً',
          read: readIds.includes(id),
          type: 'worker',
          link: '/technicians',
        });
      }
    });

    // Pending orders
    orders
      .filter((o) => o.status === 'معلقة')
      .forEach((o) => {
        const id = `order-${o._id}`;
        if (!clearedIds.includes(id)) {
          notifs.push({
            id,
            message: `طلب جديد معلق من: ${o.user?.name || 'عميل'}`,
            time: o.date
              ? new Date(o.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
              : 'مؤخراً',
            read: readIds.includes(id),
            type: 'order',
            link: '/orders',
          });
        }
      });

    // Unread first — no artificial cap so badge shows the real count
    notifs.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
    setNotifications(notifs);
  }, [pendingWorkers, orders]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setShowNotifications(false);
        setShowProfile(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettings = () => { navigate('/settings'); };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    toast.success('تم تسجيل الخروج بنجاح');
    setShowProfile(false);
    setTimeout(() => navigate('/login'), 500);
  };

  const handleProfileClick = () => {
    setShowProfile((p) => !p);
    setShowNotifications(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = { ...user, avatar: ev.target?.result };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      localStorage.setItem('userAvatar', ev.target?.result);
      window.dispatchEvent(new Event('userUpdated'));
      toast.success('تم تحديث الصورة بنجاح');
    };
    reader.readAsDataURL(file);
  };

  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
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
    const allIds = notifications.map((n) => n.id);
    const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
    localStorage.setItem('clearedNotifications', JSON.stringify([...new Set([...clearedIds, ...allIds])]));
    setNotifications([]);
    setShowNotifications(false);
    toast.info('تم مسح جميع الإشعارات');
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchResults(q.trim() ? SEARCH_ITEMS.filter((i) => i.label.includes(q)) : []);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery('');
    setSearchResults([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header ref={headerRef} className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-lg flex items-center justify-between px-8 shadow-sm border-b border-gray-100/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[#D97706] leading-tight">Osta Finder</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
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
              {searchResults.map((item, i) => (
                <button key={i} onClick={() => handleSearchSelect(item.path)}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-sm text-gray-700">
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications((p) => !p); setShowProfile(false); }}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="الإشعارات"
            >
              <BellIcon className="w-6 h-6" />
              {/* Red badge — always visible when there are unread */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-[26rem] flex flex-col overflow-hidden">
                {/* Panel header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">الإشعارات</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Notification list */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!notif.read ? 'bg-orange-50/60' : ''}`}
                        >
                          {/* Unread dot */}
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-orange-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!notif.read ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                          </div>
                          {/* Type icon */}
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${notif.type === 'worker' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                            {notif.type === 'worker' ? 'فني' : 'طلب'}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <BellIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">لا توجد إشعارات</p>
                    </div>
                  )}
                </div>

                {/* Clear button */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-100 flex-shrink-0">
                    <button onClick={handleClearNotifications}
                      className="w-full text-center text-sm text-red-500 hover:text-red-600 font-medium py-1 rounded-lg hover:bg-red-50 transition-colors">
                      مسح جميع الإشعارات
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <div className="relative">
            <button onClick={handleProfileClick}
              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#D97706] flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </button>

            {showProfile && user && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
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

                <button onClick={() => { navigate('/profile'); setShowProfile(false); }}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-100">
                  <UserIcon className="w-5 h-5" />
                  <span>ملفي الشخصي</span>
                </button>

                <label className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-100 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>تحديث الصورة</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>

                <button onClick={handleSettings}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 border-b border-gray-100">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>الإعدادات</span>
                </button>

                <button onClick={handleLogout}
                  className="w-full text-right px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600">
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
