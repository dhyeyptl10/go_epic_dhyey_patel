import React, { useState } from 'react';
import { Play, Clipboard, Check, Eye } from 'lucide-react';

export default function ApiExplorer({ backendUrl }) {
  const [activeTab, setActiveTab] = useState('problems');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const categories = {
    auth: [
      { name: 'Register User', method: 'POST', path: '/api/v1/auth/register', desc: 'Create a new developer account', body: JSON.stringify({ name: 'Luffy', email: 'luffy@onepiece.com', password: 'PirateKing@123' }, null, 2) },
      { name: 'Login User', method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate user and generate JWT token', body: JSON.stringify({ email: 'luffy@onepiece.com', password: 'PirateKing@123' }, null, 2) },
      { name: 'Get Current Profile', method: 'GET', path: '/api/v1/auth/profile', desc: 'Retrieve authenticated profile detail. Requires Session-ID.' }
    ],
    problems: [
      { name: 'Get All Problems', method: 'GET', path: '/api/v1/problems', desc: 'Fetch all active coding problems with filters' },
      { name: 'Get Single Problem', method: 'GET', path: '/api/v1/problems/prob_001', desc: 'Fetch detailed single problem info' },
      { name: 'Get Random Problem', method: 'GET', path: '/api/v1/problems/random', desc: 'Solve a random problem' }
    ],
    topics: [
      { name: 'Get All Topics', method: 'GET', path: '/api/v1/topics', desc: 'Fetch all available topics (arrays, dp, graphs, concurrency)' },
      { name: 'Get Topic Details', method: 'GET', path: '/api/v1/topics/concurrency', desc: 'Fetch detailed single topic meta details' }
    ],
    datasets: [
      { name: 'Get All Datasets', method: 'GET', path: '/api/v1/datasets', desc: 'Fetch all 52 concurrent/algorithmic datasets' },
      { name: 'Get Single Dataset', method: 'GET', path: '/api/v1/datasets/ds_001', desc: 'Get specific dataset payload details' }
    ],
    stats: [
      { name: 'Platform Stats Overview', method: 'GET', path: '/api/v1/stats', desc: 'Aggregated analytics of categories, problem difficulties, and popular topics' }
    ]
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeRequest = async (endpoint) => {
    setLoading(true);
    setResponse(null);
    try {
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': localStorage.getItem('sessionId') || ''
        }
      };
      if (endpoint.method !== 'GET' && endpoint.body) {
        options.body = endpoint.body;
      }
      
      const res = await fetch(`${backendUrl}${endpoint.path}`, options);
      const data = await res.json();
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data
      });
    } catch (e) {
      setResponse({
        status: 'Error',
        data: { message: 'Failed to connect to backend. Make sure backend is running.', details: e.message }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }} className="text-gradient">📡 Go-Epic API Engine</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live interactive documentation. Test actual endpoints from your browser.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveTab(cat); setResponse(null); }}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: activeTab === cat ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                color: activeTab === cat ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories[activeTab].map((endpoint, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                padding: '16px', 
                background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge" style={{
                  background: endpoint.method === 'GET' ? 'rgba(0, 255, 135, 0.1)' : 'rgba(0, 242, 254, 0.1)',
                  color: endpoint.method === 'GET' ? 'var(--accent-green)' : 'var(--primary)',
                  fontSize: '0.7rem'
                }}>
                  {endpoint.method}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{endpoint.name}</span>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {endpoint.desc}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#030712', 
                padding: '6px 10px', 
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                marginTop: '4px'
              }}>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.75rem', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {endpoint.path}
                </span>
                <button 
                  onClick={() => handleCopyUrl(`${backendUrl}${endpoint.path}`)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                  title="Copy full URL"
                >
                  {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Clipboard size={14} />}
                </button>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => executeRequest(endpoint)}
                style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center', marginTop: '6px' }}
                disabled={loading}
              >
                <Play size={14} /> Send Request
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="glass-panel" style={{ 
            flex: 1, 
            background: '#010409', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
            position: 'relative',
            minHeight: '350px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid var(--border-color)', 
              paddingBottom: '10px',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Console Output</span>
              {response && (
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  color: response.status >= 200 && response.status < 300 ? 'var(--accent-green)' : '#ef4444' 
                }}>
                  HTTP {response.status} {response.statusText}
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <span>Sending request...</span>
              </div>
            ) : response ? (
              <pre style={{ 
                fontSize: '0.8rem', 
                overflowX: 'auto', 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-all',
                flex: 1,
                color: 'var(--text-primary)'
              }}>
                {JSON.stringify(response.data, null, 2)}
              </pre>
            ) : (
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '8px' }}>
                <Eye size={28} />
                <span style={{ fontSize: '0.85rem' }}>Select an endpoint and click "Send Request" to see output here.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
