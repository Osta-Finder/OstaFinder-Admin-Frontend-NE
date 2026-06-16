import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import { workerAPI } from '../services/adminApi';
import { useAdminData } from '../store/AdminDataContext';

const StatCard = ({ title, value, icon: Icon, colorClass, loading }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          {loading ? <span className="inline-block w-12 h-8 bg-gray-100 animate-pulse rounded-lg" /> : value}
        </h3>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} shadow-sm border group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const LIMIT = 15;

const TechnicianApprovalsPage = () => {
  const { categories, refreshAll } = useAdminData();

  // ── State ──────────────────────────────────────────────────────────────────
  const [workers, setWorkers]           = useState([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);
  const [loading, setLoading]           = useState(true);   // أول تحميل فقط
  const [fetching, setFetching]         = useState(false);  // تغيير الصفحة/بحث
  const [searchTerm, setSearchTerm]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory]   = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [approving, setApproving]       = useState(false);

  const requestIdRef = useRef(0);
  // ✅ FIX 3: dedup guard — skip fetch if params haven't actually changed.
  const prevParamsRef = useRef(null);

  // ✅ FIX 2: separate setPage and setDebouncedSearch — nested setState inside a
  // state-updater function causes an extra render, firing loadData twice.
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

  // ── Fetch from Backend ───────────────────────────────────────────────
  const loadData = useCallback(async () => {
    // ✅ FIX 3: skip fetch if params haven't changed (prevents double-fire when
    // setPage(1) + setDebouncedSearch both update in the same 500 ms window).
    const paramsKey = `${page}-${debouncedSearch}-${activeCategory}`;
    if (prevParamsRef.current === paramsKey) return;
    prevParamsRef.current = paramsKey;

    const requestId = ++requestIdRef.current;
    const isFirstLoad = workers.length === 0;
    try {
      if (isFirstLoad) setLoading(true);
      else setFetching(true);

      const params = { page, limit: LIMIT };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (activeCategory) params.category = activeCategory;

      const res = await workerAPI.getPendingWorkers(params);
      if (requestId !== requestIdRef.current) return;

      setWorkers(res.data || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error loading pending workers:', err);
      toast.error('فشل تحميل طلبات الاعتماد');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setFetching(false);
      }
    }
  }, [page, debouncedSearch, activeCategory]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const urgent = workers.filter(w => w.createdAt && new Date(w.createdAt) < threeDaysAgo).length;

  // ── Format worker for table/modal ──────────────────────────────────────────
  const fmt = (worker) => ({
    id:             worker._id,
    name:           worker.name || 'بدون اسم',
    email:          worker.email || '',
    phoneNumber:    worker.phoneNumber || '',
    specialty:      worker.category?.name || 'غير محدد',
    experience:     worker.yearsOfExperience ? `${worker.yearsOfExperience} سنوات` : 'غير محدد',
    status:         'قيد المراجعة',
    bio:            worker.bio || '',
    nationalId:     worker.nationalId || '',
    certificates:   worker.certificates || [],
    city:           worker.city || '',
    address:        worker.address || '',
    profilePicture: worker.profilePicture || worker.image || null,
    approvalStatus: worker.approvalStatus,
    createdAt:      worker.createdAt,
    initials:       worker.name ? worker.name.substring(0, 2).toUpperCase() : 'WK',
  });

  // ── Approve / Reject ───────────────────────────────────────────────────────
  const handleApprove = async (tech) => {
    try {
      setApproving(true);
      await workerAPI.updateWorkerApproval(tech.id, 'approved');
      toast.success('تم اعتماد الفني بنجاح');
      setShowModal(false);
      loadData();
      refreshAll();
    } catch {
      toast.error('فشل اعتماد الفني');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (tech) => {
    try {
      setApproving(true);
      await workerAPI.updateWorkerApproval(tech.id, 'rejected');
      toast.success('تم رفض الفني');
      setShowModal(false);
      loadData();
      refreshAll();
    } catch {
      toast.error('فشل رفض الفني');
    } finally {
      setApproving(false);
    }
  };

  // ── Table row ──────────────────────────────────────────────────────────────
  const renderRow = (tech) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {tech.profilePicture ? (
            <img src={tech.profilePicture} alt={tech.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shadow-sm">
              {tech.initials}
            </div>
          )}
          <div>
            <div className="font-bold text-gray-900">{tech.name}</div>
            <div className="text-xs text-gray-500">{tech.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{tech.specialty}</td>
      <td className="px-6 py-4 text-gray-500">{tech.experience}</td>
      <td className="px-6 py-4"><Badge status={tech.status}>{tech.status}</Badge></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { setSelectedTech(tech); setShowModal(true); }}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
          >
            عرض التفاصيل
          </button>
          <button
            onClick={() => handleApprove(tech)}
            disabled={approving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
          >
            {approving ? '...' : 'اعتماد'}
          </button>
          <button
            onClick={() => handleReject(tech)}
            disabled={approving}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold px-3 py-1 rounded-lg transition-colors text-sm"
          >
            {approving ? '...' : 'رفض'}
          </button>
        </div>
      </td>
    </>
  );

  const filteredWorkers = workers.filter(worker => {
    if (!activeCategory) return true;
    const catId = worker.category?._id || worker.category;
    return catId === activeCategory;
  });

  const formattedWorkers = filteredWorkers.map(fmt);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">طلبات اعتماد الفنيين</h1>
        <p className="text-gray-600 text-sm lg:text-base">
          {loading ? 'جاري التحميل...' : `${total.toLocaleString('en-US')} طلب معلق`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="إجمالي الطلبات المعلقة"
          value={total}
          icon={ClipboardDocumentListIcon}
          colorClass="bg-orange-50 text-orange-500 border-orange-100"
          loading={loading}
        />
        <StatCard
          title="طلبات عاجلة (+3 أيام)"
          value={urgent}
          icon={ExclamationCircleIcon}
          colorClass="bg-red-50 text-red-500 border-red-100"
          loading={loading}
        />
        <StatCard
          title="الفئات المتاحة"
          value={categories.length}
          icon={CheckCircleIcon}
          colorClass="bg-green-50 text-green-500 border-green-100"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد أو الهاتف..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={activeCategory}
            onChange={e => {
              setActiveCategory(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm cursor-pointer appearance-none"
          >
            <option value="">كل التخصصات</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-orange-400/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : formattedWorkers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ClipboardDocumentListIcon className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">لا توجد طلبات مطابقة</p>
          <p className="text-gray-400 text-sm mt-1">جرّب تغيير معايير التصفية</p>
        </div>
      ) : (
        <div className="relative">
          {/* overlay خفيف عند تغيير الصفحة بدون إخفاء الجدول */}
          {fetching && (
            <div className="absolute inset-0 bg-white/60 rounded-3xl z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-400/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}

          <Table
            columns={['الاسم', 'التخصص', 'الخبرة', 'الحالة', 'الإجراءات']}
            data={formattedWorkers}
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
                  title="الصفحة الأولى"
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
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        disabled={fetching}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-60 ${
                          item === page
                            ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
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
                  title="الصفحة الأخيرة"
                >»</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedTech && (
        <div className="modal-overlay">
          <div className="modal-content !max-w-2xl">
            <div className="sticky top-0 bg-slate-50 border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الفني</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                {selectedTech.profilePicture ? (
                  <img src={selectedTech.profilePicture} alt={selectedTech.name} className="w-20 h-20 rounded-full object-cover shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl shadow">
                    {selectedTech.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTech.name}</h3>
                  <p className="text-gray-600">{selectedTech.specialty}</p>
                  <p className="text-sm text-gray-500">{selectedTech.email}</p>
                  {selectedTech.phoneNumber && (
                    <p className="text-sm text-gray-500" dir="ltr">{selectedTech.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">سنوات الخبرة</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTech.experience}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">الحالة</p>
                  <Badge status={selectedTech.status}>{selectedTech.status}</Badge>
                </div>
                {selectedTech.city && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">المدينة</p>
                    <p className="font-semibold text-gray-800">{selectedTech.city}</p>
                  </div>
                )}
                {selectedTech.address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">العنوان</p>
                    <p className="font-semibold text-gray-800">{selectedTech.address}</p>
                  </div>
                )}
                {selectedTech.nationalId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">رقم الهوية</p>
                    <p className="font-semibold text-gray-800 truncate">{selectedTech.nationalId}</p>
                  </div>
                )}
                {selectedTech.createdAt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">تاريخ التسجيل</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedTech.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {selectedTech.bio && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">نبذة شخصية</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{selectedTech.bio}</p>
                </div>
              )}

              {/* Certificates */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3">الوثائق المرفقة</h4>
                {selectedTech.certificates?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTech.certificates.map((cert, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {cert.startsWith('http') ? (
                          <a
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            وثيقة {i + 1} — عرض
                          </a>
                        ) : (
                          <span className="text-sm text-blue-800 flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            {cert}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">لا توجد وثائق مرفقة</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors text-sm"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => handleReject(selectedTech)}
                  disabled={approving}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {approving ? 'جاري...' : 'رفض'}
                </button>
                <button
                  onClick={() => handleApprove(selectedTech)}
                  disabled={approving}
                  className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm shadow-sm"
                >
                  {approving ? 'جاري...' : 'اعتماد'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianApprovalsPage;
