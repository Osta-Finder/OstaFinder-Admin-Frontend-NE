import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  WrenchIcon, 
  BoltIcon, 
  BeakerIcon, 
  WrenchScrewdriverIcon, 
  Cog6ToothIcon, 
  PaintBrushIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function ServicePopularity({ orders = [], loading = false }) {
  const navigate = useNavigate();

  const computedServices = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    const counts = {};
    orders.forEach(o => {
      const sName = o.service || 'غير محدد';
      counts[sName] = (counts[sName] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a,b)=>a+b, 0);
    const result = Object.entries(counts).map(([name, count], index) => {
      const percentage = Math.round((count / total) * 100);
      const catColor = [
        'from-orange-400 to-orange-500',
        'from-yellow-400 to-yellow-500',
        'from-amber-400 to-amber-500',
        'from-gray-400 to-gray-500',
        'from-blue-400 to-blue-500',
        'from-green-400 to-green-500'
      ][index % 6];
      const IconComponent = [WrenchIcon, BoltIcon, BeakerIcon, WrenchScrewdriverIcon, Cog6ToothIcon, PaintBrushIcon][index % 6];
      return {
        id: index,
        name,
        percentage,
        IconComponent,
        color: catColor
      };
    });

    return result.sort((a,b) => b.percentage - a.percentage).slice(0, 4); // Top 4
  }, [orders]);

  const totalPercentage = computedServices.reduce((sum, s) => sum + s.percentage, 0);

  const handleViewDetails = () => {
    toast.success('تم الانتقال لصفحة الخدمات');
    navigate('/services');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:p-8 transition-all duration-300 hover:shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            شعبية الخدمات
          </h2>
          <p className="text-sm text-gray-500">توزيع الخدمات المستخدمة</p>
        </div>
        <ChartBarIcon className="w-8 h-8 text-orange-500" />
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="w-full flex justify-center items-center h-40 text-gray-400 animate-pulse">جاري التحميل...</div>
        ) : computedServices.map((service) => (
          <div key={service.id} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <service.IconComponent className="w-5 h-5 text-gray-500" />
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
          {computedServices.length} خدمات نشطة
        </p>
      </div>

      <button 
        onClick={handleViewDetails}
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
      >
        عرض التفاصيل
      </button>
    </div>
  );
}
