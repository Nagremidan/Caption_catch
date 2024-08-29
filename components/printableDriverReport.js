'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Button } from '@/components/ui/button';

const PrintableDriverReport = () => {
  const [busDetails, setBusDetails] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const busDetailsRef = collection(db, 'busdetails');
      const busDetailsSnapshot = await getDocs(busDetailsRef);
      const busDetailsData = busDetailsSnapshot.docs.map(doc => doc.data());
      setBusDetails(busDetailsData);

      const driverSheetsRef = collection(db, 'driversheets');
      const driverSheetsSnapshot = await getDocs(driverSheetsRef);
      const driverSheetsData = driverSheetsSnapshot.docs.map(doc => doc.data());
      setDriverData(driverSheetsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const groupBusesByName = () => {
    const grouped = {};
    busDetails.forEach(bus => {
      if (!grouped[bus.bus]) {
        grouped[bus.bus] = [];
      }
      grouped[bus.bus].push(bus);
    });
    return grouped;
  };

  const sortedGroupedBuses = () => {
    const grouped = groupBusesByName();
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const groupedBuses = sortedGroupedBuses();

  const calculateTotalBoxes = () => {
    return busDetails.reduce((sum, bus) => sum + parseInt(bus.numberOfBoxes || 0), 0);
  };

  if (loading) {
    return <div className="loading">Loading report data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (busDetails.length === 0 && driverData.length === 0) {
    return <div className="no-data">No data available for the report.</div>;
  }

  const totalBoxes = calculateTotalBoxes();

  return (
    <div className="report-container">
      <h1 className="page-title">Cbe Cargo</h1>
      <div className="driver-data">
        {driverData.map((driver, index) => (
          <div key={index} className="driver-item">
            <p>{driver.date} | {driver.driverName} | Diesel: {driver.diesel} | Total: {totalBoxes} | Start: {driver.vehicleStartTime}</p>
          </div>
        ))}
      </div>
      <div className="print-content">
        {groupedBuses.map(([busName, buses]) => {
          const boxCount = buses.reduce((sum, bus) => sum + parseInt(bus.numberOfBoxes || 0), 0);
          return (
            <div key={busName} className="bus-group">
              <div className="bus-title-container">
                <h2 className="bus-title">{busName}</h2>
                {boxCount > 0 && <span className="box-count">{boxCount} boxes</span>}
              </div>
              <div className="bus-details">
                {buses.map((bus, index) => (
                  <div key={index} className="bus-item">
                    <p>
                      {bus.from} TO {bus.to} - {bus.numberOfBoxes} {bus.paymentMode} {bus.amount}
                    </p>
                    <p className="mobile-numbers">
                      {bus.fromMobile} {bus.toMobile}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={handlePrint} className="print-button">
        Print Report
      </Button>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 0;
        }

        .report-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 10px;
        }

        .page-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .driver-data {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 5px;
          margin-bottom: 10px;
        }

        .driver-item {
          background-color: #f0f0f0;
          padding: 5px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .driver-item p {
          margin: 0;
        }

        .print-content {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .bus-group {
          flex: 1 1 calc(50% - 5px);
          min-width: 250px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .bus-title-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .bus-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .box-count {
          font-size: 1.5rem;
          font-weight: bold;
          color: #e74c3c;
        }

        .bus-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .bus-item {
          margin-bottom: 5px;
          background-color: #f9f9f9;
          padding: 5px;
          border-radius: 4px;
        }

        .bus-item p {
          margin: 0;
        }

        .mobile-numbers {
          font-size: 0.75rem;
          color: #666;
        }

        .print-button {
          display: block;
          margin: 20px auto;
        }

        .loading, .error, .no-data {
          text-align: center;
          padding: 20px;
          font-size: 1.125rem;
        }

        @media screen and (max-width: 768px) {
          .bus-group {
            flex: 1 1 100%;
          }

          .driver-data {
            justify-content: flex-start;
          }

          .driver-item {
            flex: 1 1 100%;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 1mm 5mm 5mm 5mm;  /* Reduced top margin */
          }

          body {
            font-size: 9pt;
            line-height: 1.2;
          }

          .report-container {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .page-title {
            font-size: 14pt;
            margin-bottom: 3mm;  /* Reduced margin */
          }

          .driver-data {
            margin-bottom: 3mm;  /* Reduced margin */
          }

          .driver-item {
            font-size: 10pt;  /* Slightly reduced font size */
            padding: 1px;
          }

          .print-content {
            display: block;
            column-count: 2;
            column-gap: 10px;
            column-rule: 1px solid #ddd;
          }

          .bus-group {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 6mm;  /* Slightly reduced margin */
            box-shadow: none;
          }

          .bus-title-container {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3mm;  /* Reduced margin */
          }

          .bus-title {
            font-size: 11pt;  /* Slightly reduced font size */
          }

          .box-count {
            font-size: 9pt;  /* Slightly reduced font size */
            margin-left: 8mm;
          }

          .bus-details {
            font-size: 8pt;
          }

          .mobile-numbers {
            font-size: 7pt;
          }

          .print-button {
            display: none !important;
          }

          header, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableDriverReport;