import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCards({ totalArticles, diesel, startTime }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Boxes" value={totalArticles} icon="📦" />
      <StatCard title="Diesel Expense" value={diesel} icon="⛽" />
      <StatCard title="Vehicle Start Time" value={startTime} icon="🕒" />
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="p-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800"
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}