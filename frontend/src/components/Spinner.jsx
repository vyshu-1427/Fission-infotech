import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-brand-500 border-r-transparent border-b-brand-500/20 border-l-transparent animate-spin`}
      />
    </div>
  );
};

export default Spinner;
