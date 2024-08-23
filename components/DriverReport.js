import React, { useState } from 'react';

const DriverReport = ({ filteredData, selectedDriver, drivers, setSelectedDriver, rowCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Captain-wise Report</h3>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <select
          value={selectedDriver}
          onChange={(e) => {
            setSelectedDriver(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border rounded-lg text-gray-700 bg-white mb-3 sm:mb-0 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {drivers.map(driver => (
            <option key={driver} value={driver}>{driver}</option>
          ))}
        </select>
        {selectedDriver !== 'All' && (
          <div className="bg-indigo-100 text-indigo-800 px-5 py-3 rounded-lg shadow text-lg">
            <span className="font-semibold">{selectedDriver}</span>: {rowCount} {rowCount === 1 ? 'Day' : 'Days'}
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 text-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border text-left text-gray-800">Date</th>
              <th className="px-6 py-3 border text-left text-gray-800">Driver Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border text-gray-700">{item.date}</td>
                <td className="px-6 py-4 border text-gray-700">{item.driverName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
      <div className="mt-4 text-right text-sm text-gray-500">
        Showing {paginatedData.length} of {filteredData.length} entries
      </div>
    </div>
  );
};

export default DriverReport;