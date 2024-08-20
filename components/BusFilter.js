import React from 'react';

const BusFilter = ({ selectedBus, onBusChange, busOptions, error }) => {
  return (
    <div className="my-6 flex justify-end">
      <div className="w-full sm:w-64 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-bold text-white">Filter by Bus/Location</h3>
          {error ? (
            <div className="bg-black text-white p-2 rounded-md flex items-start space-x-2 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold">Error</h4>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <select
              value={selectedBus}
              onChange={(e) => onBusChange(e.target.value)}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {busOptions.map((bus) => (
                <option key={bus} value={bus}>
                  {bus === 'All' ? 'All Buses' : bus}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusFilter;