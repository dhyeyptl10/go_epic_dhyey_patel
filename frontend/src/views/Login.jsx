import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Login({ backendUrl, setView, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const resJson = await res.json();
      if (resJson.success) {
        localStorage.setItem('sessionId', resJson.data.sessionId);
        localStorage.setItem('user', JSON.stringify(resJson.data.user));
        setUser(resJson.data.user);
        setView('dashboard');
      } else {
        setError(resJson.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection to auth server failed. Try fallback mock credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = (role) => {
    const demo = role === 'admin' 
      ? { name: 'Dhyey Patel (Admin)', email: 'admin@goepic.com', role: 'admin' }
      : { name: 'Coder Luffy', email: 'luffy@goepic.com', role: 'user' };
    
    localStorage.setItem('sessionId', 'sess_demo_123456');
    localStorage.setItem('user', JSON.stringify(demo));
    setUser(demo);
    setView('dashboard');
  };

  return (
    <div className="max-width-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="text-gradient">Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Sign in to continue solving problems</p>
        </div>

        {error && (
          <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="developer@goepic.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <span onClick={() => setView('register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create Account</span>
        </div>

        {/* Quick Demo Access */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quick Dev Demo Access</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', justifyContent: 'center' }} onClick={() => loadDemoUser('user')}>
              Coder Demo
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.75rem', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.2)' }} onClick={() => loadDemoUser('admin')}>
              <ShieldAlert size={12} style={{ color: 'var(--accent-purple)' }} /> Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
