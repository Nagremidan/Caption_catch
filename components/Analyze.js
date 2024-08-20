'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import ErrorBoundary from './ErrorBoundary';
import ErrorDisplay from './ErrorDisplay';
import LoadingDisplay from './LoadingDisplay';
import BarChartComponent from './BarChartComponent';
import DriverReport from './DriverReport';
import DieselReport from './DieselReport';

const Analyze = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const livecbecargoRef = collection(db, 'Livecbecargo');
        const snapshot = await getDocs(livecbecargoRef);
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (fetchedData.length === 0) {
          throw new Error('No data available');
        }
        setData(fetchedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (loading) return <LoadingDisplay />;
  if (error) return <ErrorDisplay message={error} />;

  const drivers = ['All', ...new Set(data.map(item => item.driverName))];

  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const months = ['All', ...new Set(data.map(item => getMonthYear(item.date)))];

  const filteredData = data.filter(item => 
    (selectedDriver === 'All' || item.driverName === selectedDriver) &&
    (selectedMonth === 'All' || getMonthYear(item.date) === selectedMonth)
  );

  const rowCount = filteredData.length;
  const totalBoxes = filteredData.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const chartData = filteredData.map(item => ({
    date: item.date,
    boxes: Number(item.total) || 0
  }));

  const totalDiesel = filteredData.reduce((sum, item) => sum + (Number(item.diesel) || 0), 0);

  return (
    <ErrorBoundary>
      <div className="p-4 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Analysis</h2>
        
        <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-700">Boxes per Date</h3>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded text-gray-700 bg-white"
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {month === 'All' ? 'All Months' : month}
                </option>
              ))}
            </select>
          </div>
          {chartData.length > 0 ? (
            <BarChartComponent data={chartData} isMobile={isMobile} />
          ) : (
            <div className="text-center text-gray-500 py-10">No data available for the selected month</div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <DriverReport 
            filteredData={filteredData}
            selectedDriver={selectedDriver}
            drivers={drivers}
            setSelectedDriver={setSelectedDriver}
            rowCount={rowCount}
            totalBoxes={totalBoxes}
          />
          <DieselReport 
            filteredData={filteredData}
            totalDiesel={totalDiesel}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Analyze;