import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, ChevronDown } from 'lucide-react';

const ManageTrades = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [slPercentage, setSlPercentage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTradeBookName, setNewTradeBookName] = useState('');
  const [initialCapital, setInitialCapital] = useState('');
  const [includeOpenPositions, setIncludeOpenPositions] = useState(false);
  const [tradeBooks, setTradeBooks] = useState(['Personal Portfolio', 'Swing Trading', 'Day Trading']);
  const [activeTradeBook, setActiveTradeBook] = useState('');

  const [isMobile, setIsMobile] = useState(false);

  // Check window size on mount and resize
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calendar state
  const today = new Date();
  const [startMonth, setStartMonth] = useState(today.getMonth());
  const [startYear, setStartYear] = useState(today.getFullYear());
  const [endMonth, setEndMonth] = useState(today.getMonth());
  const [endYear, setEndYear] = useState(today.getFullYear());

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Generate days for calendar
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    return days;
  };

  // Move calendar month
  const changeMonth = (side, direction) => {
    if (side === 'start') {
      if (direction === 'prev') {
        if (startMonth === 0) {
          setStartMonth(11);
          setStartYear(startYear - 1);
        } else {
          setStartMonth(startMonth - 1);
        }
      } else {
        if (startMonth === 11) {
          setStartMonth(0);
          setStartYear(startYear + 1);
        } else {
          setStartMonth(startMonth + 1);
        }
      }
    } else {
      if (direction === 'prev') {
        if (endMonth === 0) {
          setEndMonth(11);
          setEndYear(endYear - 1);
        } else {
          setEndMonth(endMonth - 1);
        }
      } else {
        if (endMonth === 11) {
          setEndMonth(0);
          setEndYear(endYear + 1);
        } else {
          setEndMonth(endMonth + 1);
        }
      }
    }
  };

  // Get month name
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Handle date selection
  const handleDateSelect = (side, day) => {
    const date = new Date(side === 'start' ? startYear : endYear, side === 'start' ? startMonth : endMonth, day);
    if (side === 'start') {
      setStartDate(formatDate(date));
    } else {
      setEndDate(formatDate(date));
    }
  };

  // Preset date ranges
  const setDateRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'today':
        start = end = new Date();
        break;
      case 'yesterday':
        start = end = new Date();
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'last7days':
        end = new Date();
        start = new Date();
        start.setDate(start.getDate() - 6);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  // Is date selected function to highlight selected dates
  const isDateSelected = (side, day) => {
    if (!day) return false;

    const checkDate = new Date(
      side === 'start' ? startYear : endYear,
      side === 'start' ? startMonth : endMonth,
      day
    ).toISOString().split('T')[0];

    // Check if date is the selected start or end date
    if (side === 'start' && checkDate === startDate) return true;
    if (side === 'end' && checkDate === endDate) return true;

    // Check if date is in the selected range
    if (startDate && endDate) {
      return checkDate >= startDate && checkDate <= endDate;
    }

    return false;
  };

  // Check if a date is today
  const isToday = (side, day) => {
    if (!day) return false;
    const today = new Date();
    const checkDate = new Date(
      side === 'start' ? startYear : endYear,
      side === 'start' ? startMonth : endMonth,
      day
    );
    return today.getDate() === day &&
      today.getMonth() === (side === 'start' ? startMonth : endMonth) &&
      today.getFullYear() === (side === 'start' ? startYear : endYear);
  };

  // Table sorting state
  const [sortField, setSortField] = useState('exit');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(25);

  // Sample data
  const [trades, setTrades] = useState([
    {
      symbol: 'RELIANCE',
      entry: '50 @ ₹2,420.00 | 2023-09-15',
      exit: '50 @ ₹2,580.00 | 2023-11-22',
      pl: '+6.61% (₹8,000.00)',
      potential: '₹9,200.00'
    },
    {
      symbol: 'TCS',
      entry: '20 @ ₹3,260.00 | 2023-10-05',
      exit: '20 @ ₹3,500.00 | 2023-12-10',
      pl: '+7.36% (₹4,800.00)',
      potential: '₹6,000.00'
    },
    {
      symbol: 'INFY',
      entry: '40 @ ₹1,400.00 | 2023-09-20',
      exit: '40 @ ₹1,525.00 | 2023-12-01',
      pl: '+8.93% (₹5,000.00)',
      potential: '₹5,600.00'
    },
    {
      symbol: 'HDFCBANK',
      entry: '35 @ ₹1,520.00 | 2023-10-12',
      exit: '35 @ ₹1,640.00 | 2023-12-15',
      pl: '+7.89% (₹4,200.00)',
      potential: '₹4,800.00'
    },
    {
      symbol: 'ITC',
      entry: '100 @ ₹450.00 | 2023-09-08',
      exit: '100 @ ₹420.00 | 2023-11-30',
      pl: '-6.67% (₹-3,000.00)',
      potential: '₹5,000.00'
    },
    {
      symbol: 'LT',
      entry: '25 @ ₹2,800.00 | 2023-10-03',
      exit: '25 @ ₹3,100.00 | 2023-12-18',
      pl: '+10.71% (₹7,500.00)',
      potential: '₹8,000.00'
    },
    {
      symbol: 'BAJFINANCE',
      entry: '10 @ ₹7,000.00 | 2023-09-25',
      exit: '10 @ ₹7,750.00 | 2023-12-05',
      pl: '+10.71% (₹7,500.00)',
      potential: '₹8,500.00'
    },
    {
      symbol: 'HCLTECH',
      entry: '30 @ ₹1,180.00 | 2023-10-20',
      exit: '30 @ ₹1,320.00 | 2023-12-20',
      pl: '+11.86% (₹4,200.00)',
      potential: '₹4,800.00'
    }
  ]);




  useEffect(() => {
    const dummyTrades = [
      {
        symbol: 'RELIANCE',
        entry: '50 @ ₹2,420.00 | 2023-09-15',
        exit: '50 @ ₹2,580.00 | 2023-11-22',
        pl: '+6.61% (₹8,000.00)',
        potential: '₹9,200.00'
      },
      {
        symbol: 'TCS',
        entry: '20 @ ₹3,260.00 | 2023-10-05',
        exit: '20 @ ₹3,500.00 | 2023-12-10',
        pl: '+7.36% (₹4,800.00)',
        potential: '₹6,000.00'
      },
      {
        symbol: 'INFY',
        entry: '40 @ ₹1,400.00 | 2023-09-20',
        exit: '40 @ ₹1,525.00 | 2023-12-01',
        pl: '+8.93% (₹5,000.00)',
        potential: '₹5,600.00'
      },
      {
        symbol: 'HDFCBANK',
        entry: '35 @ ₹1,520.00 | 2023-10-12',
        exit: '35 @ ₹1,640.00 | 2023-12-15',
        pl: '+7.89% (₹4,200.00)',
        potential: '₹4,800.00'
      },
      {
        symbol: 'ITC',
        entry: '100 @ ₹450.00 | 2023-09-08',
        exit: '100 @ ₹420.00 | 2023-11-30',
        pl: '-6.67% (₹-3,000.00)',
        potential: '₹5,000.00'
      },
      {
        symbol: 'LT',
        entry: '25 @ ₹2,800.00 | 2023-10-03',
        exit: '25 @ ₹3,100.00 | 2023-12-18',
        pl: '+10.71% (₹7,500.00)',
        potential: '₹8,000.00'
      },
      {
        symbol: 'BAJFINANCE',
        entry: '10 @ ₹7,000.00 | 2023-09-25',
        exit: '10 @ ₹7,750.00 | 2023-12-05',
        pl: '+10.71% (₹7,500.00)',
        potential: '₹8,500.00'
      },
      {
        symbol: 'HCLTECH',
        entry: '30 @ ₹1,180.00 | 2023-10-20',
        exit: '30 @ ₹1,320.00 | 2023-12-20',
        pl: '+11.86% (₹4,200.00)',
        potential: '₹4,800.00'
      }
    ];

    if (searchSymbol) {
      const filtered = dummyTrades.filter(trade =>
        trade.symbol.toLowerCase().includes(searchSymbol.toLowerCase())
      );
      setTrades(filtered);
      setTotalItems(filtered.length);
    } else {
      setTrades(dummyTrades);
      setTotalItems(dummyTrades.length);
    }
  }, [searchSymbol]);

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
    if (newTradeBookName.trim()) {
      setTradeBooks([...tradeBooks, newTradeBookName]);
      setActiveTradeBook(newTradeBookName);

      // Show success toast (you could add a toast library for better UX)
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in';
      toast.textContent = `Trade book "${newTradeBookName}" created successfully!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
    closeModal();
  };

  // Handle column sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Add subtle animation to indicate sort action
    const thElement = document.querySelector(`th[data-sort="${field}"]`);
    if (thElement) {
      thElement.classList.add('bg-gray-300');
      setTimeout(() => {
        thElement.classList.remove('bg-gray-300');
      }, 300);
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
        <h2 className="text-2xl font-bold text-gray-800">Manage Trades</h2>
        <button
          className="p-2 mx-4 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-sm"
          aria-label="Add new trade"
          onClick={openModal}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-6">
        {/* Search by symbol with autocomplete effect */}
        <div className="flex flex-col">
          {/* <label className="mb-2 text-sm font-medium text-gray-700">Search by symbol:</label> */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by symbol ..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="border pl-10 pr-4 py-2 rounded-md w-60 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            {searchSymbol && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setSearchSymbol('')}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-black">Select Date Range:</label>
          <div className="relative w-full">
            <div
              className="border px-3 py-2 rounded-md text-black flex items-center gap-2 cursor-pointer hover:bg-gray-50 w-full md:w-64"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              <span>
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                  : "Select Date Range"}
              </span>
              <ChevronDown
                className={`ml-auto w-5 h-5 text-gray-600 transition-transform duration-200 ${isDatePickerOpen ? 'transform rotate-180' : ''}`}
              />
            </div>

            {/* Date picker dropdown */}
            {isDatePickerOpen && (
              <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg w-full md:w-[640px] p-4 animate-fade-in">
                <div className={`${isMobile ? 'flex flex-col' : 'flex'} gap-4`}>
                  {/* Start date calendar */}
                  <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
                    <p className="text-sm font-medium text-black mb-2">Start Date</p>
                    <div className="border rounded-md p-3">
                      {/* Calendar header */}
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => changeMonth('start', 'prev')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="flex items-center gap-1">
                          <select
                            value={monthNames[startMonth]}
                            onChange={(e) => setStartMonth(monthNames.indexOf(e.target.value))}
                            className="text-gray-700 font-medium bg-transparent focus:outline-none"
                          >
                            {monthNames.map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                          <select
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value))}
                            className="text-gray-700 font-medium bg-transparent focus:outline-none"
                          >
                            {Array.from({ length: 10 }, (_, i) => startYear - 5 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => changeMonth('start', 'next')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Days of week */}
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-xs text-center text-gray-500 font-medium">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(startYear, startMonth).map((dateObj, idx) => (
                          <div
                            key={`start-${idx}`}
                            onClick={() => dateObj.isCurrentMonth && handleDateSelect('start', dateObj.day)}
                            className={`
                          h-8 flex items-center justify-center text-sm rounded-full
                          ${!dateObj.isCurrentMonth ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-100 text-black'}
                          ${isDateSelected('start', dateObj.day) ? 'bg-cyan-500 text-white hover:bg-cyan-600' : ''}
                          ${isToday('start', dateObj.day) && !isDateSelected('start', dateObj.day) ? 'border border-cyan-500' : ''}
                        `}
                          >
                            {dateObj.day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* End date calendar */}
                  <div className={`${isMobile ? 'w-full mt-4' : 'w-1/2'}`}>
                    <p className="text-sm font-medium text-black mb-2">End Date</p>
                    <div className="border rounded-md p-3">
                      {/* Calendar header */}
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => changeMonth('end', 'prev')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="flex items-center gap-1">
                          <select
                            value={monthNames[endMonth]}
                            onChange={(e) => setEndMonth(monthNames.indexOf(e.target.value))}
                            className="text-gray-700 font-medium bg-transparent focus:outline-none"
                          >
                            {monthNames.map(month => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                          <select
                            value={endYear}
                            onChange={(e) => setEndYear(parseInt(e.target.value))}
                            className="text-gray-700 font-medium bg-transparent focus:outline-none"
                          >
                            {Array.from({ length: 10 }, (_, i) => endYear - 5 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => changeMonth('end', 'next')}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Days of week */}
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-xs text-center text-gray-500 font-medium">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(endYear, endMonth).map((dateObj, idx) => (
                          <div
                            key={`end-${idx}`}
                            onClick={() => dateObj.isCurrentMonth && handleDateSelect('end', dateObj.day)}
                            className={`
                          h-8 flex items-center justify-center text-sm rounded-full
                          ${!dateObj.isCurrentMonth ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-100 text-black'}
                          ${isDateSelected('end', dateObj.day) ? 'bg-cyan-500 text-white hover:bg-cyan-600' : ''}
                          ${isToday('end', dateObj.day) && !isDateSelected('end', dateObj.day) ? 'border border-cyan-500' : ''}
                        `}
                          >
                            {dateObj.day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick selection options */}
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">QUICK SELECT</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDateRange('today')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center
                    ${startDate === formatDate(new Date()) && endDate === formatDate(new Date())
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setDateRange('yesterday')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center
                    ${startDate === formatDate(new Date(new Date().setDate(new Date().getDate() - 1))) &&
                          endDate === formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'}`}
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => setDateRange('last7days')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center
                    ${startDate === formatDate(new Date(new Date().setDate(new Date().getDate() - 6))) &&
                          endDate === formatDate(new Date())
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'}`}
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => setDateRange('thisMonth')}
                      className="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700"
                    >
                      This month
                    </button>
                    <button
                      onClick={() => setDateRange('lastMonth')}
                      className="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700"
                    >
                      Last month
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setIsDatePickerOpen(false);
                    }}
                    className="px-4 py-2 text-black rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                    disabled={!startDate || !endDate}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SL % with improved interaction */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">SL (%):</label>
          <div className="flex">
            <button
              onClick={decrementSL}
              className="px-1.5 py-1 bg-gray-200 text-gray-700 rounded-l-md border border-r-0  mx-0.5 hover:bg-gray-300 transition-colors active:bg-gray-400 text-xs font-medium"
            >
              -
            </button>
            <input
              type="number"
              value={slPercentage}
              onChange={(e) => setSlPercentage(parseFloat(e.target.value))}
              step="0.5"
              className="border border-gray-300 py-1.5 px-2 w-16 text-center text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200"
            />
            <button
              onClick={incrementSL}
              className="px-1.5 py-1 bg-gray-200 text-gray-700 rounded-r-md border border-l-0 mx-0.5 hover:bg-gray-300 transition-colors active:bg-gray-400 text-xs font-medium"
            >
              +
            </button>
          </div>
        </div>

        {/* Load dropdown with trade books */}
        <div className="ml-auto">
          <label className="block mb-2 text-sm font-medium text-gray-700">Load:</label>
          <select
            className="border px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition duration-200"
            value={activeTradeBook}
            onChange={(e) => setActiveTradeBook(e.target.value)}
          >
            <option value="">--</option>
            {tradeBooks.map((book, index) => (
              <option key={index} value={book}>{book}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Table with hover effects and sortable columns */}
      <div className="border rounded-lg bg-white shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th data-sort="symbol" className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('symbol')}>
                <div className="flex items-center">
                  <span>Symbol</span>
                  {sortField === 'symbol' && (
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th data-sort="entry" className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold text-center" onClick={() => handleSort('entry')}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>Entry</span>
                    {sortField === 'entry' && (
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-normal text-gray-600 text-xs">Qty <span className="mx-1 text-gray-400">|</span> Price <span className="mx-1 text-gray-400">|</span> Date/Time</span>
                </div>
              </th>
              <th data-sort="exit" className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer group relative font-semibold text-center" onClick={() => handleSort('exit')}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>Exit</span>
                    {sortField === 'exit' && (
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-normal text-gray-600 text-xs">Qty <span className="mx-1 text-gray-400">|</span> Price <span className="mx-1 text-gray-400">|</span> Date/Time</span>
                </div>
              </th>
              <th data-sort="pl" className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('pl')}>
                <div className="flex items-center">
                  <span>P/L % (₹)</span>
                  {sortField === 'pl' && (
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th data-sort="potential" className="px-4 py-3 hover:bg-gray-300 transition-colors cursor-pointer font-semibold" onClick={() => handleSort('potential')}>
                <div className="flex items-center">
                  <span>Potential P/L (₹)</span>
                  {sortField === 'potential' && (
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
              trades.map((trade, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-50 transition-colors ${trade.pl.startsWith('+') ? 'hover:bg-green-50' : trade.pl.startsWith('-') ? 'hover:bg-red-50' : ''
                    }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-700">{trade.symbol}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{trade.entry}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{trade.exit}</td>
                  <td className={`px-4 py-3 font-medium  ${trade.pl.startsWith('+') ? 'text-green-600' : trade.pl.startsWith('-') ? 'text-red-600' : ''
                    }`}>
                    {trade.pl}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{trade.potential}</td>
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

      {/* Functional pagination with improved styling */}
      <div className="mt-4 flex justify-center text-sm text-gray-600 items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md flex items-center justify-center transition-all ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-200 hover:shadow-sm active:bg-gray-300'
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="mx-6 font-medium">
          Showing <span className="text-blue-600">{totalItems > 0 ? startItem : 0}</span> - <span className="text-blue-600">{endItem}</span> of <span className="text-blue-600">{totalItems}</span>
        </span>
        <button
          onClick={nextPage}
          disabled={endItem >= totalItems}
          className={`px-3 py-2 rounded-md flex items-center justify-center transition-all ${endItem >= totalItems
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-200 hover:shadow-sm active:bg-gray-300'
            }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slide-up transition-all duration-300 ease-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create New Trade Book</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trade Book Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Swing Trades, Nifty Strategy"
                  value={newTradeBookName}
                  onChange={(e) => setNewTradeBookName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Total Capital (Portfolio + Cash)
                </label>
                <input
                  type="number"
                  placeholder="₹ e.g., 100000"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Used for calculating portfolio-level P&L. If unknown, enter 0.
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

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newTradeBookName.trim()}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition transform hover:scale-105 disabled:opacity-50"
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