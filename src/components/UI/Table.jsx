import React, { useState } from 'react';

const Table = ({ columns, data, renderRow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

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
            {currentData.map((item, index) => (
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
      
      {/* Pagination Footer */}
      <div className="p-5 flex items-center justify-between border-t border-gray-100 text-sm text-gray-500 bg-slate-50/30">
        <div className="flex gap-2">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            &lt;
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                currentPage === page
                  ? 'bg-[#A85121] text-white border-[#A85121]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            &gt;
          </button>
        </div>
        <div>
          عرض {startIndex + 1} إلى {Math.min(endIndex, data.length)} من {data.length} طلب
        </div>
      </div>
    </div>
  );
};

export default Table;
