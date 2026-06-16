import React from 'react';

const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-700">
          <thead className="text-xs font-bold text-gray-500 bg-slate-50/80 border-b border-gray-100 uppercase tracking-wider">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-all duration-200"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
