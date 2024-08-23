'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from "framer-motion";
import BusFilter from './BusFilter';

const BoxCountBadges = ({ busData, selectedBus, onBusChange }) => {
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeliveryCheck(busKey)}
                    className={`focus:outline-none p-1 rounded-full ${
                      isDelivered ? 'bg-white' : 'bg-gray-200'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={isDelivered ? "#22c55e" : "#4b5563"}
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
                      isDelivered ? 'bg-white text-green-500' : 'bg-yellow-300 text-gray-800'
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
  );
};

export default BoxCountBadges;