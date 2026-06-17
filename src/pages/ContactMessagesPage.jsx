import { useState, useEffect, useCallback } from 'react';
import {
  EnvelopeIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import { contactAPI } from '../services/adminApi';

const typeMap = {
  complaint: 'شكوى',
  suggestion: 'اقتراح',
  inquiry: 'استفسار',
  problem: 'مشكلة',
  opinion: 'رأي',
};

const typeColors = {
  complaint: 'bg-red-100 text-red-700',
  suggestion: 'bg-green-100 text-green-700',
  inquiry: 'bg-blue-100 text-blue-700',
  problem: 'bg-orange-100 text-orange-700',
  opinion: 'bg-purple-100 text-purple-700',
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} shadow-sm border group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const DetailModal = ({ contact, onClose, onMarkRead, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleMarkRead = async () => {
    try {
      setLoading(true);
      await contactAPI.markAsRead(contact._id);
      toast.success('تم تحديد الرسالة كمقروءة');
      onMarkRead(contact._id);
    } catch (err) {
      toast.error('فشل تحديث الحالة');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await contactAPI.deleteContact(contact._id);
      toast.success('تم حذف الرسالة بنجاح');
      onDeleted(contact._id);
      onClose();
    } catch (err) {
      toast.error('فشل حذف الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content !max-w-2xl">
        <div className="sticky top-0 bg-slate-50 border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل الرسالة</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                {contact.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[contact.type] || 'bg-gray-100 text-gray-600'}`}>
              {typeMap[contact.type] || contact.type}
            </span>
          </div>

          {contact.phone && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
              <p className="font-semibold text-gray-800" dir="ltr">{contact.phone}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">الموضوع</p>
            <p className="font-semibold text-gray-800">{contact.subject}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-2">الرسالة</p>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>تاريخ الإرسال: {new Date(contact.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            {contact.isRead && <span className="text-green-600">• مقروءة</span>}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors text-sm">
              إغلاق
            </button>
            {!contact.isRead && (
              <button onClick={handleMarkRead} disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
                {loading ? 'جاري...' : 'تحديد كمقروءة'}
              </button>
            )}
            <button onClick={handleDelete} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
              {loading ? 'جاري...' : 'حذف'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactMessagesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unread: 0, complaints: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const LIMIT = 15;

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (typeFilter) params.type = typeFilter;
      if (readFilter) params.isRead = readFilter;

      const res = await contactAPI.getAllContacts(params);
      setContacts(res.data || []);
      setTotal(res.counts?.total || res.total || 0);
      setCounts(res.counts || { total: 0, unread: 0, complaints: 0 });
      setPages(res.pagination?.totalPages || res.pages || 1);
    } catch (err) {
      console.error('Error loading contacts:', err);
      toast.error('فشل تحميل الرسائل');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, typeFilter, readFilter]);

  useEffect(() => {
    const timer = setTimeout(loadContacts, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [page, searchTerm, typeFilter, readFilter]);

  useEffect(() => { setPage(1); }, [searchTerm, typeFilter, readFilter]);

  const handleDelete = async (id) => {
    try {
      await contactAPI.deleteContact(id);
      toast.success('تم حذف الرسالة بنجاح');
      loadContacts();
    } catch (err) {
      toast.error('فشل حذف الرسالة');
    }
  };

  const handleMarkRead = (id) => {
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, isRead: true } : c)));
    setCounts((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
  };

  const handleView = async (contact) => {
    if (!contact.isRead) {
      try {
        await contactAPI.markAsRead(contact._id);
        handleMarkRead(contact._id);
        setSelectedContact({ ...contact, isRead: true });
      } catch {
        setSelectedContact(contact);
      }
    } else {
      setSelectedContact(contact);
    }
  };

  const columns = ['المرسل', 'النوع', 'الموضوع', 'التاريخ', 'الحالة', 'الإجراءات'];

  const renderRow = (contact) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${contact.isRead ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'}`}>
            {contact.name?.charAt(0)}
          </div>
          <div>
            <p className={`text-sm ${contact.isRead ? 'text-gray-700' : 'font-bold text-gray-900'}`}>
              {contact.name}
            </p>
            <p className="text-xs text-gray-500">{contact.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[contact.type] || 'bg-gray-100 text-gray-600'}`}>
          {typeMap[contact.type] || contact.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className={`text-sm line-clamp-1 ${contact.isRead ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
          {contact.subject}
        </p>
      </td>
      <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
        {new Date(contact.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
      </td>
      <td className="px-6 py-4">
        {contact.isRead ? (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            مقروءة
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
            <ExclamationCircleIcon className="w-4 h-4" />
            جديدة
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button onClick={() => handleView(contact)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors" title="عرض التفاصيل">
            <EyeIcon className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(contact._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="حذف">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">رسائل التواصل</h1>
          <p className="text-sm text-gray-500">
            {loading ? 'جاري التحميل...' : `${total.toLocaleString('ar-EG')} رسالة`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="إجمالي الرسائل" value={counts.total} icon={EnvelopeIcon} colorClass="bg-blue-50 text-blue-500" />
        <StatCard title="غير مقروءة" value={counts.unread} icon={ExclamationCircleIcon} colorClass="bg-orange-50 text-orange-500" />
        <StatCard title="شكاوى" value={counts.complaints} icon={ExclamationCircleIcon} colorClass="bg-red-50 text-red-500" />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="ابحث بالاسم أو البريد أو الموضوع..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm cursor-pointer transition-all appearance-none"
          >
            <option value="">كل الأنواع</option>
            <option value="complaint">شكوى</option>
            <option value="suggestion">اقتراح</option>
            <option value="inquiry">استفسار</option>
            <option value="problem">مشكلة</option>
            <option value="opinion">رأي</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}
            className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm cursor-pointer transition-all appearance-none"
          >
            <option value="">جميع الحالات</option>
            <option value="false">غير مقروءة</option>
            <option value="true">مقروءة</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <EnvelopeIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">لا توجد رسائل</p>
          <p className="text-sm mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <>
          <Table columns={columns} data={contacts} renderRow={renderRow} />
          {pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">صفحة {page} من {pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">السابق</button>
                <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                  className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">التالي</button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedContact && (
        <DetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onMarkRead={handleMarkRead}
          onDeleted={(id) => {
            setContacts((prev) => prev.filter((c) => c._id !== id));
            setCounts((prev) => ({
              total: prev.total - 1,
              unread: prev.unread - (selectedContact.isRead ? 0 : 1),
              complaints: prev.complaints - (selectedContact.type === 'complaint' ? 1 : 0),
            }));
          }}
        />
      )}
    </div>
  );
};

export default ContactMessagesPage;
