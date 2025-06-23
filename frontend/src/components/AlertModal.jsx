import { useEffect, useState } from 'react';

export default function AlertModal({ onClose }) {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          console.error('Unexpected response:', data);
          setError('Failed to load alerts');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch alerts');
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Latest Alerts</h2>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No active alerts.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {alerts.map((alert) => (
              <li key={alert.id} className="bg-red-100 dark:bg-red-200 text-red-800 p-3 rounded-md shadow-sm">
                <div><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</div>
                <div><strong>Message:</strong> {alert.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
