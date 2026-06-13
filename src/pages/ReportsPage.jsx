import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import { requestAPI, workerAPI } from '../services/adminApi';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState(null);
  const [workersCount, setWorkersCount] = useState(0);

  useEffect(() => {
    loadLiveData();
  }, []);

  const loadLiveData = async () => {
    try {
      setLoading(true);
      const [stats, workers] = await Promise.all([
        requestAPI.getRequestStats(),
        workerAPI.getAllWorkers({ limit: 1000 }),
      ]);
      setLiveStats(stats);
      setWorkersCount(workers?.length || 0);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('فشل تحميل بيانات التقارير');
    } finally {
      setLoading(false);
    }
  };

  const completionRate =
    liveStats && liveStats['الكل'] > 0
      ? Math.round(((liveStats['مكتملة'] || 0) / liveStats['الكل']) * 100)
      : 0;

  const reports = [
    {
      id: 1,
      title: 'تقرير أداء الطلبات',
      description: 'تقرير شامل عن حالة جميع الطلبات في النظام',
      date: new Date().toLocaleDateString('ar-SA'),
      status: loading ? 'جاري التحميل' : 'مكتمل',
      icon: '📊',
      details: {
        content: 'تقرير شامل يغطي جميع جوانب الأداء بناءً على البيانات الحالية',
        metrics: loading
          ? []
          : [
              { label: 'إجمالي الطلبات', value: (liveStats?.['الكل'] || 0).toLocaleString('ar-SA') },
              { label: 'الطلبات المكتملة', value: (liveStats?.['مكتملة'] || 0).toLocaleString('ar-SA') },
              { label: 'الطلبات المعلقة', value: (liveStats?.['معلقة'] || 0).toLocaleString('ar-SA') },
              { label: 'معدل الإكمال', value: `${completionRate}%` },
            ],
        summary: `إجمالي ${liveStats?.['الكل'] || 0} طلب في النظام، منها ${liveStats?.['مكتملة'] || 0} مكتملة بمعدل إكمال ${completionRate}%`,
      },
    },
    {
      id: 2,
      title: 'تقرير حالة الطلبات',
      description: 'توزيع تفصيلي لحالات الطلبات المختلفة',
      date: new Date().toLocaleDateString('ar-SA'),
      status: loading ? 'جاري التحميل' : 'مكتمل',
      icon: '📋',
      details: {
        content: 'تحليل تفصيلي لتوزيع الطلبات حسب حالتها',
        metrics: loading
          ? []
          : [
              { label: 'معلقة', value: liveStats?.['معلقة'] || 0 },
              { label: 'مقبولة', value: liveStats?.['مقبولة'] || 0 },
              { label: 'قيد التنفيذ', value: liveStats?.['قيد التنفيذ'] || 0 },
              { label: 'مرفوضة', value: liveStats?.['مرفوضة'] || 0 },
              { label: 'ملغية', value: liveStats?.['ملغية'] || 0 },
            ],
        summary: `توزيع الطلبات: ${liveStats?.['معلقة'] || 0} معلقة، ${liveStats?.['مقبولة'] || 0} مقبولة، ${liveStats?.['مكتملة'] || 0} مكتملة`,
      },
    },
    {
      id: 3,
      title: 'تقرير الفنيين',
      description: 'إحصائيات حول الفنيين المسجلين في المنصة',
      date: new Date().toLocaleDateString('ar-SA'),
      status: loading ? 'جاري التحميل' : 'مكتمل',
      icon: '�',
      details: {
        content: 'تقرير عن الفنيين المسجلين وحالة اعتمادهم',
        metrics: loading
          ? []
          : [
              { label: 'إجمالي الفنيين', value: workersCount.toLocaleString('ar-SA') },
              { label: 'إجمالي الطلبات', value: (liveStats?.['الكل'] || 0).toLocaleString('ar-SA') },
              { label: 'الطلبات المكتملة', value: (liveStats?.['مكتملة'] || 0).toLocaleString('ar-SA') },
              { label: 'معدل الإكمال', value: `${completionRate}%` },
            ],
        summary: `${workersCount} فني مسجل في المنصة مع معدل إكمال طلبات ${completionRate}%`,
      },
    },
  ];

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;

    try {
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.direction = 'rtl';
      element.style.textAlign = 'right';

      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; margin: 0; color: #333;">${selectedReport.title}</h1>
        </div>
        
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          <p style="margin: 5px 0;"><strong>التاريخ:</strong> ${selectedReport.date}</p>
          <p style="margin: 5px 0;"><strong>الحالة:</strong> ${selectedReport.status}</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h2 style="font-size: 16px; color: #333; margin-bottom: 10px;">الوصف</h2>
          <p style="color: #666; line-height: 1.6;">${selectedReport.details.content}</p>
        </div>

        <div style="margin-bottom: 15px;">
          <h2 style="font-size: 16px; color: #333; margin-bottom: 10px;">المقاييس الرئيسية</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${selectedReport.details.metrics.map(metric => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; text-align: right; color: #333;"><strong>${metric.label}</strong></td>
                <td style="padding: 10px; text-align: left; color: #D97706; font-weight: bold;">${metric.value}</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div style="background-color: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
          <h3 style="font-size: 14px; color: #1e40af; margin-top: 0;">الملخص</h3>
          <p style="color: #1e3a8a; line-height: 1.6; margin: 0;">${selectedReport.details.summary}</p>
        </div>

        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
          <p>تم التحميل في: ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `${selectedReport.title}.pdf`,
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
          التقارير
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          جميع التقارير والتحليلات المتاحة
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 animate-pulse">جاري تحميل البيانات...</p>
        </div>
      ) : (
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
                <button
                  onClick={() => handleViewReport(report)}
                  className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
                >
                  عرض التقرير →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={loadLiveData}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white 
                    font-semibold rounded-full transition-all duration-200 
                    transform hover:scale-105 shadow-md"
        >
          🔄 تحديث التقارير
        </button>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-600 mb-4">{selectedReport.details.content}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">المقاييس الرئيسية</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedReport.details.metrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold text-[#D97706]">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-2">الملخص</h3>
                <p className="text-sm text-blue-800">{selectedReport.details.summary}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-lg transition-colors"
                >
                  تحميل PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
