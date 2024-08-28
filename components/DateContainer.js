'use client'

import React, { useState } from 'react';
import { CalendarDaysIcon } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-[#ff1d58] via-[#f75990] to-[#0049B7] rounded-lg shadow-lg p-4 mb-8 flex items-center justify-between transform hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#fff685] mr-2 sm:mr-3 group-hover:animate-bounce" />
          <span className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">{formattedDate}</span>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-[#00DDFF] bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium hover:bg-opacity-30 transition-all duration-300 whitespace-nowrap"
        >
          Reminder!
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-modal-appear">
            <h3 className="text-xl sm:text-2xl font-bold text-[#ff1d58] mb-4">🚚 Delivery Day Reminder</h3>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              {`You've got this! Delivery list is ready. Remember, safety is our top priority. Drive carefully. Thanks!`}
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-[#0049B7] text-white py-2 px-4 rounded-lg hover:bg-[#00DDFF] hover:text-[#0049B7] transition-colors duration-300 text-sm sm:text-base"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}