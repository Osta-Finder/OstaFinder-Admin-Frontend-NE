import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { requestAPI } from '../services/adminApi';
import { useAdminData } from '../store/AdminDataContext';

// ── Status helpers ────────────────────────────────────────────────────────────
const ALL_STATUSES = ['معلقة', 'مقبولة', 'في الطريق', 'قيد التنفيذ', 'مكتملة', 'مرفوضة', 'ملغية'];

const statusColor = {
  معلقة:       'bg-yellow-100 text-yellow-700',
  مقبولة:      'bg-blue-100 text-blue-700',
  'في الطريق': 'bg-sky-100 text-sky-700',
  'قيد التنفيذ':'bg-orange-100 text-orange-700',
  مكتملة:      'bg-green-100 text-green-700',
  مرفوضة:      'bg-red-100 text-red-700',
  ملغية:       'bg-gray-100 text-gray-500',
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[status] || 'bg-gray-100 text-gray-600'}`}>
    {status}
  </span>
);

const LIMIT = 15;

// ── Main Page ────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const { categories, refreshAll } = useAdminData();

  // ── State ──────────────────────────────────────────────────────────────────
  const [orders, setOrders]             = useState([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);
  const [fetching, setFetching]         = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId]     = useState(null);

  const requestIdRef = useRef(0);

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(prev => {
        if (prev !== searchTerm) { setPage(1); return searchTerm; }
        return prev;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Reset page on filter change ────────────────────────────────────────────
  useEffect(() => { setPage(1); }, [statusFilter]);

  // ── Fetch from Backend ─────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isFirstLoad = orders.length === 0;
    try {
      if (isFirstLoad) setLoading(true);
      else setFetching(true);

      const params = { page, limit: LIMIT };
      if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await requestAPI.getAllRequests(params);
      if (requestId !== requestIdRef.current) return;

      // Backend response: { success, count, pagination: { currentPage, numberOfPages, limit, next?, prev? }, data: [...] }
      setOrders(res.data || []);
      const pagination = res.pagination || {};
      const currentLimit = pagination.limit || LIMIT;
      const numPages = pagination.numberOfPages ?? 1;
      // total = numberOfPages * limit (approximate) or use count for current page
      // حساب الـ total من الـ pages والـ limit
      const estimatedTotal = numPages * currentLimit;
      setTotal(estimatedTotal);
      setPages(numPages);
      // sync current page from response
      if (pagination.currentPage) setPage(pagination.currentPage);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error loading orders:', err);
      toast.error('فشل تحميل الطلبات');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setFetching(false);
      }
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Update status ──────────────────────────────────────────────────────────
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;

    // map Arabic status → English for backend
    const reverseMap = {
      معلقة: 'pending',
      مقبولة: 'accepted',
      'في الطريق': 'on_the_way',
      'قيد التنفيذ': 'in_progress',
      مكتملة: 'completed',
      مرفوضة: 'rejected',
      ملغية: 'cancelled',
    };
    try {
      setUpdatingStatus(true);
      await requestAPI.updateRequestStatus(selectedOrder._id, reverseMap[newStatus] || newStatus);
      toast.success('تم تحديث حالة الطلب بنجاح');
      setSelectedOrder(null);
      loadData();
      refreshAll();
    } catch {
      toast.error('فشل تحديث حالة الطلب');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Cancel (delete) order ──────────────────────────────────────────────────
  const handleCancel = async (orderId) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    try {
      setDeletingId(orderId);
      await requestAPI.cancelRequest(orderId);
      toast.success('تم إلغاء الطلب بنجاح');
      loadData();
      refreshAll();
    } catch {
      toast.error('فشل إلغاء الطلب');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Table row ──────────────────────────────────────────────────────────────
  const renderRow = (order) => (
    <>
      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap text-xs">
        #{String(order._id).slice(-6).toUpperCase()}
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-gray-900 text-sm">{order.user?.name || '—'}</p>
        <p className="text-xs text-gray-400" dir="ltr">{order.user?.phoneNumber || ''}</p>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-gray-900 text-sm">{order.worker?.name || 'غير معين'}</p>
        <p className="text-xs text-gray-400" dir="ltr">{order.worker?.phoneNumber || ''}</p>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm">{order.service || '—'}</td>
      <td className="px-6 py-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 text-gray-500 text-sm">
        {order.date ? new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
      </td>
      <td className="px-6 py-4 text-gray-500 text-sm font-semibold text-[#D97706]">
        {order.amount != null ? `${order.amount} ج.م` : '—'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrder(order)}
            className="text-gray-400 hover:text-[#A85121] transition-colors"
            title="عرض التفاصيل"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          {order.status === 'معلقة' && (
            <button
              onClick={() => handleCancel(order._id)}
              disabled={deletingId === order._id}
              className="text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
              title="إلغاء الطلب"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </td>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة الطلبات</h1>
        <p className="text-sm text-gray-500">
          {loading ? 'جاري التحميل...' : `${total.toLocaleString('en-US')} طلب`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm cursor-pointer appearance-none"
          >
            <option value="">كل الحالات</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm mr-auto">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث باسم العميل أو الفني أو الخدمة..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-[#A85121]/30 border-t-[#A85121] rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">لا توجد طلبات</p>
          <p className="text-sm mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <div className="relative">
          {fetching && (
            <div className="absolute inset-0 bg-white/60 rounded-3xl z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#A85121]/30 border-t-[#A85121] rounded-full animate-spin" />
            </div>
          )}

          <Table
            columns={['رقم الطلب', 'العميل', 'الفني', 'الخدمة', 'الحالة', 'التاريخ', 'المبلغ', 'إجراءات']}
            data={orders}
            renderRow={renderRow}
          />

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                عرض{' '}
                <span className="font-semibold text-gray-700">
                  {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}
                </span>{' '}
                من <span className="font-semibold text-gray-700">{total.toLocaleString('en-US')}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1 || fetching}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >«</button>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || fetching}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >السابق</button>

                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`e-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        disabled={fetching}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-60 ${
                          item === page
                            ? 'bg-[#A85121] text-white border-[#A85121] font-bold shadow-sm'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >{item}</button>
                    )
                  )
                }

                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages || fetching}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >التالي</button>
                <button
                  onClick={() => setPage(pages)}
                  disabled={page === pages || fetching}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >»</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">
                تفاصيل الطلب #{String(selectedOrder._id).slice(-6).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">العميل</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.user?.name || '—'}</p>
                  {selectedOrder.user?.phoneNumber && (
                    <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{selectedOrder.user.phoneNumber}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الفني</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.worker?.name || 'غير معين'}</p>
                  {selectedOrder.worker?.phoneNumber && (
                    <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{selectedOrder.worker.phoneNumber}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الخدمة</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.service || '—'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">المبلغ</p>
                  <p className="font-semibold text-[#D97706]">
                    {selectedOrder.amount != null ? `${selectedOrder.amount} ج.م` : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">التاريخ</p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الحالة الحالية</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">العنوان</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.address || '—'}</p>
                </div>
                {selectedOrder.description && (
                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 mb-1">الوصف</p>
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">{selectedOrder.description}</p>
                  </div>
                )}
              </div>

              {/* Status update */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">تحديث الحالة</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map(status => (
                    <button
                      key={status}
                      disabled={updatingStatus || selectedOrder.status === status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        selectedOrder.status === status
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white border-transparent shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl text-sm font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
