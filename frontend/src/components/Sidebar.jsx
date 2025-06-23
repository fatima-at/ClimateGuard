// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className=" fixed bg-white dark:bg-darkBg w-64 h-[calc(100vh-6rem)] mt-20 ml-4 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col gap-6">
      <Link
        to="/"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-darkcontrast transition"
      >
        Home
      </Link>

      <Link
        to="/report"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-darkcontrast transition"
      >
        Statistical Reports
      </Link>

      <Link
        to="/about"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-darkcontrast transition"
      >
        About Us
      </Link>

      <Link
        to="#"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-darkcontrast transition"
      >
        Settings
      </Link>
    </aside>
  );
}
