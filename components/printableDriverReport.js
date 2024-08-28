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

  const sortedGroupedBuses = () => {
    const grouped = groupBusesByName();
    return Object.entries(grouped).sort((a, b) => a[1].length - b[1].length);
  };

  const groupedBuses = sortedGroupedBuses();

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
            <div className="table-responsive">
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
                      <td data-label="Date">{driver.date}</td>
                      <td data-label="Driver Name">{driver.driverName}</td>
                      <td data-label="Diesel">{driver.diesel}</td>
                      <td data-label="Total">{driver.total}</td>
                      <td data-label="Vehicle Start Time">{driver.vehicleStartTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No driver data available.</p>
          )}
        </section>

        <section className="bus-details">
          <h2 className="section-title">Bus Details</h2>
          {groupedBuses.length > 0 ? (
            groupedBuses.map(([busName, buses]) => (
              <div key={busName} className="bus-group">
                <h3 className="bus-title">{busName}</h3>
                <div className="table-responsive">
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
                          <td data-label="From">{bus.from}</td>
                          <td data-label="From Mobile">{bus.fromMobile}</td>
                          <td data-label="To">{bus.to}</td>
                          <td data-label="To Mobile">{bus.toMobile}</td>
                          <td data-label="Boxes">{bus.numberOfBoxes}</td>
                          <td data-label="Payment Mode">{bus.paymentMode}</td>
                          <td data-label="Amount">{bus.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
        }

        .print-content {
          font-size: 14px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .bus-title {
          font-size: 20px;
          font-weight: 500;
          margin-top: 30px;
          margin-bottom: 15px;
        }

        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .data-table th,
        .data-table td {
          border: 1px solid #ddd;
          padding: 12px;
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

        @media screen and (max-width: 768px) {
          .report-container {
            padding: 10px;
          }

          .section-title {
            font-size: 20px;
          }

          .bus-title {
            font-size: 18px;
          }

          .data-table {
            border: 0;
          }

          .data-table thead {
            display: none;
          }

          .data-table tr {
            margin-bottom: 20px;
            display: block;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          }

          .data-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 10px;
            border-bottom: 1px solid #eee;
          }

          .data-table td:last-child {
            border-bottom: 0;
          }

          .data-table td::before {
            content: attr(data-label);
            font-weight: bold;
            text-transform: uppercase;
            flex-basis: 50%;
            text-align: left;
          }
        }

        @media print {
          body {
            background: white;
            font-size: 10pt;
            line-height: 1.3;
          }

          .report-container {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .print-content {
            padding: 0;
          }

          .print-button,
          .error-container {
            display: none !important;
          }

          .section-title {
            font-size: 14pt;
            margin: 10pt 0 5pt 0;
          }

          .bus-title {
            font-size: 12pt;
            margin: 5pt 0 2pt 0;
          }

          .data-table {
            page-break-inside: auto;
            margin-bottom: 5pt;
          }

          .data-table th,
          .data-table td {
            padding: 3pt;
            font-size: 9pt;
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
            margin-bottom: 5pt;
          }

          header, footer {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm 5mm;
          }

          .driver-sheets,
          .bus-details {
            page-break-before: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableDriverReport;