import React, { useState, useMemo } from 'react';

const DieselReport = ({ filteredData, totalDiesel }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will return the date in YYYY-MM-DD format
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const sortedAndFilteredData = useMemo(() => {
    return filteredData
      .filter(item => {
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredData, startDate, endDate]);

  const filteredTotalDiesel = useMemo(() => {
    return sortedAndFilteredData.reduce((sum, item) => sum + Number(item.diesel), 0);
  }, [sortedAndFilteredData]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / entriesPerPage);
  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterReset = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Date-wise Diesel Report</h3>
      
      {/* Improved Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Filter Options</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFilterReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Diesel Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatCurrency(item.diesel)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(filteredTotalDiesel)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls */}
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
        Showing {paginatedData.length} of {sortedAndFilteredData.length} entries
      </div>
    </div>
  );
};

export default DieselReport;