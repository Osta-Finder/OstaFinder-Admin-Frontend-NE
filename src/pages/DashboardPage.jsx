import React from 'react';
import StatsCards from '../components/StatsCards';
import RevenueChart from '../components/RevenueChart';
import ServicePopularity from '../components/ServicePopularity';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          نظرة عامة على الأداء
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          إحصائيات شاملة لأداء الخدمات والعملاء
        </p>
      </div>

      {/* Stats Cards Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          المقاييس الرئيسية
        </h2>
        <StatsCards />
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Service Popularity - Takes 1 column */}
        <div>
          <ServicePopularity />
        </div>
      </div>
    </div>
  );
}
