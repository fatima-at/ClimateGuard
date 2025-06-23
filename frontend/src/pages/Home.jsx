import { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import WeeklyCharts from '../components/WeeklyCharts';

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [view, setView] = useState('today');
  const [minMaxData, setMinMaxData] = useState(null);
  const [predictedTemp, setPredictedTemp] = useState(null);

  // Fetch today's data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/latest-data");
        const data = await res.json();
        console.log("Fetched sensor data:", data);
        setSensorData(data);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fetch min/max data for the latest date
  useEffect(() => {
    const fetchMinMax = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/latest-day-minmax");
        const data = await res.json();
        console.log("Fetched min and max data:", data);
        setMinMaxData(data);
      } catch (err) {
        console.error("Error fetching min and max data:", err);
      }
    };

    fetchMinMax();
    const interval = setInterval(fetchMinMax, 300000);
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

  // Fetch predicted temperature using latest sensor data
  useEffect(() => {
    if (!sensorData) return;

    const fetchPredictedTemp = async () => {
      try {
        // Prepare payload matching your model input keys
        const payload = {
          dew_point_2m: sensorData.dew_point,
          relative_humidity_2m: sensorData.relative_humidity,
          pressure_msl: sensorData.pressure,
          wind_speed_10m: sensorData.wind_speed,
          wind_direction_10m: sensorData.wind_direction,
          shortwave_radiation: sensorData.solar_radiation,
          hour: new Date(sensorData.timestamp).getHours(),
          day: new Date(sensorData.timestamp).getDate(),
        };

        const res = await fetch('http://localhost:5000/api/predict-temperature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        console.log("Fetched predicted temperature:", json);
        if (json.predicted_temperature_2m !== undefined) {
          setPredictedTemp(json.predicted_temperature_2m);
        }
      } catch (err) {
        console.error("Error fetching predicted temperature:", err);
      }
    };

    fetchPredictedTemp();
  }, [sensorData]);

  const weatherData = sensorData && minMaxData ? [
    {
      label: 'Temperature',
      value: sensorData.temperature !== null ? sensorData.temperature.toFixed(1) : '-',
      predictedValue: predictedTemp !== null ? predictedTemp.toFixed(2) : undefined,
      date: sensorData.timestamp ? new Date(sensorData.timestamp) : null,
      min: minMaxData.min_temp !== null ? minMaxData.min_temp.toFixed(1) : '-',
      max: minMaxData.max_temp !== null ? minMaxData.max_temp.toFixed(1) : '-',
    },
    {
      label: 'Relative Humidity',
      value: sensorData.relative_humidity !== null ? sensorData.relative_humidity.toFixed(1) : '-',
      min: minMaxData.min_humidity !== null ? minMaxData.min_humidity.toFixed(1) : '-',
      max: minMaxData.max_humidity !== null ? minMaxData.max_humidity.toFixed(1) : '-',
      icon: '💧',
      description: 'Comfortable',
    },
    {
      label: 'Dew Point',
      value: sensorData.dew_point !== null ? `${sensorData.dew_point.toFixed(1)}°C` : '-',
      min: minMaxData.min_dew_point !== null ? minMaxData.min_dew_point.toFixed(1) : '-',
      max: minMaxData.max_dew_point !== null ? minMaxData.max_dew_point.toFixed(1) : '-',
      icon: '💦',
      description: 'Feels sticky',
    },
    {
      label: 'Pressure',
      value: sensorData.pressure !== null ? `${sensorData.pressure.toFixed(1)} hPa` : '-',
      min: minMaxData.min_pressure !== null ? minMaxData.min_pressure.toFixed(1) : '-',
      max: minMaxData.max_pressure !== null ? minMaxData.max_pressure.toFixed(1) : '-',
      icon: '📈',
      trend: 'Stable',
    },
    {
      label: 'Solar Radiation',
      value: sensorData.solar_radiation !== null ? sensorData.solar_radiation.toFixed(1) : '-',
      min: minMaxData.min_solar_radiation !== null ? minMaxData.min_solar_radiation.toFixed(1) : '-',
      max: minMaxData.max_solar_radiation !== null ? minMaxData.max_solar_radiation.toFixed(1) : '-',
      icon: '☀️',
    },
    {
      label: 'Wind Direction',
      value: sensorData.wind_direction !== null ? `${sensorData.wind_direction}°` : '-',
      min: minMaxData.min_wind_direction !== null ? minMaxData.min_wind_direction.toFixed(1) : '-',
      max: minMaxData.max_wind_direction !== null ? minMaxData.max_wind_direction.toFixed(1) : '-',
      icon: '🧭',
    },
    {
      label: 'Wind Speed',
      value: sensorData.wind_speed !== null ? sensorData.wind_speed.toFixed(1) : '-',
      min: minMaxData.min_wind_speed !== null ? minMaxData.min_wind_speed.toFixed(1) : '-',
      max: minMaxData.max_wind_speed !== null ? minMaxData.max_wind_speed.toFixed(1) : '-',
      icon: '🌬️',
    },
  ] : [];

  if (!sensorData) {
    return <p className="text-center text-gray-500">Loading sensor data...</p>;
  }

  return (
    <main className="w-[calc(100%-16rem)] mt-16 p-8 min-h-screen transition" style={{ marginLeft: '17rem' }}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weather Overview</h1>
        <div className="space-x-4">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${view === 'today' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}
          >
            Today
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}
          >
            Week
          </button>
        </div>
      </div>

      {view === 'today' && weatherData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((data, index) => (
            <Widget
              key={index}
              label={data.label}
              value={data.value}
              predictedValue={data.predictedValue}  // <-- pass predictedValue here
              icon={data.icon}
              description={data.description}
              date={data.date}
              min={data.min}
              max={data.max}
              trend={data.trend}
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
