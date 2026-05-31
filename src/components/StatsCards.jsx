import React from 'react';
import { useSelector } from 'react-redux';

const statsData = [
  {
    id: 1,
    label: 'إجمالي العملاء',
    value: '24,592',
    change: '+12%',
    changeType: 'positive',
    icon: '👥',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
  },
  {
    id: 2,
    label: 'تقييم المتعاملين',
    value: '1,843',
    change: '+5%',
    changeType: 'positive',
    icon: '⭐',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
  },
  {
    id: 3,
    label: 'إجمالي الخدمات',
    value: '8,920',
    change: '+24%',
    changeType: 'positive',
    icon: '📋',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stat.icon}</span>
              <span
                className={`${stat.textColor} text-xs font-semibold px-3 py-1 bg-white rounded-full`}
              >
                {stat.change}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm font-medium mb-2 text-right">
            {stat.label}
          </p>

          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-right">
            {stat.value}
          </h3>

          <div className="mt-4 h-1 w-12 bg-gradient-to-l from-transparent to-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}
