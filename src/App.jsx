import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ManageTrades from './components/ManageTrades';
import OpenPositions from './components/OpenPositions'; // Import the new component

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // This ensures we see state changes in the console for debugging
  useEffect(() => {
    console.log("Sidebar state:", isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    console.log("Toggle clicked, current state:", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ScreenerRedirect = () => {
    useEffect(() => {
      window.location.href = "https://chartsmaze.com/";
    }, []);
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Redirecting to ChartsMaze Screener...</div>
      </div>
    );
  };

  const HelpRedirect = () => {
    useEffect(() => {
      window.location.href = "https://mail.google.com/mail/u/0/?fs=1&to=techscannerpro@gmail.com&su=Help+or+Feedback+About+Trade+Journal&tf=cm";
    }, []);
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Opening email to contact support...</div>
      </div>
    );
  };

  return (
    <Router>
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
        {/* Overlay when sidebar is open on mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-20
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </aside>

        {/* Floating hamburger button that follows sidebar */}
        <div 
          className={`
            fixed top-4 z-30 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'left-[calc(256px+8px)]' : 'left-10'}
            flex items-center gap-3
          `}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          
          {/* Logo text next to hamburger when sidebar is closed */}
          {!isSidebarOpen && (
            <div className="font-bold text-xl text-gray-800 bg-white px-3 py-2 rounded-lg shadow-lg">
              CHARTSMAZE
            </div>
          )}
        </div>

        {/* Main content with routes */}
        <main className={`
          flex-1 transition-all duration-300
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        `}>
          <div className="p-4 md:p-6 lg:p-8 mt-16">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/add-trades" element={<MainContent/>}/>
              <Route path="/manage-trades" element={<ManageTrades />} />
              <Route path="/open-positions" element={<OpenPositions />} />
              <Route path="/dashboard" element={<MainContent/>}/>
              <Route path="/trade-diary" element={<MainContent/>}/>
              <Route path="/screener" element={<ScreenerRedirect />} />  
              <Route path="/help" element={<HelpRedirect />} />           
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;