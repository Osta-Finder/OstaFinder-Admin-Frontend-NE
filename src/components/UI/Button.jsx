import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#E56E24] hover:bg-[#d46520] text-white",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white",
    danger: "border border-red-200 hover:bg-red-50 text-red-600 bg-white",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
