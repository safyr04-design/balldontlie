import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import Predictions from './pages/Predictions';
import FactorAnalysis from './pages/FactorAnalysis';
import Settings from './pages/Settings';
import ApiDocs from './pages/ApiDocs';
import { 
  Activity, BarChart3, Brain, TrendingUp, Settings as SettingsIcon,
  LogOut, Menu, X, Sparkles, ChevronLeft, ChevronRight, Book
} from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('bdl_api_key') || '');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleApiKeySubmit = (key) => {
    localStorage.setItem('bdl_api_key', key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('bdl_api_key');
    setApiKey('');
  };

  if (!apiKey) {
    return <ApiKeyPrompt onSubmit={handleApiKeySubmit} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-dark-950 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header 
            apiKey={apiKey} 
            onClearApiKey={handleClearApiKey}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex-1 overflow-auto">
            <AnimatedRoutes apiKey={apiKey} />
          </div>
        </main>
      </div>
    </Router>
  );
}

function AnimatedRoutes({ apiKey }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Dashboard apiKey={apiKey} />
          </PageTransition>
        } />
        <Route path="/models" element={
          <PageTransition>
            <Models apiKey={apiKey} />
          </PageTransition>
        } />
        <Route path="/predictions" element={
          <PageTransition>
            <Predictions apiKey={apiKey} />
          </PageTransition>
        } />
        <Route path="/analysis" element={
          <PageTransition>
            <FactorAnalysis apiKey={apiKey} />
          </PageTransition>
        } />
        <Route path="/settings" element={
          <PageTransition>
            <Settings apiKey={apiKey} />
          </PageTransition>
        } />
        <Route path="/api-docs" element={
          <PageTransition>
            <ApiDocs apiKey={apiKey} />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function ApiKeyPrompt({ onSubmit }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card card-hover p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Ball Don't Lie Lab
            </h1>
            <p className="text-gray-400">
              Sports betting analysis powered by AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-lg">
              Get Started
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-700">
            <p className="text-sm text-gray-400 text-center">
              Don't have an API key?{' '}
              <a
                href="https://lab-app.balldontlie.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Get one here
              </a>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Requires LAB PRO or ALL-ACCESS subscription
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Header({ apiKey, onClearApiKey, toggleSidebar }) {
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Check navigation state
    const updateNavState = () => {
      setCanGoBack(window.history.length > 1);
      // Forward state is harder to track, we'll enable it optimistically
      setCanGoForward(window.history.state?.idx > 0);
    };
    
    updateNavState();
    window.addEventListener('popstate', updateNavState);
    return () => window.removeEventListener('popstate', updateNavState);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <header className="bg-dark-900 border-b border-dark-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Back/Forward Navigation Controls */}
        <div className="flex items-center gap-1 px-2 py-1 bg-dark-800 rounded-lg border border-dark-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            disabled={!canGoBack}
            className={`
              p-2 rounded-md transition-all
              ${canGoBack 
                ? 'hover:bg-dark-700 text-gray-300 hover:text-white cursor-pointer' 
                : 'text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="w-px h-6 bg-dark-700"></div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleForward}
            className="p-2 rounded-md hover:bg-dark-700 text-gray-300 hover:text-white transition-all"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="hidden sm:block">
          <h2 className="text-xl font-semibold text-gray-100">
            Sports Betting Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            AI-powered predictions and analysis
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg border border-dark-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400 font-mono">
            {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
          </span>
        </div>
        
        <button
          onClick={onClearApiKey}
          className="btn btn-secondary flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Activity, label: 'Dashboard', color: 'primary' },
    { path: '/models', icon: Brain, label: 'Models', color: 'purple' },
    { path: '/predictions', icon: TrendingUp, label: 'Predictions', color: 'green' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis', color: 'yellow' },
    { path: '/api-docs', icon: Book, label: 'API Docs', color: 'blue' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings', color: 'gray' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 bg-dark-900 border-r border-dark-800 
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BDL Lab</h1>
              <p className="text-xs text-gray-500">Pro Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30' 
                    : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-800">
          <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-lg p-4 border border-primary-600/30">
            <p className="text-sm font-medium text-gray-200 mb-1">
              🚀 Pro Plan Active
            </p>
            <p className="text-xs text-gray-400">
              Unlimited models & full API access
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default App;
