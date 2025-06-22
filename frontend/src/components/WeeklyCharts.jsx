import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer
} from 'recharts';

export default function WeeklyCharts({ data }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Weekly Trends</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Temperature */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Temperature (°C)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="min_temp" stroke="#3b82f6" name="Min" />
              <Line type="monotone" dataKey="max_temp" stroke="#ef4444" name="Max" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Humidity (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min_humidity" fill="#60a5fa" name="Min" />
              <Bar dataKey="max_humidity" fill="#2563eb" name="Max" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dew Point */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Dew Point (°C)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="min_dew_point" stroke="#14b8a6" fill="#5eead4" name="Min" />
              <Area type="monotone" dataKey="max_dew_point" stroke="#0f766e" fill="#2dd4bf" name="Max" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pressure */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Pressure (hPa)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="min_pressure" stroke="#8b5cf6" name="Min" />
              <Line type="monotone" dataKey="max_pressure" stroke="#7c3aed" name="Max" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Solar Radiation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Solar Radiation (W/m²)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min_solar" fill="#facc15" name="Min" />
              <Bar dataKey="max_solar" fill="#f59e0b" name="Max" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Wind Speed (km/h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="min_wind" stroke="#22d3ee" name="Min" />
              <Line type="monotone" dataKey="max_wind" stroke="#06b6d4" name="Max" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
