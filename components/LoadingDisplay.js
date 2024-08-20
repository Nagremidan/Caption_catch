import React from 'react';

const LoadingDisplay = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      <p className="text-gray-500">Please wait while we fetch the data.</p>
    </div>
  </div>
);

export default LoadingDisplay;