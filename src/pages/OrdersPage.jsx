import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { deleteOrder } from '../store/slices/ordersSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('كل الفئات');
  const [statusFilter, setStatusFilter] = useState('كل الحالات');

  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
    toast.info('تم حذف الطلب');
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
          <button className="text-gray-400 hover:text-[#A85121] transition-colors" title="عرض التفاصيل">
            <EyeIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(order.id)}
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
          <Button variant="outline" className="text-sm">
            <ChartBarIcon className="w-4 h-4" />
            تحليلات المستخدمين
          </Button>
          <Button variant="primary" className="text-sm bg-[#A85121] hover:bg-[#8B431B]">
            <ArrowDownTrayIcon className="w-4 h-4" />
            تصدير التقارير
          </Button>
        </div>
      </div>

      {/* Filters section */}
      <div className="flex items-center gap-3 mt-8">
        <Button variant="outline" className="!px-3 !py-2 rounded-full shadow-sm text-sm border-gray-200">
          <FunnelIcon className="w-4 h-4" />
        </Button>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#A85121]/50 cursor-pointer shadow-sm min-w-[120px]"
        >
          <option value="كل الفئات">كل الفئات</option>
          <option value="سباكة">سباكة</option>
          <option value="كهرباء">كهرباء</option>
          <option value="نجارة">نجارة</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#A85121]/50 cursor-pointer shadow-sm min-w-[120px]"
        >
          <option value="كل الحالات">كل الحالات</option>
          <option value="مكتمل">مكتمل</option>
          <option value="قيد الانتظار">قيد الانتظار</option>
          <option value="جاري العمل">جاري العمل</option>
        </select>
        <div className="relative flex-1 max-w-md mr-auto">
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، أو الفني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-full py-2 px-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A85121]/50 shadow-sm"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredOrders} renderRow={renderRow} />
    </div>
  );
};

export default OrdersPage;
