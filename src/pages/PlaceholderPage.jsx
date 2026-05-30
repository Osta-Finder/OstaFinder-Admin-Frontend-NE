import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F2DECF] max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 mb-6">هذه الصفحة قيد التطوير. سيتم إضافتها قريباً.</p>
        <div className="w-16 h-1 bg-[#E56E24] mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
