import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CommunityHeroApp from './components/CommunityHeroApp';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<CommunityHeroApp />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;