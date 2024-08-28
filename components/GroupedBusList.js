import React from 'react';

// Helper function to handle empty values
const getValueOrDefault = (value) => value || '-';

export default function BusList({ busData }) {
  // Group busData by location and calculate total box count
  const groupedBusData = busData.reduce((acc, bus) => {
    const location = bus.bus || bus.location || 'Unknown';
    if (!acc[location]) {
      acc[location] = { buses: [], totalBoxes: 0 };
    }
    acc[location].buses.push(bus);
    acc[location].totalBoxes += parseInt(bus.numberOfBoxes) || 0;
    return acc;
  }, {});

  // Sort locations alphabetically
  const sortedLocations = Object.keys(groupedBusData).sort();

  return (
    <div className="space-y-24">
      {sortedLocations.map((location) => (
        <div key={location} className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-[#0B374D]">{location}</h2>
            <div className="bg-[#D2B53B] text-white px-4 py-2 rounded-full font-bold text-xl">
              {groupedBusData[location].totalBoxes}
            </div>
          </div>
          {groupedBusData[location].buses.map((bus, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="text-white text-xl font-semibold p-4" style={{ backgroundColor: '#1286A8' }}>
                {getValueOrDefault(bus.bus || bus.location)}
              </h3>
              <div className="p-4 space-y-4 text-black">
                <InfoItem label="From" value={getValueOrDefault(bus.from)} mobileNumber={getValueOrDefault(bus.fromMobile)} />
                <InfoItem label="To" value={getValueOrDefault(bus.to)} mobileNumber={getValueOrDefault(bus.toMobile)} />
                <InfoItem label="Articles" value={getValueOrDefault(bus.numberOfBoxes)} />
                <InfoItem label="Payment" value={getValueOrDefault(bus.paymentMode)} />
                <InfoItem label="Amount" value={getValueOrDefault(bus.amount)} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function InfoItem({ label, value, mobileNumber }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}:</span>
      <span>
        {value}
        {mobileNumber && mobileNumber !== '-' && (
          <span className="ml-2 text-sm text-gray-500">({mobileNumber})</span>
        )}
      </span>
    </div>
  );
}