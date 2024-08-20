import React from 'react';

const NotebookBusDetails = ({ busData }) => {
  if (!Array.isArray(busData) || busData.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white text-center" style={{
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
        <h1 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Bus Details</h1>
        <p className="text-lg text-gray-600" style={{ fontFamily: 'Verdana, sans-serif' }}>No bus data available.</p>
      </div>
    );
  }

  // Group busData by bus name
  const groupedBusData = busData.reduce((acc, detail) => {
    if (typeof detail !== 'object' || detail === null || !detail.bus) {
      console.error('Invalid bus detail:', detail);
      return acc;
    }
    if (!acc[detail.bus]) {
      acc[detail.bus] = [];
    }
    acc[detail.bus].push(detail);
    return acc;
  }, {});

  if (Object.keys(groupedBusData).length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white text-center" style={{
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
        <h1 className="text-3xl font-bold text-black mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Bus Details</h1>
        <p className="text-lg text-gray-600" style={{ fontFamily: 'Verdana, sans-serif' }}>No valid bus data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white" style={{
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Arial, sans-serif' }}>Bus Details</h1>
      </div>
      {Object.entries(groupedBusData).map(([busName, details]) => (
        <div key={busName} className="mb-8 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600" style={{ fontFamily: 'Georgia, serif' }}>{busName}</h2>
          {details.map((detail, index) => (
            <div key={index} className="mb-4 pl-4" style={{ borderLeft: '2px solid #ff9999' }}>
              <p className="text-lg font-semibold text-black" style={{ fontFamily: 'Verdana, sans-serif' }}>
                {detail.from || 'Unknown'} → {detail.to || 'Unknown'}
              </p>
              <p className="text-sm text-black" style={{ fontFamily: 'Verdana, sans-serif' }}>
                {detail.fromMobile || 'N/A'} | {detail.toMobile || 'N/A'}
              </p>
              <p className="text-sm text-black" style={{ fontFamily: 'Verdana, sans-serif' }}>
                {detail.numberOfBoxes || '0'} boxes - {detail.paymentMode || 'N/A'} (₹{detail.amount || '0'})
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NotebookBusDetails;