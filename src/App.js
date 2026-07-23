import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Home from './components/Home';
import Bai1 from './components/Bai1';
import Bai2 from './components/Bai2';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button 
          className="btn btn-outline" 
          onClick={toggleTheme} 
          style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--card-bg)' }}
          title="Đổi chế độ Sáng/Tối"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bai1" element={<Bai1 />} />
          <Route path="/bai2" element={<Bai2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
