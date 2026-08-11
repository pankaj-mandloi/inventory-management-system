import React from 'react';

export const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      />
      <p className="text-primary-600 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};