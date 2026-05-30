import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Mock chart data - replace with actual chart library (Recharts, Chart.js, etc.)
const chartData = [
  { month: 'يناير', value: 520 },
  { month: 'فبراير', value: 540 },
  { month: 'مارس', value: 510 },
  { month: 'أبريل', value: 530 },
  { month: 'مايو', value: 550 },
];

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState('month');

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:p-8 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            مسار الإيرادات
          </h2>
          <p className="text-sm text-gray-500">أداء الإيرادات الشهري</p>
        </div>

        {/* Time Range Selector */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700">
            {timeRange === 'month' ? 'شهري' : 'سنوي'}
            <ChevronDownIcon className="w-4 h-4" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTimeRange('month')}
                  className={`w-full text-right px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  } ${timeRange === 'month' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  شهري
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTimeRange('year')}
                  className={`w-full text-right px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  } ${timeRange === 'year' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
                >
                  سنوي
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Chart Container */}
      <div className="bg-gradient-to-b from-orange-50 to-transparent rounded-xl p-6 mb-6">
        {/* Simple Bar Chart Visualization */}
        <div className="flex items-end justify-between gap-4 h-64">
          {chartData.map((data, index) => {
            const height = ((data.value - minValue) / (maxValue - minValue)) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                {/* Bar */}
                <div className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:from-orange-600 group-hover:to-orange-500"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                />
                {/* Label */}
                <span className="text-xs text-gray-600 font-medium">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">الأعلى</p>
          <p className="text-lg font-bold text-gray-900">$550K</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">المتوسط</p>
          <p className="text-lg font-bold text-gray-900">$530K</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">الأقل</p>
          <p className="text-lg font-bold text-gray-900">$510K</p>
        </div>
      </div>
    </div>
  );
}
