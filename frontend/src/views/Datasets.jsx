import React, { useEffect, useState, useRef } from 'react';
import { Search, Database, BarChart3, X, Eye, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';

export default function Datasets({ backendUrl }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  
  const containerRef = useRef(null);

  useEffect(() => {
    fetchDatasets();
  }, [category]);

  const fetchDatasets = () => {
    setLoading(true);
    let url = `${backendUrl}/api/v1/datasets?limit=100`;
    if (category) url += `&category=${category}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setDatasets(resJson.data);
        }
      })
      .catch((e) => {
        console.log('Failed to fetch datasets:', e);
        // Fallback static datasets if backend not running locally
        setDatasets([
          { id: 'ds_001', name: 'Go Concurrency Patterns', description: 'Comprehensive concurrent patterns including worker pools, mutexes, pipelines.', category: 'concurrency', tags: ['go', 'channels'], data: [{ pattern: 'Worker Pool', complexity: 'O(n/w)', useCase: 'Parallel task execution' }] },
          { id: 'ds_002', name: 'Algorithm Complexity Reference', description: 'Reference time and space complexities for most sorting/searching algorithms.', category: 'algorithms', tags: ['reference', 'big-o'], data: [{ algorithm: 'Binary Search', time: 'O(log n)', space: 'O(1)' }] }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!loading && datasets.length > 0) {
      gsap.fromTo(
        '.dataset-card',
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [loading, datasets]);

  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="max-width-container" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>📦 Multi-Core Datasets Hub</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Analyze performance, rate-limit, and complexity benchmarks across 52 curated datasets.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDatasets}>
          <RefreshCw size={16} /> Reload Datasets
        </button>
      </header>

      {/* Toolbar */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search 52 datasets by title or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        <div>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="input-field" 
            style={{ width: '220px', cursor: 'pointer' }}
          >
            <option value="">All Categories</option>
            <option value="concurrency">Concurrency</option>
            <option value="algorithms">Algorithms</option>
            <option value="go-lang">Go Language</option>
            <option value="api-design">API Design</option>
            <option value="system-design">System Design</option>
            <option value="database">Database</option>
            <option value="data-structures">Data Structures</option>
          </select>
        </div>
      </section>

      {/* Grid List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--primary)' }}>
          <h3>Structuring Datasets Engine...</h3>
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No datasets match your filters.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredDatasets.map((ds) => (
            <div 
              key={ds.id} 
              className="glass-panel glass-panel-hover dataset-card"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-basic" style={{ fontSize: '0.65rem' }}>{ds.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Database size={12} /> {ds.data?.length || 0} rows
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{ds.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                {ds.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                {ds.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(0, 242, 254, 0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0, 242, 254, 0.1)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => setSelectedDataset(ds)}
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', marginTop: '10px' }}
              >
                <BarChart3 size={14} /> Analyze Raw Payload
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dataset Details Modal */}
      {selectedDataset && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#0a0f1d'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedDataset.name}</h2>
                <span className="badge badge-basic" style={{ marginTop: '6px' }}>{selectedDataset.category}</span>
              </div>
              <button 
                onClick={() => setSelectedDataset(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                {selectedDataset.description}
              </p>

              {/* Data Table */}
              {selectedDataset.data && selectedDataset.data.length > 0 ? (
                <div className="glass-panel" style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                        {Object.keys(selectedDataset.data[0]).map((key, i) => (
                          <th key={i} style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDataset.data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {Object.values(row).map((val, idx) => (
                            <td key={idx} style={{ padding: '12px 16px', fontFamily: typeof val === 'number' ? 'var(--font-mono)' : 'inherit' }}>
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No data rows available in this dataset.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDataset(null)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
