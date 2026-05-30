import React, { useState } from 'react';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      status: 'نشط',
      joinDate: '2026-01-15',
      avatar: '👤',
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '+966502345678',
      status: 'نشط',
      joinDate: '2026-02-20',
      avatar: '👩',
    },
    {
      id: 3,
      name: 'محمد سالم',
      email: 'salem@example.com',
      phone: '+966503456789',
      status: 'غير نشط',
      joinDate: '2026-03-10',
      avatar: '👨',
    },
    {
      id: 4,
      name: 'نور خالد',
      email: 'noor@example.com',
      phone: '+966504567890',
      status: 'نشط',
      joinDate: '2026-04-05',
      avatar: '👩‍🦰',
    },
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.name.includes(searchTerm) || customer.email.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          العملاء
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          إدارة وعرض جميع العملاء
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="ابحث عن عميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:border-transparent transition-all duration-200"
        />
        <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white 
                          font-semibold rounded-lg transition-all duration-200">
          بحث
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  تاريخ الانضمام
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.name}
                        </p>
                      </div>
                      <span className="text-2xl">{customer.avatar}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        customer.status === 'نشط'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm">
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-2">إجمالي العملاء</p>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-2">العملاء النشطين</p>
          <p className="text-3xl font-bold text-green-600">
            {customers.filter((c) => c.status === 'نشط').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-2">العملاء غير النشطين</p>
          <p className="text-3xl font-bold text-gray-600">
            {customers.filter((c) => c.status === 'غير نشط').length}
          </p>
        </div>
      </div>
    </div>
  );
}
