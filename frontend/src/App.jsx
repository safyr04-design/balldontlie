import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import Predictions from './pages/Predictions';
import FactorAnalysis from './pages/FactorAnalysis';
import { Activity, BarChart3, Brain, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('bdl_api_key') || '');

  const handleApiKeySubmit = (key) => {
    localStorage.setItem('bdl_api_key', key);
    setApiKey(key);
  };

  if (!apiKey) {
    return <ApiKeyPrompt onSubmit={handleApiKeySubmit} />;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Header apiKey={apiKey} onClearApiKey={() => setApiKey('')} />
          <Routes>
            <Route path="/" element={<Dashboard apiKey={apiKey} />} />
            <Route path="/models" element={<Models apiKey={apiKey} />} />
            <Route path="/predictions" element={<Predictions apiKey={apiKey} />} />
            <Route path="/analysis" element={<FactorAnalysis apiKey={apiKey} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function ApiKeyPrompt({ onSubmit }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="api-key-prompt">
      <div className="api-key-card">
        <h1>🏀 Ball Don't Lie Lab</h1>
        <p>Enter your API key to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="API Key"
            className="api-key-input"
          />
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
        <p className="api-key-help">
          Get your API key from <a href="https://lab-app.balldontlie.io" target="_blank" rel="noopener noreferrer">lab-app.balldontlie.io</a>
        </p>
      </div>
    </div>
  );
}

function Header({ apiKey, onClearApiKey }) {
  return (
    <header className="header">
      <div className="header-content">
        <h2>Ball Don't Lie Lab Dashboard</h2>
        <div className="header-actions">
          <span className="api-key-status">
            API Key: {apiKey.substring(0, 8)}...
          </span>
          <button onClick={onClearApiKey} className="btn btn-secondary btn-sm">
            Change Key
          </button>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const navItems = [
    { path: '/', icon: Activity, label: 'Dashboard' },
    { path: '/models', icon: Brain, label: 'Models' },
    { path: '/predictions', icon: TrendingUp, label: 'Predictions' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🏀 BDL Lab</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="nav-item">
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>API Dashboard v1.0</p>
      </div>
    </aside>
  );
}

export default App;
