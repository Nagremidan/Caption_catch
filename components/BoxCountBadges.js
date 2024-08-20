import React, { useState, useMemo } from 'react';
import { motion } from "framer-motion";

const BoxCountBadges = ({ busData }) => {
  const [deliveryStatus, setDeliveryStatus] = useState({});

  const groupedBusData = useMemo(() => {
    return busData.reduce((acc, item) => {
      const busKey = item.bus || item.location;
      if (!acc[busKey]) {
        acc[busKey] = { totalBoxes: 0, items: [] };
      }
      acc[busKey].totalBoxes += Number(item.numberOfBoxes || 0);
      acc[busKey].items.push(item);
      return acc;
    }, {});
  }, [busData]);

  const handleDeliveryCheck = (bus) => {
    setDeliveryStatus(prev => ({
      ...prev,
      [bus]: !prev[bus]
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl shadow-2xl p-6 sm:p-8"
    >
      <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center tracking-wide">Total Boxes</h3>
      <div className="space-y-6">
        {Object.entries(groupedBusData).map(([busKey, busInfo], index) => {
          const isDelivered = deliveryStatus[busKey] || false;

          return (
            <motion.div 
              key={busKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg transition-all duration-300 ${
                isDelivered ? 'bg-green-500' : 'bg-white bg-opacity-20'
              } backdrop-filter backdrop-blur-lg hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-white">{busKey}</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDeliveryCheck(busKey)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none ${
                      isDelivered
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                    }`}
                  >
                    {isDelivered ? 'Delivered' : 'Mark Delivered'}
                  </button>
                  <span 
                    className={`text-xl font-bold px-3 py-1 rounded-full ${
                      isDelivered ? 'bg-white text-green-500' : 'bg-yellow-300 text-gray-800'
                    }`}
                  >
                    {busInfo.totalBoxes}
                  </span>
                </div>
              </div>
              
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BoxCountBadges;