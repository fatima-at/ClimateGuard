// src/components/Navbar.jsx
import { useState } from 'react';
import AlertModal from './AlertModal';
import DarkModeToggle from './DarkModeToggle';
import Togglebutton from './Togglebutton';
export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
<header className="w-full justify-between flex items-center px-6 py-3 bg-white dark:bg-darkmain border-b dark:border-slate-700 shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
  <div className="text-2xl font-bold text-blue-600 dark:text-darkcontrast mr-10">
    🌤️ ClimateGuard
  </div>

  <div className="ml-10 flex gap-2 items-center">
    <button
      onClick={() => setShowModal(true)}
      className="mr-0 text-blue-600 dark:text-blue-300 hover:text-blue-800 transition"
    >
      <span className="material-icons dark:text-darkcontrast">Alerts</span>
    </button>
    <Togglebutton/>
  </div>

  {showModal && <AlertModal onClose={() => setShowModal(false)} />}
</header>

  );
}
