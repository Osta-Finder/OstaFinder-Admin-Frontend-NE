import React from 'react';

const Badge = ({ children, status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';

  switch (status) {
    case 'مكتمل':
      bgColor = 'bg-green-100';
      textColor = 'text-green-600';
      break;
    case 'قيد الانتظار':
    case 'بانتظار المقابلة':
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-600';
      break;
    case 'جاري العمل':
    case 'قيد المراجعة':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-600';
      break;
    default:
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${bgColor} ${textColor}`}>
      {status === 'قيد المراجعة' && <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>}
      {status === 'بانتظار المقابلة' && <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
      {children}
    </span>
  );
};

export default Badge;
