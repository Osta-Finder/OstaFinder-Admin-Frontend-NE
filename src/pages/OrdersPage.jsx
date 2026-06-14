import React, { useState, useEffect } from 'react';
import { 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { requestAPI } from '../services/adminApi';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('كل الفئات');
  const [statusFilter, setStatusFilter] = useState('كل الحالات');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [statusFilter, categoryFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await requestAPI.getAllRequests();
      // Map backend data to component format
      const formatted = data.map(request => ({
        id: String(request.requestNumber || request._id || ''),
        customerName: request.user?.name || 'بدون اسم',
        assignedTech: request.worker?.name || 'غير معين',
        category: request.service || 'غير محدد',
        status: request.status || 'معلقة',
        date: request.date ? new Date(request.date).toLocaleDateString('ar-SA') : '—',
        _id: request._id,
        fullData: request,
      }));
      setOrders(formatted);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        await requestAPI.cancelRequest(orderId);
        setOrders(orders.filter(o => o._id !== orderId));
        toast.success('تم حذف الطلب بنجاح');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('فشل حذف الطلب');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      setUpdatingStatus(true);
      await requestAPI.updateRequestStatus(selectedOrder._id, newStatus);
      toast.success('تم تحديث حالة الطلب بنجاح');
      setSelectedOrder(null);
      loadOrders(); // reload
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('فشل تحديث حالة الطلب');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.includes(searchTerm) || 
      order.id.includes(searchTerm) || 
      order.assignedTech.includes(searchTerm);
      
    const matchesCategory = categoryFilter === 'كل الفئات' || order.category === categoryFilter;
    const matchesStatus = statusFilter === 'كل الحالات' || order.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    'رقم الطلب',
    'اسم العميل',
    'الفني المعين',
    'الفئة',
    'الحالة',
    'التاريخ',
    'إجراءات'
  ];

  const renderRow = (order) => (
    <>
      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">#{order.id}</td>
      <td className="px-6 py-4">{order.customerName}</td>
      <td className="px-6 py-4 text-gray-500">{order.assignedTech}</td>
      <td className="px-6 py-4">{order.category}</td>
      <td className="px-6 py-4">
        <Badge status={order.status}>{order.status}</Badge>
      </td>
      <td className="px-6 py-4 text-gray-500">{order.date}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedOrder(order)}
            className="text-gray-400 hover:text-[#A85121] transition-colors" 
            title="عرض التفاصيل"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(order._id)}
            className="text-gray-400 hover:text-red-500 transition-colors" 
            title="حذف الطلب"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">إدارة المستخدمين والطلبات</h1>
          <p className="text-sm text-gray-500">نظرة عامة على جميع الطلبات النشطة والمنجزة.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors text-sm font-semibold shadow-sm">
            <ChartBarIcon className="w-4 h-4" />
            تحليلات المستخدمين
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
            <ArrowDownTrayIcon className="w-4 h-4" />
            تصدير التقارير
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="flex items-center gap-3 mt-8">
        <button className="flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 p-2.5 rounded-full transition-colors text-gray-500 shadow-sm">
          <FunnelIcon className="w-4 h-4" />
        </button>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 cursor-pointer shadow-sm min-w-[120px] transition-all appearance-none"
        >
          <option value="كل الفئات">كل الفئات</option>
          <option value="سباكة">سباكة</option>
          <option value="كهرباء">كهرباء</option>
          <option value="نجارة">نجارة</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-full px-5 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 cursor-pointer shadow-sm min-w-[120px] transition-all appearance-none"
        >
          <option value="كل الحالات">كل الحالات</option>
          <option value="مكتملة">مكتملة</option>
          <option value="معلقة">معلقة</option>
          <option value="قيد التنفيذ">قيد التنفيذ</option>
        </select>
        <div className="relative flex-1 max-w-md mr-auto">
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، أو الفني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد طلبات حالياً</p>
        </div>
      ) : (
        <Table columns={['رقم الطلب', 'اسم العميل', 'الفني المعين', 'الفئة', 'الحالة', 'التاريخ', 'إجراءات']} data={filteredOrders} renderRow={renderRow} />
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">العميل</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الفني</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.assignedTech}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الخدمة</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">المبلغ</p>
                  <p className="font-semibold text-[#D97706]">{selectedOrder.fullData?.amount || 'غير محدد'} ر.س</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">العنوان</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.fullData?.address || 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">الوصف</p>
                  <p className="font-semibold text-gray-900 text-sm whitespace-pre-wrap">{selectedOrder.fullData?.description || 'لا يوجد'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">تحديث حالة الطلب</label>
                <div className="flex flex-wrap gap-2">
                  {['معلقة', 'مقبولة', 'قيد التنفيذ', 'مكتملة', 'مرفوضة', 'ملغية'].map(status => (
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
            
            <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3 mt-auto">
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
