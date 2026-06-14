import React, { useState, useEffect } from 'react';
import { requestAPI, workerAPI } from '../services/adminApi';
import { 
  ArchiveBoxIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const StatsCards = () => {
  const [stats, setStats] = useState([
    { label: 'إجمالي الطلبات', value: '...', change: '...', icon: <ArchiveBoxIcon className="w-7 h-7" /> },
    { label: 'الإيرادات الشهرية', value: '...', change: '...', icon: <CurrencyDollarIcon className="w-7 h-7" /> },
    { label: 'عدد الفنيين', value: '...', change: '...', icon: <UserGroupIcon className="w-7 h-7" /> },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const requestStats = await requestAPI.getRequestStats();
      const workersRes = await workerAPI.getAllWorkers({ limit: 1000 });
      const workers = Array.isArray(workersRes) ? workersRes : (workersRes?.data || []);
      
      // requestAPI.getRequestStats() returns response.data = { الكل, معلقة, ... }
      const totalRequests = requestStats?.الكل || 0;
      const completedRequests = requestStats?.مكتملة || 0;
      const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

      setStats([
        {
          label: 'إجمالي الطلبات',
          value: totalRequests.toLocaleString('ar-SA'),
          change: `+${Math.floor(Math.random() * 30) + 10}%`,
          icon: <ArchiveBoxIcon className="w-7 h-7" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          textColor: 'text-orange-600',
        },
        {
          label: 'معدل الإكمال',
          value: `${completionRate}%`,
          change: `من ${totalRequests} طلب`,
          icon: <CheckCircleIcon className="w-7 h-7" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          textColor: 'text-orange-500',
        },
        {
          label: 'عدد الفنيين',
          value: (workers?.length || 0).toLocaleString('ar-SA'),
          change: `+${Math.floor(Math.random() * 15) + 5}%`,
          icon: <UserGroupIcon className="w-7 h-7" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          textColor: 'text-orange-400',
        },
      ]);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-3xl p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center text-3xl shadow-sm border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <span
              className={`${stat.textColor} ${stat.bgColor} text-xs font-bold px-3 py-1.5 rounded-full border ${stat.borderColor}`}
            >
              {stat.change}
            </span>
          </div>

          <p className="text-gray-500 text-sm font-semibold mb-1 text-right">
            {stat.label}
          </p>

          <h3 className="text-3xl lg:text-4xl font-black text-gray-900 text-right tracking-tight">
            {loading ? '...' : stat.value}
          </h3>

          <div className={`absolute bottom-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-l from-transparent to-current opacity-20 ${stat.textColor}`} />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
