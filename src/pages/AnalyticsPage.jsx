import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { 
  ArrowDownTrayIcon,
  ArchiveBoxIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { requestAPI, workerAPI } from '../services/adminApi';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

const StatBox = ({ label, value, change, icon: Icon, loading }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
          ) : (
            value
          )}
        </h3>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('week');
  const [stats, setStats] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const statsData = await requestAPI.getRequestStats();

      setStats(statsData);

      // Build pie chart from real stats — exclude zero-value entries
      const statusEntries = [
        { name: 'مكتملة',     value: statsData['مكتملة']       || 0, color: '#10B981' },
        { name: 'معلقة',      value: statsData['معلقة']        || 0, color: '#F59E0B' },
        { name: 'ملغية',      value: statsData['ملغية']        || 0, color: '#EF4444' },
        { name: 'مقبولة',     value: statsData['مقبولة']       || 0, color: '#3B82F6' },
        { name: 'قيد التنفيذ',value: statsData['قيد التنفيذ']  || 0, color: '#8B5CF6' },
        { name: 'مرفوضة',     value: statsData['مرفوضة']       || 0, color: '#EC4899' },
      ].filter((e) => e.value > 0);

      setPieData(statusEntries.length > 0 ? statusEntries : [{ name: 'لا توجد بيانات', value: 1, color: '#E5E7EB' }]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('فشل تحميل بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  // Bar chart — build from real status counts
  const barData = stats
    ? [
        { name: 'معلقة',       count: stats['معلقة']       || 0 },
        { name: 'مقبولة',      count: stats['مقبولة']      || 0 },
        { name: 'قيد التنفيذ', count: stats['قيد التنفيذ'] || 0 },
        { name: 'مكتملة',      count: stats['مكتملة']      || 0 },
        { name: 'مرفوضة',      count: stats['مرفوضة']      || 0 },
        { name: 'ملغية',       count: stats['ملغية']       || 0 },
      ]
    : [];

  const completionRate =
    stats && stats['الكل'] > 0
      ? Math.round(((stats['مكتملة'] || 0) / stats['الكل']) * 100)
      : 0;

  const handleDownloadReport = () => {
    try {
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.direction = 'rtl';
      element.style.textAlign = 'right';

      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; margin: 0; color: #333;">تقرير التحليلات</h1>
          <p style="color: #666; margin: 10px 0 0 0;">أوستا فايندر - نظام إدارة الخدمات</p>
        </div>

        <div style="margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 15px;">
          <h2 style="font-size: 18px; color: #333; margin-bottom: 15px;">ملخص الطلبات</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>المقياس</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>القيمة</strong></td>
            </tr>
            ${[
              ['إجمالي الطلبات',   stats?.['الكل']        ?? 0],
              ['معلقة',            stats?.['معلقة']       ?? 0],
              ['مقبولة',           stats?.['مقبولة']      ?? 0],
              ['قيد التنفيذ',      stats?.['قيد التنفيذ'] ?? 0],
              ['مكتملة',           stats?.['مكتملة']      ?? 0],
              ['مرفوضة',           stats?.['مرفوضة']      ?? 0],
              ['ملغية',            stats?.['ملغية']       ?? 0],
              ['معدل الإكمال',     `${completionRate}%`],
            ]
              .map(([k, v]) => `<tr><td style="padding:10px;border:1px solid #ddd;">${k}</td><td style="padding:10px;border:1px solid #ddd;color:#D97706;font-weight:bold;">${v}</td></tr>`)
              .join('')}
          </table>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
          <p>تم إصدار التقرير في: ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `تقرير-التحليلات-${new Date().toLocaleDateString('ar-SA')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
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
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">التحليلات التفصيلية</h1>
        <p className="text-gray-600 text-sm lg:text-base">تحليل شامل لأداء الطلبات</p>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={handleDownloadReport}
          disabled={loading || !stats}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors shadow-md"
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="إجمالي الطلبات"  value={stats?.['الكل']   ?? 0} change={`${stats?.['مكتملة'] ?? 0} مكتملة`} icon={ArchiveBoxIcon} loading={loading} />
        <StatBox label="الطلبات المعلقة" value={stats?.['معلقة']  ?? 0} change="قيد الانتظار"  icon={ClockIcon} loading={loading} />
        <StatBox label="معدل الإكمال"    value={`${completionRate}%`}   change="من الإجمالي"   icon={CheckCircleIcon} loading={loading} />
        <StatBox label="الطلبات الملغية" value={stats?.['ملغية']  ?? 0} change="تم إلغاؤها"   icon={XCircleIcon} loading={loading} />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-80 flex items-center justify-center">
              <p className="text-gray-400 animate-pulse">جاري التحميل...</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع الطلبات حسب الحالة</h3>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [value, 'عدد الطلبات']}
                  />
                  <Bar dataKey="count" fill="#D97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع حالة الطلبات</h3>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={pieData.length > 1 ? 4 : 0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2" dir="rtl">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary table */}
      {!loading && stats && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص تفصيلي</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right border-b border-gray-100">
                  <th className="pb-3 font-semibold text-gray-600">الحالة</th>
                  <th className="pb-3 font-semibold text-gray-600">العدد</th>
                  <th className="pb-3 font-semibold text-gray-600">النسبة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { label: 'معلقة',       key: 'معلقة',       color: '#F59E0B' },
                  { label: 'مقبولة',      key: 'مقبولة',      color: '#3B82F6' },
                  { label: 'قيد التنفيذ', key: 'قيد التنفيذ', color: '#8B5CF6' },
                  { label: 'مكتملة',      key: 'مكتملة',      color: '#10B981' },
                  { label: 'مرفوضة',      key: 'مرفوضة',      color: '#EC4899' },
                  { label: 'ملغية',       key: 'ملغية',        color: '#EF4444' },
                ].map(({ label, key, color }) => {
                  const count = stats[key] || 0;
                  const pct = stats['الكل'] > 0 ? Math.round((count / stats['الكل']) * 100) : 0;
                  return (
                    <tr key={key} className="py-3">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          {label}
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-gray-800">{count}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                          <span className="text-gray-500">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
