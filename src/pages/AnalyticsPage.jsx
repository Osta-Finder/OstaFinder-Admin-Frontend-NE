import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'السبت', orders: 120 },
  { name: 'الأحد', orders: 150 },
  { name: 'الإثنين', orders: 180 },
  { name: 'الثلاثاء', orders: 140 },
  { name: 'الأربعاء', orders: 200 },
  { name: 'الخميس', orders: 250 },
  { name: 'الجمعة', orders: 300 },
];

const pieData = [
  { name: 'مكتمل', value: 600 },
  { name: 'قيد الانتظار', value: 300 },
  { name: 'ملغى', value: 100 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">التحليلات التفصيلية</h1>
        <p className="text-sm text-gray-500">تحليل الأداء والمبيعات خلال الأسبوع الحالي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#F2DECF] shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">الطلبات الأسبوعية</h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="orders" fill="#E56E24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F2DECF] shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">توزيع حالة الطلبات</h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4" dir="rtl">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
