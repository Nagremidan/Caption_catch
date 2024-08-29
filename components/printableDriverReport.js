'use client'
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { Share, X } from 'lucide-react';

const ShareButton = ({ containerRef }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const captureAndShare = async () => {
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      const image = canvas.toDataURL('image/jpeg', 1.0);
      setImageUrl(image);
      setShowPreview(true);
    }
  };

  const shareViaWhatsApp = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'report.jpg', { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cbe Cargo Report',
          text: 'Check out this report!',
        });
      } else {
        // Fallback for browsers that don't support file sharing
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this report!')}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to just opening WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this report!')}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      <Button onClick={captureAndShare} className="share-button">
        <Share className="w-4 h-4 mr-2" /> Share
      </Button>
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <Button onClick={() => setShowPreview(false)} className="close-button">
              <X className="w-4 h-4" />
            </Button>
            <img src={imageUrl} alt="Report Preview" className="preview-image" />
            <Button onClick={shareViaWhatsApp} className="whatsapp-share-button">
              Share via WhatsApp
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const PrintableDriverReport = () => {
  const [busDetails, setBusDetails] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportContainerRef = useRef(null);

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

      if (driverSheetsData.length === 0) {
        setError("No driver data available.");
      }
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
    return Object.entries(grouped)
      .sort((a, b) => {
        if (a[0] === 'tmy') return 1;
        if (b[0] === 'tmy') return -1;
        return b[1].length - a[1].length;
      });
  };

  const groupedBuses = sortedGroupedBuses();

  const calculateTotalBoxes = () => {
    return busDetails.reduce((sum, bus) => sum + parseInt(bus.numberOfBoxes || 0), 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading">Loading report data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  if (busDetails.length === 0 && driverData.length === 0) {
    return (
      <div className="report-container">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  const totalBoxes = calculateTotalBoxes();

  return (
    <div className="report-container" ref={reportContainerRef}>
      <h1 className="page-title">Cbe Cargo</h1>
      <div className="driver-data">
        {driverData.map((driver, index) => (
          <div key={index} className="driver-item">
            <p>{formatDate(driver.date)} | {driver.driverName} | Diesel: {driver.diesel} | Total: {totalBoxes} | Start: {driver.vehicleStartTime}</p>
          </div>
        ))}
      </div>
      <div className="bus-wise-totals">
        {groupedBuses.map(([busName, buses]) => {
          const boxCount = buses.reduce((sum, bus) => sum + parseInt(bus.numberOfBoxes || 0), 0);
          return (
            <div key={busName} className="bus-total-item">
              <span className="bus-name">{busName}:</span>
              <span className="box-count">{boxCount}</span>
            </div>
          );
        })}
      </div>
      <div className="print-content">
        {groupedBuses.map(([busName, buses]) => {
          const boxCount = buses.reduce((sum, bus) => sum + parseInt(bus.numberOfBoxes || 0), 0);
          return (
            <div key={busName} className="bus-group">
              <div className="bus-title-container">
                <h2 className="bus-title">{busName}</h2>
                {boxCount > 0 && <span className="box-count">{boxCount} {boxCount === 1 ? 'Box' : 'Boxes'}</span>}
              </div>
              <div className="bus-details">
                {buses.map((bus, index) => (
                  <div key={index} className="bus-item">
                    <p>
                      {bus.from} TO {bus.to} - {bus.numberOfBoxes} {bus.paymentMode} {bus.amount}
                    </p>
                    <p className="mobile-numbers">
                      {bus.fromMobile && bus.toMobile ? `${bus.fromMobile} || ${bus.toMobile}` : bus.fromMobile || bus.toMobile}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <Button onClick={handlePrint} className="print-button">
          Print Report
        </Button>
        <ShareButton containerRef={reportContainerRef} />
      </div>

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
          min-height: 100vh;
          display: flex;
          flex-direction: column;
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

        .bus-wise-totals {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
          justify-content: flex-start;
        }

        .bus-total-item {
          background-color: #e8f4fd;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .bus-name {
          font-weight: 600;
          margin-right: 5px;
        }

        .print-content {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          flex-grow: 1;
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

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .print-button, .share-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .preview-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
          overflow: auto;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .preview-image {
          max-width: 100%;
          height: auto;
        }

        .whatsapp-share-button {
          margin-top: 10px;
          width: 100%;
        }

        .loading, .error-container, .no-data {
          text-align: center;
          padding: 20px;
          font-size: 1.125rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
        }

        .error-container {
          background-color: #000;
          color: #fff;
          border-radius: 8px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px;
          max-width: 80%;
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
            margin: 2mm 5mm 5mm 5mm;
          }

          body {
            font-size: 10pt;
            line-height: 1.3;
          }

          .report-container {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .page-title {
            font-size: 16pt;
            margin-bottom: 3mm;
          }

          .driver-data {
            margin-bottom: 3mm;
          }

          .driver-item {
            font-size: 10pt;
            padding: 2px;
          }

          .bus-wise-totals {
            display: flex;
            flex-wrap: wrap;
            gap: 2mm;
            margin-bottom: 3mm;
            page-break-inside: avoid;
            width: 100%;
          }

          .bus-total-item {
            font-size: 10pt;
            padding: 2px 5px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .bus-name {
            font-weight: 600;
          }

          .box-count {
            font-size: 10pt;
          }

          .print-content {
            display: block;
            column-count: 2;
            column-gap: 5mm;
            column-rule: 1px solid #ddd;
          }

          .bus-group {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 5mm;
            box-shadow: none;
          }

          .bus-title-container {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2mm;
          }

          .bus-title {
            font-size: 12pt;
          }

          .bus-details {
            font-size: 9pt;
          }

          .bus-item {
            margin-bottom: 1.5mm;
          }

          .mobile-numbers {
            font-size: 8pt;
          }

          .print-button {
            display: none !important;
          }

          header, footer {
            display: none !important;
          }

          .error-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableDriverReport;