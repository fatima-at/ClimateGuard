import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Report from "./pages/Report";
import About from "./pages/About";
import AlertModal from "./components/AlertModal";  // import your AlertModal
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    // Fetch alerts once on mount or replace with interval for live update
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        if (data.length > 0) setShowAlertModal(true); // auto show if alerts exist
      })
      .catch(console.error);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-[url('/assets/bg.jpg')] bg-fixed bg-center bg-no-repeat dark:bg-[url('/assets/bg6.jpg')]">
           {/* Pass the alerts open callback to Navbar */}
          <Navbar onAlertsClick={() => setShowAlertModal(true)} />
          <Sidebar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
          </Routes>

          {/* Conditionally render the AlertModal */}
          {showAlertModal && (
            <AlertModal alerts={alerts || []} onClose={() => setShowAlertModal(false)} />
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
