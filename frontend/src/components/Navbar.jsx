import { useEffect, useState } from 'react';
import Togglebutton from './Togglebutton';  // or the correct relative path

export default function Navbar({ onAlertsClick }) {
  const [unresolvedAlertsCount, setUnresolvedAlertsCount] = useState(0);

  useEffect(() => {
    const fetchAlertsCount = () => {
      fetch('http://localhost:5000/api/alerts')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setUnresolvedAlertsCount(data.length);
          }
        })
        .catch(err => console.error('Error fetching alerts:', err));
    };

    fetchAlertsCount(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchAlertsCount();
    }, 30000); // Poll every 30000 ms = 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <header className="w-full justify-between flex items-center px-6 py-3 bg-white dark:bg-darkmain border-b dark:border-slate-700 shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
      <div className="text-2xl font-bold text-blue-600 dark:text-darkcontrast mr-10">
        🌤️ ClimateGuard
      </div>

      <div className="ml-10 flex gap-2 items-center relative">
        <button
          onClick={onAlertsClick}
          className="mr-0 text-blue-600 dark:text-blue-300 hover:text-blue-800 transition relative"
          aria-label="Show alerts"
          title="Show alerts"
        >
          <span className="material-icons dark:text-darkcontrast">notifications</span>

          {unresolvedAlertsCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
              aria-label={`${unresolvedAlertsCount} unread alerts`}
              role="alert"
            >
              !
            </span>
          )}
        </button>
        <Togglebutton />
      </div>
    </header>
  );
}
