import React from 'react';

const services = [
  {
    id: 1,
    name: 'السباكة',
    percentage: 35,
    icon: '🔧',
    color: 'from-orange-400 to-orange-500',
  },
  {
    id: 2,
    name: 'الكهرباء',
    percentage: 28,
    icon: '⚡',
    color: 'from-yellow-400 to-yellow-500',
  },
  {
    id: 3,
    name: 'النجارة',
    percentage: 22,
    icon: '🪵',
    color: 'from-amber-400 to-amber-500',
  },
  {
    id: 4,
    name: 'الصيانة العامة',
    percentage: 15,
    icon: '🛠️',
    color: 'from-gray-400 to-gray-500',
  },
];

export default function ServicePopularity() {
  const totalPercentage = services.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:p-8 transition-all duration-300 hover:shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            شعبية الخدمات
          </h2>
          <p className="text-sm text-gray-500">توزيع الخدمات المستخدمة</p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      <div className="space-y-5">
        {services.map((service) => (
          <div key={service.id} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">{service.icon}</span>
                <span className="font-medium text-gray-700 text-sm">
                  {service.name}
                </span>
              </div>
              <span className="font-bold text-gray-900 text-sm">
                {service.percentage}%
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${service.color} transition-all duration-500 group-hover:shadow-lg`}
                style={{ width: `${service.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">إجمالي الخدمات</span>
          <span className="text-2xl font-bold text-gray-900">
            {totalPercentage}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {services.length} خدمات نشطة
        </p>
      </div>

      <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-sm">
        عرض التفاصيل
      </button>
    </div>
  );
}
