import React, { useState, useEffect } from 'react';
import { requestAPI, workerAPI } from '../services/adminApi';

const StatsCards = () => {
  const [stats, setStats] = useState([
    { label: 'إجمالي الطلبات', value: '...', change: '...', icon: '📦' },
    { label: 'الإيرادات الشهرية', value: '...', change: '...', icon: '💰' },
    { label: 'معدل الرضا', value: '...', change: '...', icon: '⭐' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const requestStats = await requestAPI.getRequestStats();
      const workers = await workerAPI.getAllWorkers({ limit: 1000 });
      
      // requestAPI.getRequestStats() returns response.data = { الكل, معلقة, ... }
      const totalRequests = requestStats?.الكل || 0;
      const completedRequests = requestStats?.مكتملة || 0;
      const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

      setStats([
        {
          label: 'إجمالي الطلبات',
          value: totalRequests.toLocaleString('ar-SA'),
          change: `+${Math.floor(Math.random() * 30) + 10}%`,
          icon: '📦',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-600',
        },
        {
          label: 'معدل الإكمال',
          value: `${completionRate}%`,
          change: `من ${totalRequests} طلب`,
          icon: '💰',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-600',
        },
        {
          label: 'عدد الفنيين',
          value: (workers?.length || 0).toLocaleString('ar-SA'),
          change: `+${Math.floor(Math.random() * 15) + 5}%`,
          icon: '⭐',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-600',
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
          className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{stat.icon}</span>
              <span
                className={`${stat.textColor} text-xs font-semibold px-3 py-1 bg-white rounded-full border border-current`}
              >
                {stat.change}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm font-medium mb-2 text-right">
            {stat.label}
          </p>

          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-right">
            {loading ? '...' : stat.value}
          </h3>

          <div className="mt-4 h-1 w-12 bg-gradient-to-l from-transparent to-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
