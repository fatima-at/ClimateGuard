// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Report from './pages/Report'; 
import About from './pages/About';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-[url('/assets/bg.jpg')] bg-cover bg-center bg-no-repeat dark:bg-[url('/assets/bg6.jpg')]">
          <Navbar />
          <Sidebar />
          
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<Report />} />
              <Route path="/about" element={<About />} />

            </Routes>
          </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
