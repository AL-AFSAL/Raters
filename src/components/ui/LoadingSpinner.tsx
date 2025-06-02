import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-border border-t-primary`} />
    </div>
  );
};

export default LoadingSpinner;