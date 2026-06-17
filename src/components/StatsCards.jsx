import React from 'react';
import { useAdminData } from '../store/AdminDataContext';
import {
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Egyptian Pound formatter — بتعرض الأرقام إنجليزي مع ج.م
const formatEGP = (value) =>
  `${Number(value).toLocaleString('en-US')} ج.م`;

const StatsCards = () => {
  // Use shared context — no independent API call from this component
  const { orders, pendingWorkers, pendingCount, requestStats, loading } = useAdminData();

  const totalRequests    = requestStats?.الكل       || orders.length || 0;
  const completedRequests = requestStats?.مكتملة    || 0;
  const completionRate   = totalRequests > 0
    ? Math.round((completedRequests / totalRequests) * 100)
    : 0;

  // Estimate revenue: completed orders × assumed average price (150 EGP)
  // Replace 150 with a real price field from your orders when available
  const avgOrderPrice = 150;
  const estimatedRevenue = completedRequests * avgOrderPrice;

  const stats = [
    {
      label:       'إجمالي الطلبات',
      value:       totalRequests.toLocaleString('en-US'),
      change:      `${completedRequests} مكتمل`,
      icon:        <ArchiveBoxIcon className="w-7 h-7" />,
      bgColor:     'bg-orange-50',
      borderColor: 'border-orange-100',
      textColor:   'text-orange-600',
    },
    {
      label:       'معدل الإكمال',
      value:       `${completionRate}%`,
      change:      `من ${totalRequests.toLocaleString('en-US')} طلب`,
      icon:        <CheckCircleIcon className="w-7 h-7" />,
      bgColor:     'bg-green-50',
      borderColor: 'border-green-100',
      textColor:   'text-green-600',
    },
    {
      label:       'الإيرادات التقديرية',
      value:       formatEGP(estimatedRevenue),
      change:      '',
      icon:        <CurrencyDollarIcon className="w-7 h-7" />,
      bgColor:     'bg-blue-50',
      borderColor: 'border-blue-100',
      textColor:   'text-blue-600',
    },
    {
      label:       'عدد الفنيين',
      value:       pendingCount.toLocaleString('en-US'),
      change:      'بانتظار الاعتماد',
      icon:        <UserGroupIcon className="w-7 h-7" />,
      bgColor:     'bg-orange-50',
      borderColor: 'border-orange-100',
      textColor:   'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-3xl p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center text-3xl shadow-sm border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            {stat.change && (
              <span className={`${stat.textColor} ${stat.bgColor} text-xs font-bold px-3 py-1.5 rounded-full border ${stat.borderColor} text-right max-w-[120px] leading-tight`}>
                {stat.change}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm font-semibold mb-1 text-right">
            {stat.label}
          </p>

          <h3 className="text-2xl lg:text-3xl font-black text-gray-900 text-right tracking-tight">
            {loading ? (
              <span className="inline-block w-16 h-7 bg-gray-100 animate-pulse rounded-lg" />
            ) : stat.value}
          </h3>

          <div className={`absolute bottom-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-l from-transparent to-current opacity-20 ${stat.textColor}`} />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
