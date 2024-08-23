'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import Header from '@/components/Header';
import NotebookBusDetails from '@/components/NotebookBusDetails';
import NotebookBoxCountBadges from '@/components/NotebookBoxCountBadges';
import Footer from '@/components/Footer';

const NotebookPage = () => {
  const [driverData, setDriverData] = useState(null);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const driverSheetRef = collection(db, 'driversheets');
        const busDetailsRef = collection(db, 'busdetails');

        const [driverSnapshot, busSnapshot] = await Promise.all([
          getDocs(driverSheetRef),
          getDocs(busDetailsRef)
        ]);

        const driverDoc = driverSnapshot.docs[0]?.data();
        if (!driverDoc) {
          throw new Error('No driver data found');
        }
        setDriverData(driverDoc);

        const busDetails = busSnapshot.docs.map(doc => doc.data());
        if (busDetails.length === 0) {
          throw new Error('No bus data found');
        }
        setBusData(busDetails);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBusChange = (bus) => {
    setSelectedBus(bus);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-black">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we fetch the data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-black p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg" style={{
          backgroundImage: `
            linear-gradient(#e6e6e6 1px, transparent 1px),
            linear-gradient(90deg, #e6e6e6 1px, transparent 1px),
            linear-gradient(#f0f0f0 1px, transparent 1px),
            linear-gradient(90deg, #f0f0f0 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderLeft: '2px solid #ff9999'
        }}>
          <NotebookBoxCountBadges 
            busData={busData} 
            selectedBus={selectedBus} 
            onBusChange={handleBusChange} 
          />
          <NotebookBusDetails 
            busData={busData} 
            selectedBus={selectedBus} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotebookPage;