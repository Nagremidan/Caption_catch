import React from 'react';

const DieselReport = ({ filteredData, totalDiesel }) => (
  <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Date-wise Diesel Report</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left text-gray-700">Date</th>
            <th className="px-4 py-2 border text-left text-gray-700">Diesel (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-gray-700">{item.date}</td>
              <td className="px-4 py-2 border text-gray-700">{item.diesel}</td>
            </tr>
          ))}
          <tr className="bg-gray-200 font-semibold">
            <td className="px-4 py-2 border text-gray-800">Total</td>
            <td className="px-4 py-2 border text-gray-800">₹{totalDiesel.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default DieselReport;