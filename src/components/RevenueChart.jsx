import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function RevenueChart({ orders = [], loading = false }) {
  const [timeRange, setTimeRange] = useState('month');

  const computedData = React.useMemo(() => {
    if (!orders || orders.length === 0) return [{ month: 'لا بيانات', value: 0 }];

    const monthlyRevenue = {};
    const monthsArabic = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    orders.forEach(order => {
      if (order.status === 'مكتملة' && order.date && order.amount) {
        const d = new Date(order.date);
        const monthName = monthsArabic[d.getMonth()];
        monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + Number(order.amount);
      }
    });

    const result = Object.entries(monthlyRevenue).map(([month, value]) => ({ month, value }));
    if (result.length === 0) return [{ month: 'لا إيرادات', value: 0 }];
    return result;
  }, [orders]);

  const maxValue = Math.max(...computedData.map((d) => d.value), 1);
  const minValue = Math.min(...computedData.map((d) => d.value), 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            الإيرادات الشهرية
          </h2>
          <p className="text-sm text-gray-500">أداء الإيرادات خلال الأشهر الماضية</p>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700">
            {timeRange === 'month' ? 'شهري' : 'سنوي'}
            <ChevronDownIcon className="w-4 h-4" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTimeRange('month')}
                  className={`w-full text-right px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  } ${timeRange === 'month' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  شهري
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTimeRange('year')}
                  className={`w-full text-right px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  } ${timeRange === 'year' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  سنوي
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div className="bg-gradient-to-b from-orange-50 to-transparent rounded-xl p-6 mb-6">
        <div className="flex items-end justify-between gap-4 h-64">
          {loading ? (
            <div className="w-full flex justify-center items-center h-full text-gray-400 animate-pulse">جاري التحميل...</div>
          ) : computedData.map((data, index) => {
            const height = ((data.value - minValue) / (maxValue - minValue)) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:from-orange-600 group-hover:to-orange-500"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">الأعلى</p>
          <p className="text-lg font-bold text-gray-900">{Math.max(...computedData.map(d => d.value), 0).toLocaleString('ar-EG')} ج.م</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">المتوسط</p>
          <p className="text-lg font-bold text-gray-900">{computedData.length > 0 ? Math.round(computedData.reduce((s, d) => s + d.value, 0) / computedData.length).toLocaleString('ar-EG') : 0} ج.م</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">الأقل</p>
          <p className="text-lg font-bold text-gray-900">{Math.min(...computedData.map(d => d.value), 0).toLocaleString('ar-EG')} ج.م</p>
        </div>
      </div>
    </div>
  );
}
