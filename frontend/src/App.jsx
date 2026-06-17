import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Problems from './views/Problems';
import Playground from './views/Playground';
import Datasets from './views/Datasets';
import Login from './views/Login';
import Register from './views/Register';
import ApiExplorer from './components/ApiExplorer';

// Read backend URL from environment variables or fallback to local port
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    setUser(null);
    setView('dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            backendUrl={BACKEND_URL} 
            setView={setView} 
            setSelectedTopic={setSelectedTopic}
            user={user}
          />
        );
      case 'problems':
        return (
          <Problems 
            backendUrl={BACKEND_URL} 
            setView={setView} 
            setSelectedProblemId={setSelectedProblemId}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            user={user}
          />
        );
      case 'playground':
        return (
          <Playground 
            backendUrl={BACKEND_URL} 
            setView={setView} 
            problemId={selectedProblemId}
            user={user}
          />
        );
      case 'datasets':
        return (
          <Datasets 
            backendUrl={BACKEND_URL} 
          />
        );
      case 'api-docs':
        return (
          <div className="max-width-container" style={{ paddingBottom: '60px' }}>
            <ApiExplorer backendUrl={BACKEND_URL} />
          </div>
        );
      case 'login':
        return (
          <Login 
            backendUrl={BACKEND_URL} 
            setView={setView} 
            setUser={setUser} 
          />
        );
      case 'register':
        return (
          <Register 
            backendUrl={BACKEND_URL} 
            setView={setView} 
          />
        );
      default:
        return (
          <Dashboard 
            backendUrl={BACKEND_URL} 
            setView={setView} 
            setSelectedTopic={setSelectedTopic}
            user={user}
          />
        );
    }
  };

  return (
    <>
      {/* Background canvas */}
      <div className="bg-grid-overlay" />
      <div className="bg-glow-radial" />
      
      {/* Main container */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          currentView={view} 
          setView={setView} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main style={{ flex: 1 }}>
          {renderView()}
        </main>
      </div>
    </>
  );
}
