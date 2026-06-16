import { useState, useEffect, useCallback, useRef } from 'react';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import { userAPI, workerAPI } from '../services/adminApi';
import { useAdminData } from '../store/AdminDataContext';

// ─── Add User Modal ───────────────────────────────────────────────────────────
const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phoneNumber || !form.password) {
      toast.error('يرجى تعبئة جميع الحقول');
      return;
    }
    try {
      setLoading(true);
      await userAPI.createUser(form);
      toast.success('تم إنشاء المستخدم بنجاح');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل إنشاء المستخدم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-gray-900">إضافة مستخدم جديد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="أحمد محمود" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="example@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="01xxxxxxxxx" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="••••••••" />
            <p className="text-xs text-gray-400 mt-1">يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm">
              <option value="client">عميل</option>
              <option value="admin">مسؤول</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-50">
              {loading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Role / Status Badge ─────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    admin:  { label: 'مسؤول',  cls: 'bg-purple-100 text-purple-700' },
    client: { label: 'عميل',   cls: 'bg-blue-100 text-blue-700' },
    worker: { label: 'فني',    cls: 'bg-orange-100 text-orange-700' },
  };
  const { label, cls } = map[role] || { label: role, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

const ApprovalBadge = ({ status }) => {
  const map = {
    approved: { label: 'معتمد',   cls: 'bg-green-100 text-green-700' },
    pending:  { label: 'معلق',    cls: 'bg-yellow-100 text-yellow-700' },
    rejected: { label: 'مرفوض',   cls: 'bg-red-100 text-red-700' },
  };
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

// ─── Tab button component ────────────────────────────────────────────────────
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
      active
        ? 'bg-[#A85121] text-white border-[#A85121] shadow-md'
        : 'bg-white text-gray-600 border-gray-200 hover:border-[#A85121]/50 hover:text-[#A85121]'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
        {count}
      </span>
    )}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const { clientsData } = useAdminData();

  // Tab: 'clients' | 'workers' | 'admins'
  const [activeTab, setActiveTab]     = useState('clients');

  // Users state
  const [users, setUsers]             = useState([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [pages, setPages]             = useState(1);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [deletingId, setDeletingId]   = useState(null);

  const LIMIT = 15;
  const requestIdRef = useRef(0);
  // ✅ FIX 1: store clientsData in a ref so it never becomes a useCallback dependency.
  // A new object reference from context on every fetch would recreate loadData → re-run
  // the useEffect → trigger another fetch, causing an infinite loop.
  const clientsDataRef = useRef(clientsData);
  // ✅ FIX 3: remember the last params key to skip duplicate fetches.
  const prevParamsRef = useRef(null);

  // Keep clientsDataRef in sync without adding clientsData to loadData's deps.
  useEffect(() => {
    clientsDataRef.current = clientsData;
  }, [clientsData]);

  // ✅ FIX 2: separate setPage and setDebouncedSearch — nested setState inside a
  // state-updater function causes an extra render cycle, effectively firing loadData twice.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        setPage(1);
        setDebouncedSearch(searchTerm);
      }
    }, 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // intentionally omit debouncedSearch to avoid loop

  // ── Fetch users or workers depending on the active tab ──
  const loadData = useCallback(async () => {
    // ✅ FIX 3: skip fetch if params haven't changed (prevents double-fire from
    // simultaneous setPage(1) + setDebouncedSearch updates).
    const paramsKey = `${activeTab}-${page}-${debouncedSearch}`;
    if (prevParamsRef.current === paramsKey) return;
    prevParamsRef.current = paramsKey;

    const requestId = ++requestIdRef.current;
    try {
      setLoading(true);

      if (activeTab === 'workers') {
        const params = { page, limit: LIMIT };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const res = await workerAPI.getAllWorkers(params);
        
        if (requestId !== requestIdRef.current) return; // Cancelled by newer request

        setUsers(res.data || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      } else {
        const roleMap = { clients: 'client', admins: 'admin' };
        
        // ✅ FIX 1: use ref instead of clientsData directly — avoids adding clientsData
        // to useCallback deps which would re-create loadData on every context re-fetch.
        const cachedClients = clientsDataRef.current;
        if (activeTab === 'clients' && page === 1 && !debouncedSearch.trim() && cachedClients?.data?.length > 0) {
          if (requestId !== requestIdRef.current) return;
          setUsers(cachedClients.data);
          setTotal(cachedClients.total);
          setPages(cachedClients.pages || Math.ceil(cachedClients.total / LIMIT) || 1);
          setLoading(false);
          return;
        }

        const params = { page, limit: LIMIT, role: roleMap[activeTab] };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const res = await userAPI.getAllUsers(params);
        
        if (requestId !== requestIdRef.current) return; // Cancelled by newer request
        
        setUsers(res.data || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
        if (res.page !== undefined) setPage(res.page);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return; // Ignore stale error
      console.error('Error loading data:', err);
      toast.error('فشل تحميل البيانات');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  // ✅ FIX 1: clientsData removed from deps — we read it via clientsDataRef instead.
  }, [page, debouncedSearch, activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page on tab change
  useEffect(() => { setPage(1); }, [activeTab]);

  // ── Delete (soft-delete for clients/admins, no delete for workers from here) ──
  const handleDelete = async (userId, userName) => {
    if (activeTab === 'workers') {
      toast.info('إدارة حسابات الفنيين تتم من صفحة اعتماد الفنيين');
      return;
    }
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) return;
    try {
      setDeletingId(userId);
      await userAPI.deleteUser(userId);
      toast.success('تم حذف المستخدم بنجاح');
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل حذف المستخدم');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Table columns and rows differ slightly between users and workers ──
  const userColumns  = ['المستخدم', 'رقم الهاتف', 'الدور', 'تاريخ التسجيل', 'إجراءات'];
  const workerColumns = ['الفني', 'رقم الهاتف', 'التصنيف', 'الحالة', 'التقييم', 'تاريخ التسجيل'];

  const renderUserRow = (user) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#A85121]/10 text-[#A85121] flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || <UserCircleIcon className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm" dir="ltr">{user.phoneNumber || '—'}</td>
      <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
      <td className="px-6 py-4 text-gray-500 text-sm">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleDelete(user._id, user.name)}
          disabled={deletingId === user._id}
          className="text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
          title="حذف المستخدم (soft delete)"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </>
  );

  const renderWorkerRow = (worker) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {worker.name?.charAt(0)?.toUpperCase() || <WrenchScrewdriverIcon className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{worker.name}</p>
            <p className="text-xs text-gray-500">{worker.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm" dir="ltr">{worker.phoneNumber || '—'}</td>
      <td className="px-6 py-4 text-gray-600 text-sm">{worker.category?.name || '—'}</td>
      <td className="px-6 py-4"><ApprovalBadge status={worker.approvalStatus} /></td>
      <td className="px-6 py-4 text-gray-600 text-sm">
        {worker.rating != null ? (
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {Number(worker.rating).toFixed(1)}
          </span>
        ) : '—'}
      </td>
      <td className="px-6 py-4 text-gray-500 text-sm">
        {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة المستخدمين</h1>
          <p className="text-sm text-gray-500">
            {loading ? 'جاري التحميل...' : `${total.toLocaleString('en-US')} ${activeTab === 'workers' ? 'فني' : 'مستخدم'} مسجّل`}
          </p>
        </div>
        {activeTab !== 'workers' && (
          <button
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
            onClick={() => setShowModal(true)}
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>إضافة مستخدم جديد</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <TabButton
          active={activeTab === 'clients'}
          onClick={() => setActiveTab('clients')}
          icon={UsersIcon}
          label="العملاء"
        />
        <TabButton
          active={activeTab === 'workers'}
          onClick={() => setActiveTab('workers')}
          icon={WrenchScrewdriverIcon}
          label="الفنيين"
        />
        <TabButton
          active={activeTab === 'admins'}
          onClick={() => setActiveTab('admins')}
          icon={ShieldCheckIcon}
          label="المسؤولون"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ابحث بالاسم أو البريد أو الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-[#A85121]/30 border-t-[#A85121] rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <UserCircleIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">لا يوجد بيانات</p>
          <p className="text-sm mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <>
          <Table
            columns={activeTab === 'workers' ? workerColumns : userColumns}
            data={users}
            renderRow={activeTab === 'workers' ? renderWorkerRow : renderUserRow}
          />

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                عرض <span className="font-semibold text-gray-700">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}</span> من <span className="font-semibold text-gray-700">{total.toLocaleString('en-US')}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  title="الصفحة الأولى"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  السابق
                </button>

                {/* Page number buttons — show up to 5 around current page */}
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          item === page
                            ? 'bg-[#A85121] text-white border-[#A85121] font-bold shadow-sm'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )
                }

                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  التالي
                </button>
                <button
                  onClick={() => setPage(pages)}
                  disabled={page === pages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  title="الصفحة الأخيرة"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add User Modal */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
};

export default UsersPage;
