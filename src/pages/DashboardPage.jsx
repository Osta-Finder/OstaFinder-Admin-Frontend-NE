import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import StatsCards from '../components/StatsCards';
import RevenueChart from '../components/RevenueChart';
import ServicePopularity from '../components/ServicePopularity';
import { requestAPI, workerAPI } from '../services/adminApi';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${color}`}
  >
    <Icon className="w-7 h-7" />
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </button>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoadingOrders(true);
      const [orders, pendingRes] = await Promise.all([
        requestAPI.getAllRequests(),
        workerAPI.getPendingWorkers(),
      ]);
      setAllOrders(orders);
      // أحدث 5 طلبات
      setRecentOrders(orders.slice(0, 5));
      const pending = Array.isArray(pendingRes) ? pendingRes : (pendingRes?.data || []);
      setPendingCount(pending.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const statusColor = {
    'معلقة':      'bg-yellow-100 text-yellow-700',
    'مقبولة':     'bg-blue-100 text-blue-700',
    'قيد التنفيذ':'bg-purple-100 text-purple-700',
    'مكتملة':     'bg-green-100 text-green-700',
    'مرفوضة':     'bg-red-100 text-red-700',
    'ملغية':      'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-8">

      {/* ====== Welcome Banner ====== */}
      <div className="relative overflow-hidden bg-gradient-to-l from-orange-500 to-orange-600 rounded-3xl p-6 lg:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-orange-100 text-sm font-medium mb-1 flex items-center gap-1">{greeting} <SparklesIcon className="w-4 h-4 text-orange-200" /></p>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            {user?.name || 'المدير'}
          </h1>
          <p className="text-orange-100 text-sm">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {pendingCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              <BellAlertIcon className="w-4 h-4" />
              {pendingCount} فني بانتظار الاعتماد
            </div>
          )}
        </div>
        {/* Decorative circles */}
        <div className="absolute -left-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -left-4 bottom-0 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute left-32 -top-4 w-16 h-16 bg-white/10 rounded-full" />
      </div>

      {/* ====== Stats Cards ====== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">المقاييس الرئيسية</h2>
        <StatsCards />
      </section>

      {/* ====== Quick Actions ====== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={UserGroupIcon}
            label="اعتماد الفنيين"
            color="hover:border-orange-300"
            onClick={() => navigate('/technicians')}
          />
          <QuickAction
            icon={ClipboardDocumentListIcon}
            label="إدارة الطلبات"
            color="hover:border-blue-300"
            onClick={() => navigate('/orders')}
          />
          <QuickAction
            icon={ArrowTrendingUpIcon}
            label="التحليلات"
            color="hover:border-green-300"
            onClick={() => navigate('/analytics')}
          />
          <QuickAction
            icon={UserGroupIcon}
            label="إدارة المستخدمين"
            color="hover:border-purple-300"
            onClick={() => navigate('/users')}
          />
        </div>
      </section>

      {/* ====== Charts ====== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">الأداء والتحليلات</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart orders={allOrders} loading={loadingOrders} />
          </div>
          <div className="lg:col-span-1">
            <ServicePopularity orders={allOrders} loading={loadingOrders} />
          </div>
        </div>
      </section>

      {/* ====== Recent Orders ====== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">أحدث الطلبات</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            عرض الكل ←
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {loadingOrders ? (
            <div className="p-8 text-center">
              <div className="flex justify-center gap-1 mb-3">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-gray-400 text-sm">جاري التحميل...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">لا توجد طلبات حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order, i) => (
                <div
                  key={order._id || i}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {order.user?.name?.charAt(0) || '؟'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {order.user?.name || 'بدون اسم'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.service || 'خدمة غير محددة'} • {order.worker?.name || 'بدون فني'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status || 'معلقة'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {order.date ? new Date(order.date).toLocaleDateString('ar-SA') : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== Pending Technicians Alert ====== */}
      {pendingCount > 0 && (
        <section>
          <div
            onClick={() => navigate('/technicians')}
            className="cursor-pointer flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-2xl p-5 hover:bg-orange-100 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-orange-800">
                {pendingCount} طلب اعتماد فني بانتظار المراجعة
              </p>
              <p className="text-sm text-orange-600">
                اضغط هنا للانتقال لصفحة اعتماد الفنيين
              </p>
            </div>
            <div className="mr-auto text-orange-400 text-xl">←</div>
          </div>
        </section>
      )}

    </div>
  );
}
