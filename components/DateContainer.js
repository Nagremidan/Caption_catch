'use client'

import React, { useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function DateContainer({ date }) {
  const [showModal, setShowModal] = useState(false);
  const formattedDate = formatDate(date);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-lg shadow-lg p-4 mb-8 flex items-center justify-between transform hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-8 w-8 text-white mr-3 group-hover:animate-bounce" />
          <span className="text-2xl font-bold text-white">{formattedDate}</span>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm font-medium hover:bg-opacity-30 transition-all duration-300"
        >
          Reminder for you!
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-modal-appear">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">🚚 Delivery Day Reminder</h3>
            <p className="text-gray-700 mb-6">
              {`You've got this! Delivery list is ready. Remember, safety is our top priority. Drive carefully. Thanks!`}
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}