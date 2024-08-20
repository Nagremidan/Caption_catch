import React from 'react';

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Error</h1>
      <p>{message}</p>
    </div>
  </div>
);

export default ErrorDisplay;