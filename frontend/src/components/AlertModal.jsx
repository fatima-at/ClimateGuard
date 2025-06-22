// src/components/AlertModal.jsx
export default function AlertModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">📢 Alerts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">No current alerts.</p>
        <button className="mt-4 bg-blue-600  dark:bg-darkcontrast text-white px-4 py-1 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
