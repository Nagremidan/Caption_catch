import React, { useState, useMemo } from 'react';

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const DieselReport = ({ filteredData, totalDiesel }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const entriesPerPage = 10;

  // Error Alert Component
  const ErrorAlert = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  // Filter Section Component
  const FilterSection = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
      <h4 className="text-lg font-medium text-gray-700 mb-3">Filter Options</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
        <DateInput label="End Date" value={endDate} onChange={setEndDate} />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleFilterReset}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  // Date Input Component
  const DateInput = ({ label, value, onChange }) => (
    <div>
      <label htmlFor={label.toLowerCase().replace(' ', '-')} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        id={label.toLowerCase().replace(' ', '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all duration-300"
      />
    </div>
  );

  // Report Table Component
  const ReportTable = ({ data, total }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-lg font-semibold text-gray-600 uppercase tracking-wider">Diesel Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 transition-colors duration-300 hover:bg-gray-100'}>
              <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{formatDate(item.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-md text-right text-gray-500">{formatCurrency(item.diesel)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">Total</td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-right text-gray-900">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="mt-4 flex justify-between items-center">
      <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </PaginationButton>
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </PaginationButton>
    </div>
  );

  // Pagination Button Component
  const PaginationButton = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
    >
      {children}
    </button>
  );

  // Apply date filters and sort data
  const sortedAndFilteredData = useMemo(() => {
    try {
      return filteredData
        .filter(item => {
          const itemDate = new Date(item.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          return (!start || itemDate >= start) && (!end || itemDate <= end);
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
      setError("Error processing data. Please check your input.");
      return [];
    }
  }, [filteredData, startDate, endDate]);

  // Calculate total diesel cost for filtered data
  const filteredTotalDiesel = useMemo(() => {
    try {
      return sortedAndFilteredData.reduce((sum, item) => {
        const diesel = Number(item.diesel);
        if (isNaN(diesel)) throw new Error("Invalid diesel value");
        return sum + diesel;
      }, 0);
    } catch (err) {
      setError("Error calculating total diesel cost. Please check your data.");
      return 0;
    }
  }, [sortedAndFilteredData]);

  // Pagination logic
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
    setError(null);
  };

  return (
    <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Date-wise Diesel Report</h3>
      
      {error && <ErrorAlert message={error} />}
      
      <FilterSection />

      <ReportTable data={paginatedData} total={filteredTotalDiesel} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <div className="mt-4 text-right text-sm text-gray-500">
        Showing {paginatedData.length} of {sortedAndFilteredData.length} entries
      </div>
    </div>
  );
};

export default DieselReport;