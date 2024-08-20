import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";

const BusFilter = ({ selectedBus, onBusChange, busOptions, error }) => {
  return (
    <div className="mb-4 flex justify-end">
      <div className="w-full sm:w-64 p-3 bg-white rounded-lg shadow-md" style={{
        backgroundImage: `
          linear-gradient(#e6e6e6 1px, transparent 1px),
          linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        borderLeft: '2px solid #9999ff'
      }}>
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-bold text-blue-600" style={{ fontFamily: 'Georgia, serif' }}>Filter by Bus/Location</h3>
          {error ? (
            <div className="bg-red-100 text-red-800 p-2 rounded-md flex items-start space-x-2 text-xs" style={{ fontFamily: 'Verdana, sans-serif' }}>
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
              style={{ fontFamily: 'Verdana, sans-serif' }}
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

const NotebookBoxCountBadges = ({ busData }) => {
  const [selectedBus, setSelectedBus] = useState('All');
  const [deliveryStatus, setDeliveryStatus] = useState({});

  const groupedBusData = useMemo(() => {
    return busData.reduce((acc, item) => {
      const busKey = item.bus || item.location || 'Unknown';
      if (!acc[busKey]) {
        acc[busKey] = { totalBoxes: 0, items: [] };
      }
      acc[busKey].totalBoxes += Number(item.numberOfBoxes || 0);
      acc[busKey].items.push(item);
      return acc;
    }, {});
  }, [busData]);

  const busOptions = ['All', ...Object.keys(groupedBusData)];

  const handleDeliveryCheck = (bus) => {
    setDeliveryStatus(prev => ({
      ...prev,
      [bus]: !prev[bus]
    }));
  };

  const filteredBusData = selectedBus === 'All' 
    ? groupedBusData 
    : { [selectedBus]: groupedBusData[selectedBus] };

  if (!busData || busData.length === 0) {
    return (
      <div className="mb-6">
        <BusFilter
          selectedBus={selectedBus}
          onBusChange={setSelectedBus}
          busOptions={['All']}
          error="No bus data available"
        />
        <div className="bg-white rounded-lg shadow-md p-6 text-center" style={{
          backgroundImage: `
            linear-gradient(#e6e6e6 1px, transparent 1px),
            linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderLeft: '2px solid #ff9999'
        }}>
          <h3 className="text-2xl font-bold mb-4 text-blue-600" style={{ fontFamily: 'Georgia, serif' }}>Total Boxes</h3>
          <p className="text-gray-600" style={{ fontFamily: 'Verdana, sans-serif' }}>No bus data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <BusFilter
        selectedBus={selectedBus}
        onBusChange={setSelectedBus}
        busOptions={busOptions}
        error={null}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
        style={{
          backgroundImage: `
            linear-gradient(#e6e6e6 1px, transparent 1px),
            linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderLeft: '2px solid #ff9999'
        }}
      >
        <h3 className="text-2xl font-bold mb-4 text-blue-600" style={{ fontFamily: 'Georgia, serif' }}>Total Boxes</h3>
        <div className="space-y-4">
          {Object.entries(filteredBusData).map(([busKey, busInfo], index) => {
            const isDelivered = deliveryStatus[busKey] || false;

            return (
              <motion.div 
                key={busKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isDelivered ? 'bg-green-100' : 'bg-yellow-100'
                }`}
                style={{ fontFamily: 'Verdana, sans-serif' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">{busKey}</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDeliveryCheck(busKey)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none ${
                        isDelivered
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }`}
                    >
                      {isDelivered ? 'Delivered' : 'Mark Delivered'}
                    </button>
                    <span className="text-xl font-bold px-3 py-1 rounded-full bg-white text-gray-800 border border-gray-300">
                      {busInfo.totalBoxes}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default NotebookBoxCountBadges;