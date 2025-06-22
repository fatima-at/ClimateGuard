import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Report() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/statistics')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Error fetching stats:', err));
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('ClimateGuard: Statistical Report', 14, 16);

    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Mean', 'Min', 'Max', 'Std Dev']],
      body: Object.entries(stats).filter(([key]) => key !== 'from' && key !== 'to').map(([key, val]) => [
        key.charAt(0).toUpperCase() + key.slice(1),
        val.mean.toFixed(2),
        val.min.toFixed(2),
        val.max.toFixed(2),
        val.std.toFixed(2),
      ]),
    });

    doc.text(`Period: ${new Date(stats.from).toLocaleString()} → ${new Date(stats.to).toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save('ClimateGuard_Statistical_Report.pdf');
  };

  if (!stats) {
    return (
    <main className="ml-6 w-[calc(100%-16rem)] mt-16 p-8 min-h-screen transition">
        <h1 className="text-2xl text-gray-800 dark:text-white">Generating Report...</h1>
      </main>
    );
  }

  return (
       <main className="ml-6 w-[calc(100%-16rem)] mt-16 p-8 min-h-screen transition">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Statistical Report</h1>
        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Download as PDF
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Period: <strong>{new Date(stats.from).toLocaleString()}</strong> → <strong>{new Date(stats.to).toLocaleString()}</strong>
      </p>

      <div className="overflow-x-auto">
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
    </main>
  );
}
