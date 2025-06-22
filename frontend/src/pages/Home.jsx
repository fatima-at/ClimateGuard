import { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import WeeklyCharts from '../components/WeeklyCharts';

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [view, setView] = useState('today');

  // Fetch today's data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/latest-data");
        const data = await res.json();
        setSensorData(data);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weekly summary
  useEffect(() => {
    if (view === 'week') {
      const fetchWeekData = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/week-summary");
          const data = await res.json();
          setWeekData(data);
        } catch (err) {
          console.error("Error fetching weekly data:", err);
        }
      };
      fetchWeekData();
    }
  }, [view]);

  const weatherData = sensorData && [
    {
      label: 'Temperature',
      temperature: sensorData.temperature,
      date: new Date(sensorData.timestamp),
      minTemp: '-',
      maxTemp: '-',
    },
    {
      label: 'Relative Humidity',
      value: sensorData.relative_humidity,
      icon: '💧',
      description: 'Comfortable',
      max: 100,
    },
    {
      label: 'Dew Point',
      value: `${sensorData.dew_point}°C`,
      icon: '💦',
      description: 'Feels sticky',
    },
    {
      label: 'Pressure',
      value: `${sensorData.pressure} hPa`,
      icon: '📈',
      trend: 'Stable',
    },
    {
      label: 'Solar Radiation',
      value: sensorData.solar_radiation,
      icon: '☀️',
      max: 1000,
    },
    {
      label: 'Wind Direction',
      value: `${sensorData.wind_direction}°`,
      icon: '🧭',
    },
    {
      label: 'Wind Speed',
      value: sensorData.wind_speed,
      icon: '🌬️',
      min: 0,
      max: 50,
    },
  ];

  return (
    <main className="ml-6 w-[calc(100%-16rem)] mt-16 p-8 min-h-screen transition">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weather Overview</h1>
        <div className="space-x-4">
          <button onClick={() => setView('today')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${view === 'today' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}>
            Today
          </button>
          <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-sm font-medium ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}>
            Week
          </button>
        </div>
      </div>

      {view === 'today' && weatherData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((data, index) => (
            <Widget
              key={index}
              label={data.label}
              value={data.value}
              icon={data.icon}
              description={data.description}
              date={data.date}
              minTemp={data.minTemp}
              maxTemp={data.maxTemp}
              temperature={data.temperature}
            />
          ))}
        </div>
      )}

      {view === 'week' && weekData && (
        <WeeklyCharts data={weekData} />
      )}
    </main>
  );
}
