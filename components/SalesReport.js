
'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import DataEntry from '../components/DataEntry';
import Summary from '../components/Summary';
import BusReports from '../components/BusReports';

const SalesReport = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [busDetails, setBusDetails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allReports, setAllReports] = useState({});
  const [overallSummary, setOverallSummary] = useState({ totalSales: 0, expense: 0, netSales: 0, tmyHandling: 0, farmPickup: 0 });
  const [error, setError] = useState(null);
  const [isDataEntryComplete, setIsDataEntryComplete] = useState(false);
  const [todayExpense, setTodayExpense] = useState('');
  const [farmPickup, setFarmPickup] = useState('');
  const [tmyHandling, setTmyHandling] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('bus');
  const [disabledBuses, setDisabledBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const busesCollection = collection(db, 'busdetails');
        const busesSnapshot = await getDocs(busesCollection);
        const busesList = busesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().bus
        }));
        
        const uniqueBuses = Array.from(new Set(busesList.map(bus => bus.name)))
          .map(name => {
            return busesList.find(bus => bus.name === name);
          });
        
        setBuses(uniqueBuses);
        
        const initialReports = {};
        uniqueBuses.forEach(bus => {
          initialReports[bus.name] = { report: [], totalAmount: 0 };
        });
        setAllReports(initialReports);
      } catch (error) {
        console.error("Error fetching buses:", error);
        setError("Failed to fetch buses. Please try again.");
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    const fetchBusDetails = async () => {
      if (selectedBus) {
        try {
          const busDetailsCollection = collection(db, 'busdetails');
          const q = query(busDetailsCollection, where("bus", "==", selectedBus));
          const busDetailsSnapshot = await getDocs(q);
          const busDetailsList = busDetailsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (busDetailsList.length === 0) {
            throw new Error(`No details found for bus "${selectedBus}"`);
          }
          setBusDetails(busDetailsList);
          setCurrentIndex(0);
        } catch (error) {
          console.error("Error fetching bus details:", error);
          setError(`Failed to fetch details for bus "${selectedBus}". Please try again.`);
          setSelectedBus('');
        }
      }
    };
    fetchBusDetails();
  }, [selectedBus]);

  useEffect(() => {
    updateOverallSummary();
  }, [allReports, todayExpense, farmPickup, tmyHandling]);

  const handleAmountSubmit = (enteredAmount) => {
    if (enteredAmount) {
      if (currentPrompt === 'bus') {
        const currentBusDetail = busDetails[currentIndex];
        if (!currentBusDetail || !currentBusDetail.numberOfBoxes) {
          setError(`Invalid data for ${selectedBus} at index ${currentIndex}. Please check the data and try again.`);
          return;
        }

        const pricePerBox = parseFloat(enteredAmount);
        const numberOfBoxes = parseInt(currentBusDetail.numberOfBoxes);

        if (isNaN(pricePerBox) || isNaN(numberOfBoxes)) {
          setError("Invalid price or number of boxes. Please check the entered values.");
          return;
        }

        const totalAmount = pricePerBox * numberOfBoxes;

        setAllReports(prev => {
          const updatedReport = [
            ...(prev[selectedBus]?.report || []),
            {
              ...currentBusDetail,
              pricePerBox,
              numberOfBoxes,
              totalAmount
            }
          ];
          const updatedTotalAmount = (prev[selectedBus]?.totalAmount || 0) + totalAmount;
          return {
            ...prev,
            [selectedBus]: { 
              ...prev[selectedBus],
              report: updatedReport, 
              totalAmount: updatedTotalAmount 
            }
          };
        });

        if (currentIndex + 1 < busDetails.length) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          setDisabledBuses(prev => [...prev, selectedBus]);
          const nextAvailableBus = buses.find(bus => !disabledBuses.includes(bus.name) && bus.name !== selectedBus);
          if (nextAvailableBus) {
            setSelectedBus(nextAvailableBus.name);
            setCurrentIndex(0);
          } else {
            setIsDataEntryComplete(true);
            setCurrentPrompt('expense');
          }
        }
      } else {
        switch (currentPrompt) {
          case 'expense':
            setTodayExpense(enteredAmount);
            setCurrentPrompt('farmPickup');
            break;
          case 'farmPickup':
            setFarmPickup(enteredAmount);
            setCurrentPrompt('tmyHandling');
            break;
          case 'tmyHandling':
            setTmyHandling(enteredAmount);
            setCurrentPrompt('complete');
            break;
        }
      }
    } else {
      setError("Please enter a valid amount.");
    }
  };

  const updateOverallSummary = () => {
    const baseSales = Object.values(allReports).reduce((sum, report) => sum + report.totalAmount, 0);
    const farmPickupAmount = parseFloat(farmPickup) || 0;
    const tmyHandlingAmount = parseFloat(tmyHandling) || 0;
    const totalSales = baseSales + farmPickupAmount + tmyHandlingAmount;
    const expense = parseFloat(todayExpense) || 0;
    const netSales = totalSales - expense;
    setOverallSummary({ totalSales, expense, netSales, tmyHandling: tmyHandlingAmount, farmPickup: farmPickupAmount });
  };

  const getCommandPrompt = () => {
    if (currentPrompt === 'bus' && busDetails[currentIndex]) {
      return `Enter amount per box for ${selectedBus}: ${busDetails[currentIndex].from} to ${busDetails[currentIndex].to}`;
    } else switch (currentPrompt) {
      case 'expense': return 'Enter total expense for today:';
      case 'farmPickup': return 'Enter Today farm pickup amount:';
      case 'tmyHandling': return 'Enter TMY handling amount:';
      case 'complete': return 'Data entry complete. View summary below.';
      default: return 'Select a bus to start';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-primary mb-6">Sales Report</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <DataEntry
            buses={buses}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            isDataEntryComplete={isDataEntryComplete}
            error={error}
            commandPrompt={getCommandPrompt()}
            handleAmountSubmit={handleAmountSubmit}
            disabledBuses={disabledBuses}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <Summary overallSummary={overallSummary} />
        </div>
      </div>

      <div className="mt-8">
        <BusReports allReports={allReports} />
      </div>
    </div>
  );
};

export default SalesReport;