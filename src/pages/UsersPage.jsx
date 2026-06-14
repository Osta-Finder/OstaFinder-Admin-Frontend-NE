import { useState, useEffect, useCallback } from 'react';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  UserCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import { userAPI } from '../services/adminApi';

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
            <input
              name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="أحمد محمود"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
            <input
              name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="01xxxxxxxxx"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1">يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              name="role" value={form.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#A85121]/40 focus:border-[#A85121] outline-none text-sm"
            >
              <option value="client">عميل</option>
              <option value="admin">مسؤول</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-50"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    admin:  { label: 'مسؤول', cls: 'bg-purple-100 text-purple-700' },
    client: { label: 'عميل',  cls: 'bg-blue-100 text-blue-700' },
  };
  const { label, cls } = map[role] || { label: role, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const [users, setUsers]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const LIMIT = 15;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await userAPI.getAllUsers(params);
      setUsers(res.data || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [page, searchTerm, roleFilter]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [searchTerm, roleFilter]);

  const handleDelete = async (userId, userName) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) return;
    try {
      setDeletingId(userId);
      await userAPI.deleteUser(userId);
      toast.success('تم حذف المستخدم بنجاح');
      loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل حذف المستخدم');
    } finally {
      setDeletingId(null);
    }
  };

  const columns = ['المستخدم', 'رقم الهاتف', 'الدور', 'تاريخ التسجيل', 'إجراءات'];

  const renderRow = (user) => (
    <>
      {/* User */}
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

      {/* Phone */}
      <td className="px-6 py-4 text-gray-600 text-sm" dir="ltr">{user.phoneNumber || '—'}</td>

      {/* Role */}
      <td className="px-6 py-4"><RoleBadge role={user.role} /></td>

      {/* Date */}
      <td className="px-6 py-4 text-gray-500 text-sm">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
          : '—'}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <button
          onClick={() => handleDelete(user._id, user.name)}
          disabled={deletingId === user._id}
          className="text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
          title="حذف المستخدم"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
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
            {loading ? 'جاري التحميل...' : `${total.toLocaleString('ar-EG')} مستخدم مسجّل`}
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
          onClick={() => setShowModal(true)}
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm cursor-pointer transition-all appearance-none"
          >
            <option value="">كل الأدوار</option>
            <option value="client">عملاء</option>
            <option value="admin">مسؤولون</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-[#A85121]/30 border-t-[#A85121] rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <UserCircleIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">لا يوجد مستخدمون</p>
          <p className="text-sm mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <>
          <Table columns={columns} data={users} renderRow={renderRow} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                صفحة {page} من {pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  السابق
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  التالي
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
          onCreated={loadUsers}
        />
      )}
    </div>
  );
};

export default UsersPage;
