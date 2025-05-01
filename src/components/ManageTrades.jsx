import React, { useState } from 'react';

const ManageTrades = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [slPercentage, setSlPercentage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartDateFocused, setIsStartDateFocused] = useState(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTradeBookName, setNewTradeBookName] = useState('');
  const [initialCapital, setInitialCapital] = useState('');
  const [includeOpenPositions, setIncludeOpenPositions] = useState(false);

  // Table sorting state
  const [sortField, setSortField] = useState('exit');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Sample data (empty for now)
  const [trades, setTrades] = useState([]);

  const incrementSL = () => {
    setSlPercentage(prev => parseFloat((prev + 0.5).toFixed(1)));
  };

  const decrementSL = () => {
    if (slPercentage > 0.5) {
      setSlPercentage(prev => parseFloat((prev - 0.5).toFixed(1)));
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTradeBookName('');
    setInitialCapital('');
    setIncludeOpenPositions(false);
  };

  const handleSave = () => {
    console.log({
      name: newTradeBookName,
      initialCapital: initialCapital,
      includeOpenPositions: includeOpenPositions
    });
    closeModal();
  };

  // Handle column sorting
  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate pagination info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-6 w-full bg-gray-100">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Trades</h2>
        <button
          onClick={openModal}
          className="ml-3 text-white flex items-center justify-center rounded-full w-8 h-8 hover:bg-blue-600 transition-colors duration-200 ease-in-out"
          style={{ backgroundColor: "rgb(96,98,255)" }}
          aria-label="Add new trade book"
        >
          <span className="text-lg font-semibold leading-none">+</span>
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-6">
        {/* Search by symbol */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Search by symbol:</label>
          <input
            type="text"
            placeholder="Enter symbol..."
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="border px-4 py-2 rounded-md w-60 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200"
          />
        </div>

        {/* Sell Date Range */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Sell Date Range:</label>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={() => setIsStartDateFocused(true)}
                onBlur={() => setIsStartDateFocused(false)}
                className={`
                  border px-3 py-2 rounded-md text-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500
                  ${isStartDateFocused ? 'bg-cyan-50 border-cyan-400' : ''}
                  transition duration-200
                `}
                onClick={(e) => e.target.showPicker()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <span className="self-center text-gray-500 font-medium">to</span>

            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={() => setIsEndDateFocused(true)}
                onBlur={() => setIsEndDateFocused(false)}
                className={`
                  border px-3 py-2 rounded-md text-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500
                  ${isEndDateFocused ? 'bg-cyan-50 border-cyan-400' : ''}
                  transition duration-200
                `}
                onClick={(e) => e.target.showPicker()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* SL % */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">SL (%):</label>
          <div className="flex">
            <button
              onClick={decrementSL}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l-md border border-r-0 hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={slPercentage}
              onChange={(e) => setSlPercentage(parseFloat(e.target.value))}
              step="0.5"
              className="border border-gray-300 py-2 px-3 w-20 text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200"
            />
            <button
              onClick={incrementSL}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md border border-l-0 hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Load dropdown */}
        <div className="ml-auto">
          <label className="block mb-2 text-sm font-medium text-gray-700">Load:</label>
          <select className="border px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200">
            <option value="">--</option>
          </select>
        </div>
      </div>

      {/* Enhanced Table with hover effects and sortable columns */}
      <div className="border rounded-lg bg-white shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('symbol')}>
                Symbol
              </th>
              <th className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold text-center" onClick={() => handleSort('entry')}>
                <div>Entry</div>
                <span className="font-normal text-gray-600">Qty <span className="mx-1 text-gray-400">|</span> Price <span className="mx-1 text-gray-400">|</span> Date/Time</span>
              </th>
              <th className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer group relative font-semibold text-center" onClick={() => handleSort('exit')}>
                <div>Exit</div>
                <div className="flex items-center justify-center">
                  <span className="font-normal text-gray-600">Qty <span className="mx-1 text-gray-400">|</span> Price <span className="mx-1 text-gray-400">|</span> Date/Time</span>
                  <div className="ml-1">
                    <svg
                      className={`w-4 h-4 transition-transform ${sortField === 'exit' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'} ${sortField === 'exit' && sortDirection === 'desc' ? 'rotate-180 text-blue-600' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('pl')}>
                P/L % (₹)
              </th>
              <th className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('potential')}>
                Potential P/L (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
              trades.map((trade, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{trade.symbol}</td>
                  <td className="px-4 py-3">{trade.entry}</td>
                  <td className="px-4 py-3">{trade.exit}</td>
                  <td className="px-4 py-3">{trade.pl}</td>
                  <td className="px-4 py-3">{trade.potential}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="5" className="py-8 text-gray-500">No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Functional pagination */}
      <div className="mt-4 flex justify-center text-sm text-gray-600 items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="mx-6 font-medium">
          Showing {totalItems > 0 ? startItem : 0} - {endItem} of {totalItems}
        </span>
        <button
          onClick={nextPage}
          disabled={endItem >= totalItems}
          className={`px-3 py-2 rounded-md ${endItem >= totalItems ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Trade Book</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a name for the new trade book:
                </label>
                <input
                  type="text"
                  placeholder="Enter trade book name"
                  value={newTradeBookName}
                  onChange={(e) => setNewTradeBookName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter initial total capital (portfolio value + cash)
                </label>
                <input
                  type="number"
                  placeholder="Initial Total Capital"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Initial Total Capital will affect portfolio level P&L. If unknown, set 0.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="openPositions"
                  checked={includeOpenPositions}
                  onChange={(e) => setIncludeOpenPositions(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="openPositions" className="ml-2 block text-sm text-gray-700">
                  Open Positions
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrades;