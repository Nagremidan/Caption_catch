'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Button } from '@/components/ui/button';

const PrintableDriverReport = () => {
  const [driverData, setDriverData] = useState([]);
  const [busDetails, setBusDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const driverSheetsRef = collection(db, 'driversheets');
      const driverSheetsSnapshot = await getDocs(driverSheetsRef);
      const driverSheetsData = driverSheetsSnapshot.docs.map(doc => doc.data());
      setDriverData(driverSheetsData);

      const busDetailsRef = collection(db, 'busdetails');
      const busDetailsSnapshot = await getDocs(busDetailsRef);
      const busDetailsData = busDetailsSnapshot.docs.map(doc => doc.data());
      setBusDetails(busDetailsData);
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

  const groupedBuses = groupBusesByName();

  if (loading) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="spinner"></div>
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <Button onClick={fetchData} className="retry-button">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (driverData.length === 0 && busDetails.length === 0) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>No Data</h2>
          <p>There is no data available for the report.</p>
          <Button onClick={fetchData} className="retry-button">
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="print-content">
        <section className="driver-sheets">
          <h2 className="section-title">Driver Sheets</h2>
          {driverData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Driver Name</th>
                  <th>Diesel</th>
                  <th>Total</th>
                  <th>Vehicle Start Time</th>
                </tr>
              </thead>
              <tbody>
                {driverData.map((driver, index) => (
                  <tr key={index}>
                    <td>{driver.date}</td>
                    <td>{driver.driverName}</td>
                    <td>{driver.diesel}</td>
                    <td>{driver.total}</td>
                    <td>{driver.vehicleStartTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No driver data available.</p>
          )}
        </section>

        <section className="bus-details">
          <h2 className="section-title">Bus Details</h2>
          {Object.entries(groupedBuses).length > 0 ? (
            Object.entries(groupedBuses).map(([busName, buses]) => (
              <div key={busName} className="bus-group">
                <h3 className="bus-title">{busName}</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>From Mobile</th>
                      <th>To</th>
                      <th>To Mobile</th>
                      <th>Boxes</th>
                      <th>Payment Mode</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((bus, index) => (
                      <tr key={index}>
                        <td>{bus.from}</td>
                        <td>{bus.fromMobile}</td>
                        <td>{bus.to}</td>
                        <td>{bus.toMobile}</td>
                        <td>{bus.numberOfBoxes}</td>
                        <td>{bus.paymentMode}</td>
                        <td>{bus.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No bus details available.</p>
          )}
        </section>
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
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
        }

        .print-content {
          font-size: 10pt;
        }

        .section-title {
          font-size: 14pt;
          font-weight: 600;
          margin-bottom: 10px;
          page-break-after: avoid;
        }

        .bus-title {
          font-size: 12pt;
          font-weight: 500;
          margin-top: 20px;
          margin-bottom: 5px;
          page-break-after: avoid;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .data-table th,
        .data-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .data-table th {
          background-color: #f2f2f2;
          font-weight: 600;
        }

        .data-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .print-button {
          display: block;
          margin: 20px auto;
        }

        .error-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1000;
        }

        .error-content {
          background-color: #000;
          color: #fff;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          max-width: 80%;
        }

        .error-content h2 {
          margin-top: 0;
        }

        .retry-button {
          margin-top: 1rem;
          background-color: #fff;
          color: #000;
        }

        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #fff;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media print {
          body {
            background: white;
          }

          .report-container {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .print-content {
            padding: 10mm;
          }

          .print-button,
          .error-container {
            display: none !important;
          }

          .data-table {
            page-break-inside: auto;
          }

          .data-table tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          .data-table thead {
            display: table-header-group;
          }

          .data-table tfoot {
            display: table-footer-group;
          }

          .bus-group {
            page-break-inside: avoid;
          }

          /* Hide header and footer */
          header, footer {
            display: none !important;
          }

          /* Adjust margins for different pages */
          @page {
            size: A4 portrait;
            margin: 15mm 10mm;
          }

          @page :first {
            margin-top: 10mm;
          }

          /* Add top margin to content on pages after the first */
          .print-content {
            position: relative;
          }

          .print-content::after {
            content: '';
            display: block;
            height: 20mm;
          }

          .section-title {
            margin-top: 15mm;
          }

          .section-title:first-child {
            margin-top: 0;
          }

          /* Optimize page breaks */
          .driver-sheets,
          .bus-details {
            page-break-before: auto;
          }

          .bus-group {
            page-break-inside: avoid;
            page-break-before: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableDriverReport;