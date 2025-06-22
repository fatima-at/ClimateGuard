import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <label className="cursor-pointer">
      <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="hidden" />
      <div className="w-10 h-5 flex items-center bg-gray-300 dark:bg-slate-600 rounded-full p-1">
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
            darkMode ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
    </label>
  );
}
