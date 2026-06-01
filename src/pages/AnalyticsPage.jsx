import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';

const weeklyData = [
  { name: 'السبت', orders: 120, revenue: 4200 },
  { name: 'الأحد', orders: 150, revenue: 5400 },
  { name: 'الإثنين', orders: 180, revenue: 5100 },
  { name: 'الثلاثاء', orders: 140, revenue: 6300 },
  { name: 'الأربعاء', orders: 200, revenue: 7200 },
  { name: 'الخميس', orders: 250, revenue: 8100 },
  { name: 'الجمعة', orders: 300, revenue: 9200 },
];

const pieData = [
  { name: 'مكتمل', value: 600 },
  { name: 'قيد الانتظار', value: 300 },
  { name: 'ملغى', value: 100 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const StatBox = ({ label, value, change, icon }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('week');

  const handleDownloadReport = () => {
    try {
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.direction = 'rtl';
      element.style.textAlign = 'right';

      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; margin: 0; color: #333;">تقرير التحليلات الأسبوعي</h1>
          <p style="color: #666; margin: 10px 0 0 0;">أوستا أدمن - نظام إدارة الخدمات</p>
        </div>

        <div style="margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 15px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">ملخص الأداء</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>المقياس</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>القيمة</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>التغيير</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">إجمالي الطلبات</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #D97706; font-weight: bold;">1,340</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #10B981;">+15%</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">إجمالي الإيرادات</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #D97706; font-weight: bold;">45,500 ر.س</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #10B981;">+22%</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">معدل الإكمال</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #D97706; font-weight: bold;">85%</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #10B981;">+8%</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">رضا العملاء</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #D97706; font-weight: bold;">4.8/5</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #10B981;">+5%</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 15px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">توزيع حالة الطلبات</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>الحالة</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>العدد</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>النسبة</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">مكتمل</td>
              <td style="padding: 10px; border: 1px solid #ddd;">600</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #10B981;">60%</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">قيد الانتظار</td>
              <td style="padding: 10px; border: 1px solid #ddd;">300</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #F59E0B;">30%</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">ملغى</td>
              <td style="padding: 10px; border: 1px solid #ddd;">100</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #EF4444;">10%</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
          <p>تم إصدار التقرير في: ${new Date().toLocaleString('ar-SA')}</p>
          <p>هذا التقرير يحتوي على بيانات سرية وخاصة بالشركة</p>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `تقرير-التحليلات-${new Date().toLocaleDateString('ar-SA')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(opt).from(element).save();
      toast.success('تم تحميل التقرير بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في تحميل التقرير');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          التحليلات التفصيلية
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          تحليل شامل للأداء والمبيعات والعملاء
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          تحميل التقرير
        </button>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
          <option value="year">هذا العام</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="إجمالي الطلبات" value="1,340" change="+15% من الأسبوع الماضي" icon="📦" />
        <StatBox label="إجمالي الإيرادات" value="45,500 ر.س" change="+22% من الأسبوع الماضي" icon="💰" />
        <StatBox label="معدل الإكمال" value="85%" change="+8% من الأسبوع الماضي" icon="✅" />
        <StatBox label="رضا العملاء" value="4.8/5" change="+5% من الأسبوع الماضي" icon="⭐" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">الطلبات والإيرادات الأسبوعية</h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="orders" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع حالة الطلبات</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">الخدمات الأكثر طلباً</h3>
          <div className="space-y-4">
            {[
              { name: 'السباكة', count: 450, percentage: 35 },
              { name: 'الكهرباء', count: 380, percentage: 28 },
              { name: 'النجارة', count: 290, percentage: 22 },
              { name: 'الصيانة العامة', count: 220, percentage: 15 },
            ].map((service) => (
              <div key={service.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <span className="text-sm text-gray-600">{service.count} طلب</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">أفضل الفنيين</h3>
          <div className="space-y-3">
            {[
              { name: 'أحمد محمود', rating: 4.9, orders: 125 },
              { name: 'محمد علي', rating: 4.8, orders: 118 },
              { name: 'علي حسن', rating: 4.7, orders: 105 },
              { name: 'عمر فاروق', rating: 4.6, orders: 98 },
            ].map((tech) => (
              <div key={tech.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.orders} طلب</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{tech.rating}⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
