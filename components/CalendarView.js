'use client'

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Header from '@/components/Header';

const CalendarView = ({ driverName }) => {
  
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const livecbecargoRef = collection(db, 'Livecbecargo');
          const livecbecargoSnapshot = await getDocs(livecbecargoRef);
          
          const eventData = {};
          livecbecargoSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.date; // Format is 'YYYY-MM-DD'
            eventData[date] = {
              driverName: data.driverName,
              diesel: data.diesel,
              total: data.total,
            };
          });
  
          setEvents(eventData);
          console.log('Fetched events:', eventData);  // Debug log
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load driver data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const formatDate = (date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
  
    const tileContent = ({ date, view }) => {
      if (view === 'month') {
        const dateStr = formatDate(date);
        const event = events[dateStr];
        if (event) {
          return (
            <div className="event-indicator">
              <span className="event-text">{event.driverName}</span>
            </div>
          );
        }
      }
    };
  
    const handleDateChange = (date) => {
      const dateStr = formatDate(date);
      console.log('Selected date:', dateStr);  // Debug log
      console.log('Event for selected date:', events[dateStr]);  // Debug log
      setSelectedDate(date);
      setSelectedEvent(events[dateStr] || null);
    };
  
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>{error}</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-indigo-200">
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-900">Calendar View (CBE Cargo)</h2>
        <div className="mx-auto bg-white p-6 rounded-lg shadow-lg" style={{ maxWidth: '900px', overflowX: 'auto' }}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            className="custom-calendar"
            tileClassName={({ date, view }) => 
              view === 'month' ? 'custom-tile text-center' : null
            }
          />
        </div>
        {selectedEvent ? (
          <div className="mt-6 mx-auto bg-white p-6 rounded-lg shadow-lg" style={{ maxWidth: '900px' }}>
            <h3 className="text-2xl font-bold mb-4 text-purple-900">Selected Date: {formatDate(selectedDate)}</h3>
            <p className="text-lg mb-2">
              <strong className="text-purple-900">Driver:</strong> 
              <span className="text-gray-900 font-semibold"> {selectedEvent.driverName}</span>
            </p>
            <p className="text-lg mb-2">
              <strong className="text-purple-900">Diesel:</strong> 
              <span className="text-gray-900"> ₹{selectedEvent.diesel}</span>
            </p>
            <p className="text-lg">
              <strong className="text-purple-900">Total Boxes:</strong> 
              <span className="text-gray-900"> {selectedEvent.total}</span>
            </p>
          </div>
        ) : (
          <div className="mt-6 mx-auto bg-white p-6 rounded-lg shadow-lg flex items-center justify-center" style={{ maxWidth: '900px', height: '200px' }}>
            <p className="text-lg text-center text-gray-800">No event data for {formatDate(selectedDate)}</p>
          </div>
        )}
      </main>
      <style jsx global>{`
        .custom-calendar {
          border: none;
          border-radius: 0.5rem;
          overflow: hidden;
          font-size: 1.1rem;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        .custom-calendar .react-calendar__navigation {
          background-color: #4C1D95;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
        }
        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1.2rem;
          padding: 0.5rem;
          color: white;
        }
        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #6D28D9;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          background-color: #EDE9FE;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.8rem;
          color: #4C1D95;
          padding: 0.5rem 0;
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
          text-align: center;
        }
        .custom-calendar .react-calendar__month-view__days__day--weekend {
          color: #9F1239;
        }
        .custom-calendar .react-calendar__tile {
          aspect-ratio: 1 / 1;
          max-width: 100%;
          padding: 0.5em 0.25em;
          background-color: white;
          border: 1px solid #E5E7EB;
          color: #1F2937;
          position: relative;
        }
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #EDE9FE;
        }
        .custom-calendar .react-calendar__tile--active {
          background-color: #4C1D95;
          color: white;
        }
        .custom-calendar .react-calendar__tile--now {
          background-color: #DDD6FE;
          color: #4C1D95;
        }
        .event-indicator {
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }
        .event-text {
          background-color: #4C1D95;
          color: white;
          font-size: 0.7rem;
          padding: 1px 2px;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }
        @media (max-width: 640px) {
          .custom-calendar {
            font-size: 0.9rem;
          }
          .custom-calendar .react-calendar__tile {
            padding: 0.25em 0.1em;
          }
          .event-text {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarView;