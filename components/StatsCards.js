import React from 'react';
import { motion } from 'framer-motion';

const formatTime = (time) => {
  if (!time) return 'N/A';

  let date;
  if (typeof time === 'string') {
    // Try parsing the string directly
    date = new Date(time);
    // If invalid, try parsing as ISO 8601 format
    if (isNaN(date.getTime())) {
      const [hours, minutes] = time.split(':');
      date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
    }
  } else if (time instanceof Date) {
    date = time;
  } else {
    return 'Invalid Time';
  }

  if (isNaN(date.getTime())) return 'Invalid Time';

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutes} ${ampm}`;
};

export default function StatsCards({ totalArticles, diesel, startTime }) {
  const formattedStartTime = formatTime(startTime);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Boxes" value={totalArticles} icon="📦" />
      <StatCard title="Diesel Expense" value={diesel} icon="⛽" />
      <StatCard title="Vehicle Start Time" value={formattedStartTime} icon="🕒" />
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