import React from 'react';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: 'الحماية الأساسية',
      description: 'خدمة حماية أساسية للعملاء',
      price: '99 ر.س',
      users: 1250,
      status: 'نشط',
      icon: '🛡️',
    },
    {
      id: 2,
      name: 'الدعم الفني',
      description: 'خدمة دعم فني 24/7',
      price: '199 ر.س',
      users: 850,
      status: 'نشط',
      icon: '💻',
    },
    {
      id: 3,
      name: 'التشفير المتقدم',
      description: 'خدمة تشفير متقدمة وآمنة',
      price: '299 ر.س',
      users: 450,
      status: 'نشط',
      icon: '🔐',
    },
    {
      id: 4,
      name: 'إدارة الشبكات',
      description: 'خدمة إدارة شبكات احترافية',
      price: '399 ر.س',
      users: 320,
      status: 'قيد التطوير',
      icon: '🌐',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          الخدمات
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          إدارة وعرض جميع الخدمات المتاحة
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 
                       transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-4xl">{service.icon}</span>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  service.status === 'نشط'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {service.status}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-right">
              {service.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">السعر</p>
                <p className="text-lg font-bold text-orange-600">{service.price}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">المستخدمين</p>
                <p className="text-lg font-bold text-gray-900">{service.users}</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 
                              text-white font-semibold rounded-lg transition-all 
                              duration-200 transform hover:scale-105">
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

      {/* Add New Service Button */}
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white 
                          font-semibold rounded-full transition-all duration-200 
                          transform hover:scale-105 shadow-md">
          + إضافة خدمة جديدة
        </button>
      </div>
    </div>
  );
}
