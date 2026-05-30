import React from 'react';

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: 'تقرير الأداء الشهري',
      description: 'تقرير شامل عن أداء الخدمات خلال الشهر الحالي',
      date: '2026-05-30',
      status: 'مكتمل',
      icon: '📊',
    },
    {
      id: 2,
      title: 'تقرير رضا العملاء',
      description: 'تقييم رضا العملاء والملاحظات المهمة',
      date: '2026-05-28',
      status: 'قيد المراجعة',
      icon: '⭐',
    },
    {
      id: 3,
      title: 'تقرير الإيرادات',
      description: 'تحليل تفصيلي للإيرادات والمبيعات',
      date: '2026-05-25',
      status: 'مكتمل',
      icon: '💰',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          التقارير
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          جميع التقارير والتحليلات المتاحة
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 
                       transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{report.icon}</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  report.status === 'مكتمل'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {report.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 text-right">
              {report.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-right">
              {report.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">{report.date}</span>
              <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm">
                عرض التقرير →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Report Button */}
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white 
                          font-semibold rounded-full transition-all duration-200 
                          transform hover:scale-105 shadow-md">
          + إنشاء تقرير جديد
        </button>
      </div>
    </div>
  );
}
