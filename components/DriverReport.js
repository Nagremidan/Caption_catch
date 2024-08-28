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
    <div className="lg:w-1/2 bg-gradient-to-br from-[#e6f3f7] to-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-3xl font-bold mb-6 text-[#1286A8] text-center">Captain-wise Report</h3>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <select
          value={selectedDriver}
          onChange={(e) => {
            setSelectedDriver(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border rounded-lg text-gray-700 bg-white mb-3 sm:mb-0 text-lg focus:outline-none focus:ring-2 focus:ring-[#1286A8]"
        >
          {drivers.map(driver => (
            <option key={driver} value={driver}>{driver}</option>
          ))}
        </select>
        {selectedDriver !== 'All' && (
          <div className="bg-[#e6f3f7] text-[#1286A8] px-5 py-3 rounded-lg shadow text-lg">
            <span className="font-semibold">{selectedDriver}</span>: {rowCount} {rowCount === 1 ? 'Day' : 'Days'}
          </div>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#1286A8] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-lg font-semibold uppercase tracking-wider">Driver Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr 
                key={item.id}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition-colors duration-300 hover:bg-[#e6f3f7]`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">{item.driverName}</td>
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
            className="px-4 py-2 border border-[#1286A8] rounded-md text-sm font-medium text-[#1286A8] bg-white hover:bg-[#e6f3f7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[#1286A8] rounded-md text-sm font-medium text-[#1286A8] bg-white hover:bg-[#e6f3f7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
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