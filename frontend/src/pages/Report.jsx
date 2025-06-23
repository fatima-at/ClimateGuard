import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const METRICS = [
  { key: 'temperature', label: 'Temperature (°C)' },
  { key: 'relative_humidity', label: 'Relative Humidity (%)' },
  { key: 'pressure', label: 'Pressure (hPa)' },
  { key: 'dew_point', label: 'Dew Point (°C)' },
  { key: 'solar_radiation', label: 'Solar Radiation (W/m²)' },
  { key: 'wind_speed', label: 'Wind Speed (m/s)' }
];

export default function Report() {
  const [stats, setStats] = useState(null);
  const [anomalyData, setAnomalyData] = useState(null);
  const chartRefs = useRef({}); 

  useEffect(() => {
    fetch('http://localhost:5000/api/statistics')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Error fetching stats:', err));

    fetch('http://localhost:5000/api/anomaly-data')
      .then((res) => res.json())
      .then((data) => setAnomalyData(data))
      .catch((err) => console.error('Error fetching anomaly data:', err));
  }, []);

  const downloadPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let yOffset = 20;

    doc.text('ClimateGuard: Statistical Report', 14, yOffset);
    yOffset += 10;
    doc.setFontSize(10); 
    doc.text(
      `Period: ${new Date(stats.from).toLocaleString()} to ${new Date(stats.to).toLocaleString()}`,
      14,
      yOffset
    );
    yOffset += 10;
    autoTable(doc, {
      startY: yOffset,
      head: [['Metric', 'Mean', 'Min', 'Max', 'Std Dev']],
      body: Object.entries(stats)
        .filter(([key]) => key !== 'from' && key !== 'to')
        .map(([key, val]) => [
          key.charAt(0).toUpperCase() + key.slice(1),
          val.mean.toFixed(2),
          val.min.toFixed(2),
          val.max.toFixed(2),
          val.std.toFixed(2),
        ]),
    });
    yOffset = doc.lastAutoTable.finalY + 10;
    for (const [key, el] of Object.entries(chartRefs.current)) {
      if (el) {
        const canvas = await html2canvas(el);
        const imgData = canvas.toDataURL('image/png');

        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 20;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (yOffset + imgHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yOffset = 20;
        }

        doc.addImage(imgData, 'PNG', 10, yOffset, pdfWidth, imgHeight);
        yOffset += imgHeight + 10;
      }
    }

    doc.save('ClimateGuard_Statistical_Report.pdf');
  };

  const renderCharts = () => {
    if (!anomalyData) return <p className="mt-8 text-gray-500 dark:text-gray-300">Loading anomaly charts...</p>;

    return METRICS.map(({ key, label }) => {
      const timestamps = anomalyData.map(d => new Date(d.timestamp));
      const values = anomalyData.map(d => d[key]);
      const anomalies = anomalyData.map(d => d.anomaly === -1 ? d[key] : null);

      const chartData = {
        labels: timestamps,
        datasets: [
          {
            label: label,
            data: values,
            borderColor: 'blue',
            backgroundColor: 'blue',
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: 'Anomalies',
            data: anomalies,
            borderColor: 'red',
            backgroundColor: 'red',
            pointRadius: 5,
            showLine: false,
            type: 'scatter',
          },
        ],
      };

      const options = {
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'Pp',
              unit: 'day',
            },
            title: { display: true, text: 'Date' },
          },
          y: {
            title: { display: true, text: label },
          },
        },
        plugins: {
          legend: { position: 'top' },
        },
      };

      return (
        <div key={key} className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{label} Anomaly Detection</h2>
          <div ref={(el) => (chartRefs.current[key] = el)}>
            <Line data={chartData} options={options} />
          </div>
        </div>
      );
    });
  };

  if (!stats) {
    return (
      <main className="ml-6 w-[calc(100%-16rem)] mt-16 p-8 min-h-screen transition">
        <h1 className="text-2xl text-gray-800 dark:text-white">Generating Report...</h1>
      </main>
    );
  }

  return (
    <main className="w-[calc(100%-18rem)] mt-16 p-8 min-h-screen transition" style={{ marginLeft: '17rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Statistical Report</h1>
        <button
          onClick={downloadPDF}
          className="bg-red-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Download as PDF
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4"> 
        Period: <strong>{new Date(stats.from).toLocaleString()}</strong> → <strong>{new Date(stats.to).toLocaleString()}</strong>
      </p>  


      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-md overflow-hidden">
          <thead className="bg-blue-600 text-white text-left">
            <tr>
              <th className="px-4 py-2">Metric</th>
              <th className="px-4 py-2">Mean</th>
              <th className="px-4 py-2">Min</th>
              <th className="px-4 py-2">Max</th>
              <th className="px-4 py-2">Std. Deviation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).filter(([key]) => key !== 'from' && key !== 'to').map(([key, val], index) => (
              <tr key={index} className="border-t dark:border-slate-600 text-gray-700 dark:text-gray-200">
                <td className="px-4 py-2 font-medium capitalize">{key.replace(/_/g, ' ')}</td>
                <td className="px-4 py-2">{val.mean.toFixed(2)}</td>
                <td className="px-4 py-2">{val.min.toFixed(2)}</td>
                <td className="px-4 py-2">{val.max.toFixed(2)}</td>
                <td className="px-4 py-2">{val.std.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderCharts()}
    </main>
  );
}
