import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

export default function Register({ backendUrl, setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${backendUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const resJson = await res.json();
      if (resJson.success) {
        setSuccess(true);
        setTimeout(() => setView('login'), 2000);
      } else {
        setError(resJson.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to registration server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-width-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="text-gradient">Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Start your algorithm concurrency journey</p>
        </div>

        {error && (
          <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(0, 255, 135, 0.05)', borderColor: 'rgba(0, 255, 135, 0.2)', color: 'var(--accent-green)', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '8px' }}>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Developer Nickname</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Luffy" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="luffy@pirate.com" 
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <span onClick={() => setView('login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
