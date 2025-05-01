// components/MainContent.jsx
const MainContent = () => {
  return (
    <div className="flex-1 p-10 flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to ChartsMaze Trade Journal</h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        To start tracking your trades and get valuable insights into your trading performance, please log in to your account.
      </p>
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md mb-4">
        Log in to Continue
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">See How It Works</h2>
      <div className="bg-gray-300 w-full max-w-3xl h-64 rounded-md"></div>
    </div>
  );
};

export default MainContent;
