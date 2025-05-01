// components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, List, Book, NotebookPen, Search, HelpCircle } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className={`
      fixed z-[100] top-0 bottom-0 bg-[#3f4d67] w-[250px] 
      shadow-[1px_0_20px_0_#3f4d67]
      transition-all duration-200 ease-in-out
      ${isOpen ? 'left-0' : '-left-[250px]'}
      flex flex-col justify-between text-white
    `}>
      {/* Logo */}
      <div>
        <Link to="/" className="block p-6 text-2xl font-bold text-center hover:opacity-90">
          <span className="text-blue-400">CHARTS</span><span className="text-green-400">MAZE</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 py-8">
          <SidebarLink to="/" icon={<Book size={20} />} text="My Rule Book" isActive={currentPath === '/'} />
          <SidebarLink to="/add-trades" icon={<Plus size={20} />} text="Add Trades" isActive={currentPath === '/add-trades'} />
          <SidebarLink to="/manage-trades" icon={<List size={20} />} text="Manage Trades" isActive={currentPath === '/manage-trades'} />
          <SidebarLink to="/open-positions" icon={<NotebookPen size={20} />} text="Open Positions" isActive={currentPath === '/open-positions'} />
          <SidebarLink to="/dashboard" icon={<Home size={20} />} text="Dashboard" isActive={currentPath === '/dashboard'} />
          <SidebarLink to="/trade-diary" icon={<NotebookPen size={20} />} text="Trade Diary" isActive={currentPath === '/trade-diary'} />
          <SidebarLink to="/screener" icon={<Search size={20} />} text="ChartsMaze Screener" isActive={currentPath === '/screener'} />
          <SidebarLink to="/help" icon={<HelpCircle size={20} />} text="Help or Feedback" isActive={currentPath === '/help'} />
        </nav>
      </div>

      {/* Login button */}
      <div className="p-4">
        <Link to="/login">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, isActive }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 p-2 rounded-md transition-all duration-200
      ${isActive 
        ? 'bg-slate-600 shadow-md border-l-4 border-blue-400 pl-3' 
        : 'hover:bg-slate-700 text-white'}
    `}
  >
    <span className={`${isActive ? 'text-white' : 'text-gray-300'}`}>
      {icon}
    </span>
    <span className={`${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
      {text}
    </span>
  </Link>
);

export default Sidebar;
