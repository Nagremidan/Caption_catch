import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";

const BusFilter = ({ selectedBus, onBusChange, busOptions, error }) => {
  return (
    <div className="mb-4">
      <div className="w-full p-3 bg-white rounded-lg shadow-md" style={{
        backgroundImage: `
          linear-gradient(#e6e6e6 1px, transparent 1px),
          linear-gradient(90deg, #e6e6e6 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        borderLeft: '2px solid #9999ff'
      }}>
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-bold text-blue-700" style={{ fontFamily: 'Georgia, serif' }}>Filter by Bus/Location</h3>
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

const NotebookBoxCountBadges = ({ busData, selectedBus, onBusChange }) => {
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
      <div className="mb-6 bg-transparent">
        <BusFilter
          selectedBus={selectedBus}
          onBusChange={onBusChange}
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
          borderLeft: '2px solid #000000'
        }}>
          <h3 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: 'Georgia, serif' }}>Total Boxes</h3>
          <p className="text-black" style={{ fontFamily: 'Verdana, sans-serif' }}>No bus data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-transparent pt-0 mt-0">
      <BusFilter
        selectedBus={selectedBus}
        onBusChange={onBusChange}
        busOptions={busOptions}
        error={null}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 rounded-xl shadow-2xl p-6 sm:p-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-black text-center tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Total Boxes</h3>
        <div className="space-y-6">
          {Object.entries(filteredBusData).map(([busKey, busInfo], index) => {
            const isDelivered = deliveryStatus[busKey] || false;

            return (
              <motion.div 
                key={busKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isDelivered ? 'bg-green-100' : 'bg-white'
                } hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-black" style={{ fontFamily: 'Verdana, sans-serif' }}>{busKey}</span>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeliveryCheck(busKey)}
                      className={`focus:outline-none p-1 rounded-full ${
                        isDelivered ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isDelivered ? "#ffffff" : "#4b5563"}
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </motion.button>
                    <motion.span 
                      layout
                      className={`text-xl font-bold px-3 py-1 rounded-full ${
                        isDelivered ? 'bg-green-500 text-white' : 'bg-yellow-300 text-black'
                      }`}
                    >
                      {busInfo.totalBoxes}
                    </motion.span>
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