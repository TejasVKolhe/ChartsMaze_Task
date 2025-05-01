// src/components/OpenPositions.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';

const OpenPositions = () => {
  // State for search and filters
  const [searchSymbol, setSearchSymbol] = useState('');
  const [initialCapital, setInitialCapital] = useState('');
  const [selectedTradeBook, setSelectedTradeBook] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTradeBookName, setNewTradeBookName] = useState('');
  const [includeOpenPositions, setIncludeOpenPositions] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState('daysHeld');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Sample data (empty for now)
  const [positions, setPositions] = useState([]);

  // Handle column sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
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

  // Modal functions
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

  // Calculate pagination info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">•</span>;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp size={16} className="text-gray-700" /> : 
      <ArrowDown size={16} className="text-gray-700" />;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with improved spacing and alignment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Open Positions</h2>
          <button
            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-sm"
            aria-label="Add new trade"
            onClick={openModal}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Load:</span>
          <select 
            className="rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[180px]"
            value={selectedTradeBook}
            onChange={(e) => setSelectedTradeBook(e.target.value)}
          >
            <option value="">Select Trade Book</option>
            {/* Add options dynamically when available */}
          </select>
        </div>
      </div>

      {/* Search and filters with improved layout */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm"
              placeholder="Search symbol..."
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 whitespace-nowrap">Initial Total Capital:</label>
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm w-36"
              placeholder="Enter amount"
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table with improved styling */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {/* Symbol column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-2">
                    <span>Symbol</span>
                    <SortIndicator field="symbol" />
                  </div>
                </th>
                
                {/* Position Size column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('positionSize')}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <div>Position Sizing</div>
                      <div className="text-xs text-gray-500">%</div>
                    </div>
                    <SortIndicator field="positionSize" />
                  </div>
                </th>
                
                {/* Days Held column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('daysHeld')}
                >
                  <div className="flex items-center gap-2">
                    <span>Days Held</span>
                    <SortIndicator field="daysHeld" />
                  </div>
                </th>
                
                {/* SL column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('sl')}
                >
                  <div className="flex items-center gap-2">
                    <span>SL(%)</span>
                    <SortIndicator field="sl" />
                  </div>
                </th>
                
                {/* Open Risk column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('openRisk')}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <div>Open Risk</div>
                      <div className="text-xs text-gray-500">%</div>
                    </div>
                    <SortIndicator field="openRisk" />
                  </div>
                </th>
                
                {/* Unrealized P/L column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('unrealizedPL')}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <div>Unrealized P/L</div>
                      <div className="text-xs text-gray-500">%(₹)</div>
                    </div>
                    <SortIndicator field="unrealizedPL" />
                  </div>
                </th>
                
                {/* R Multiples column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('rMultiples')}
                >
                  <div className="flex items-center gap-2">
                    <span>R Multiples</span>
                    <SortIndicator field="rMultiples" />
                  </div>
                </th>
                
                {/* Portfolio Gain column */}
                <th 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('portfolioGain')}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <div>Portfolio Gain</div>
                      <div className="text-xs text-gray-500">%</div>
                    </div>
                    <SortIndicator field="portfolioGain" />
                  </div>
                </th>
                
                {/* Actions column */}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map((position, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{position.symbol}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.positionSize}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.daysHeld}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.sl}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.openRisk}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.unrealizedPL}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.rMultiples}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{position.portfolioGain}%</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Filter size={24} className="text-gray-400 mb-2" />
                      <p>No positions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Improved pagination */}
        <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            {totalItems > 0 ? (
              <span>Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> positions</span>
            ) : (
              <span>No positions</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center h-8 w-8 rounded-md ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-gray-700 font-medium">{currentPage}</span>
            
            <button
              onClick={nextPage}
              disabled={endItem >= totalItems}
              className={`flex items-center justify-center h-8 w-8 rounded-md ${
                endItem >= totalItems ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Improved modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Trade Book</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trade Book Name
                </label>
                <input
                  type="text"
                  placeholder="Enter trade book name"
                  value={newTradeBookName}
                  onChange={(e) => setNewTradeBookName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Total Capital
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Initial Total Capital will affect portfolio level P&L calculations. Set to 0 if unknown.
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
                <label htmlFor="openPositions" className="ml-2 text-sm text-gray-700">
                  Include Open Positions
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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

export default OpenPositions;