import React from 'react';
import { Terminal, BookOpen, Database, User, ShieldAlert, Cpu } from 'lucide-react';

export default function Navbar({ currentView, setView, user, onLogout }) {
  return (
    <nav className="glass-panel" style={{
      margin: '20px auto',
      maxWidth: '1200px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 28px',
      position: 'sticky',
      top: '20px',
      zIndex: 100
    }}>
      <div 
        onClick={() => setView('dashboard')} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.2))',
          padding: '8px',
          borderRadius: '10px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Cpu size={22} className="text-gradient" style={{ color: '#00f2fe' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', margin: 0 }} className="text-gradient">
            GO-EPIC
          </h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Coding Lab 2026
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('dashboard')}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <BookOpen size={16} /> Dashboard
        </button>

        <button 
          className={`btn ${currentView === 'problems' || currentView === 'playground' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('problems')}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Terminal size={16} /> Problems
        </button>

        <button 
          className={`btn ${currentView === 'datasets' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('datasets')}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Database size={16} /> Datasets
        </button>

        <button 
          className={`btn ${currentView === 'api-docs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setView('api-docs')}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Terminal size={16} /> Live API
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 500 }}>
                {user.role === 'admin' ? 'SYSTEM ADMIN' : 'CODER'}
              </div>
            </div>
            {user.role === 'admin' && (
              <div 
                title="Admin Dashboard Enabled" 
                style={{ color: 'var(--accent-purple)', display: 'flex', alignItems: 'center' }}
              >
                <ShieldAlert size={18} />
              </div>
            )}
            <button 
              className="btn btn-danger" 
              onClick={onLogout}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setView('login')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Login
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setView('register')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
