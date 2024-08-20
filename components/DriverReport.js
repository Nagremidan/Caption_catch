import React from 'react';

const DriverReport = ({ filteredData, selectedDriver, drivers, setSelectedDriver, rowCount, totalBoxes }) => (
  <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Captain-wise Report</h3>
    <div className="flex flex-wrap justify-between items-center mb-4">
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        className="p-2 border rounded text-gray-700 bg-white mb-2 sm:mb-0"
      >
        {drivers.map(driver => (
          <option key={driver} value={driver}>{driver}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {selectedDriver !== 'All' && (
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg shadow">
            <span className="font-semibold">{selectedDriver}</span>: {rowCount} {rowCount === 1 ? 'Day' : 'Days'}
          </div>
        )}
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow">
          Total Boxes: <span className="font-semibold">{totalBoxes}</span>
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left text-gray-700">Date</th>
            <th className="px-4 py-2 border text-left text-gray-700">Driver Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-gray-700">{item.date}</td>
              <td className="px-4 py-2 border text-gray-700">{item.driverName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DriverReport;