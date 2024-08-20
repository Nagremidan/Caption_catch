import React from 'react';

export default function BusList({ busData }) {
  // Group busData by location
  const groupedBusData = busData.reduce((acc, bus) => {
    const location = bus.bus || bus.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(bus);
    return acc;
  }, {});

  // Sort locations alphabetically
  const sortedLocations = Object.keys(groupedBusData).sort();

  return (
    <div className="space-y-12">
      {sortedLocations.map((location) => (
        <div key={location} className="space-y-8">
          <h2 className="text-2xl font-bold text-indigo-600">{location}</h2>
          {groupedBusData[location].map((bus, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="bg-indigo-600 text-white text-xl font-semibold p-4">{bus.bus || bus.location}</h3>
              <div className="p-4 space-y-4 text-black">
                <InfoItem label="From" value={bus.from} mobileNumber={bus.fromMobile} />
                <InfoItem label="To" value={bus.to} mobileNumber={bus.toMobile} />
                <InfoItem label="Articles" value={bus.numberOfBoxes} />
                <InfoItem label="Payment" value={bus.paymentMode} />
                <InfoItem label="Amount" value={bus.amount} />
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
        {mobileNumber && <span className="ml-2 text-sm text-gray-500">({mobileNumber})</span>}
      </span>
    </div>
  );
}