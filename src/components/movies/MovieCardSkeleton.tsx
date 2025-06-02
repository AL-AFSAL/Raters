import React from 'react';

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="card animate-pulse h-full flex flex-col">
      <div className="relative">
        <div className="w-full h-64 bg-gray-700 rounded-t-lg"></div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="flex items-center mt-2 space-x-3">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;