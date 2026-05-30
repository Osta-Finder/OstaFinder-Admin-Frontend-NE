import React from 'react';

const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#F2DECF] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-700">
          <thead className="text-xs text-gray-500 bg-[#FAFBFD] border-b border-[#F2DECF]">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 font-medium text-gray-900">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="bg-white border-b border-[#F2DECF] last:border-0 hover:bg-gray-50 transition-colors"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 flex items-center justify-between border-t border-[#F2DECF] text-sm text-gray-500">
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-[#A85121] text-white">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">&gt;</button>
        </div>
        <div>
          عرض 1 إلى {data.length} من {data.length > 3 ? data.length : '50'} طلب
        </div>
      </div>
    </div>
  );
};

export default Table;
