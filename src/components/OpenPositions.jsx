// src/components/OpenPositions.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

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

  return (
    <div className="container mx-auto py-8">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Open Positions</h1>
          <button
            className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
            aria-label="add trade"
            onClick={openModal}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <div>
            <div className="flex items-center gap-2">
              <span>Load:</span>
              <select 
                className="h-10 rounded-full min-w-[100px] bg-white border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTradeBook}
                onChange={(e) => setSelectedTradeBook(e.target.value)}
              >
                <option value="">--</option>
                {/* Add options dynamically when available */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center justify-between py-4 mb-4 border-b gap-4">
        <div className="flex items-center gap-4">
          <input
            className="max-w-[200px] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search symbol..."
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
          />

          <div className="flex gap-2 items-center">
            <label className="font-semibold whitespace-nowrap">Initial Total Capital:</label>
            <input
              className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border border-slate-200 rounded-md px-3 py-2"
              placeholder="Enter portfolio"
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              style={{ width: '120px', borderRadius: '6px', borderWidth: '2px', borderColor: '#E2E8F0', padding: '8px 12px' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('symbol')}>
                    <div className="flex items-center gap-2">
                      <span>
                        <div className="text-center font-bold">
                          <div>Symbol</div>
                        </div>
                      </span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('positionSize')}>
                    <div className="flex items-center gap-2">
                      <span>
                        <div className="text-center font-bold">
                          <div>Position Sizing</div>
                          <div>%</div>
                        </div>
                      </span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('daysHeld')}>
                    <div className="flex items-center gap-2">
                      <span>Days Held</span>
                      <span className="inline-flex">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`h-4 w-4 transition-transform ${sortField === 'daysHeld' && sortDirection === 'asc' ? 'text-blue-600 rotate-180' : 'text-gray-500'} ${sortField === 'daysHeld' && sortDirection === 'desc' ? 'text-blue-600' : ''}`}
                          aria-hidden="true"
                        >
                          <path d="M12 5v14"></path>
                          <path d="m19 12-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('sl')}>
                    <div className="flex items-center gap-2">
                      <span>SL(%)</span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('openRisk')}>
                    <div className="flex items-center gap-2">
                      <span>
                        <div className="text-center font-bold">
                          <div>Open Risk</div>
                          <div>%</div>
                        </div>
                      </span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('unrealizedPL')}>
                    <div className="flex items-center gap-2">
                      <span>
                        <div className="text-center font-bold">
                          <div>Unrealized P/L</div>
                          <div>%(₹)</div>
                        </div>
                      </span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('rMultiples')}>
                    <div className="flex items-center gap-2">
                      <span>R Multiples Achieved</span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort('portfolioGain')}>
                    <div className="flex items-center gap-2">
                      <span>
                        <div className="text-center font-bold">
                          <div>Unrealized Portfolio Gain</div>
                          <div>%</div>
                        </div>
                      </span>
                      <span className="inline-flex">
                        <span className="h-4 w-4 text-gray-300 flex items-center justify-center">•</span>
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      <span></span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.length > 0 ? (
                  positions.map((position, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{position.symbol}</td>
                      <td className="px-4 py-3">{position.positionSize}%</td>
                      <td className="px-4 py-3">{position.daysHeld}</td>
                      <td className="px-4 py-3">{position.sl}%</td>
                      <td className="px-4 py-3">{position.openRisk}%</td>
                      <td className="px-4 py-3">{position.unrealizedPL}%</td>
                      <td className="px-4 py-3">{position.rMultiples}</td>
                      <td className="px-4 py-3">{position.portfolioGain}%</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="h-24 text-center text-sm text-gray-500">No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-center py-4 px-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center h-8 rounded-md text-xs px-2 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            aria-label="Previous page"
            style={{ boxShadow: 'none' }}
          >
            <ChevronLeft className="h-5 w-5" style={{ color: 'rgb(15, 198, 146)' }} />
          </button>
          
          <div className="text-center text-sm font-medium mx-2">
            Showing <span className="font-bold">{totalItems > 0 ? startItem : 1}</span> - <span className="font-bold">{endItem}</span> of <span className="font-bold">{totalItems}</span>
          </div>
          
          <button
            onClick={nextPage}
            disabled={endItem >= totalItems}
            className={`flex items-center justify-center h-8 rounded-md text-xs px-2 ${
              endItem >= totalItems ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            aria-label="Next page"
            style={{ boxShadow: 'none' }}
          >
            <ChevronRight className="h-5 w-5" style={{ color: 'rgb(15, 198, 146)' }} />
          </button>
        </div>
      </div>

      {/* Modal - Updated to match ManageTrades modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Trade Book</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter a name for the new trade book:
                </label>
                <input
                  type="text"
                  placeholder="Enter trade book name"
                  value={newTradeBookName}
                  onChange={(e) => setNewTradeBookName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter initial total capital (portfolio value + cash)
                </label>
                <input
                  type="number"
                  placeholder="Initial Total Capital"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            
            <div className="mt-6 flex justify-end space-x-3">
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

export default OpenPositions;