import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';

export default function Problems({ backendUrl, setView, setSelectedProblemId, selectedTopic, setSelectedTopic, user }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState(selectedTopic || '');
  const [source, setSource] = useState('');
  
  const containerRef = useRef(null);

  useEffect(() => {
    fetchProblems();
  }, [difficulty, topic, source]);

  const fetchProblems = () => {
    setLoading(true);
    let url = `${backendUrl}/api/v1/problems?`;
    if (difficulty) url += `difficulty=${difficulty}&`;
    if (topic) url += `topic=${topic}&`;
    if (source) url += `source=${source}&`;
    
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setProblems(resJson.data);
          setError(null);
        } else {
          setError(resJson.message);
        }
      })
      .catch((e) => {
        setError('Failed to reach backend API. Load fallback database.');
        // Fallback mockup
        setProblems([
          { id: 'prob_001', title: 'Two Sum', difficulty: 'easy', topic: 'arrays', source: 'leetcode', tags: ['arrays', 'hash-map'] },
          { id: 'prob_002', title: 'Longest Common Subsequence', difficulty: 'medium', topic: 'dynamic-programming', source: 'leetcode', tags: ['dp', 'strings'] },
          { id: 'prob_003', title: 'Mutex-Based Worker Pool', difficulty: 'hard', topic: 'concurrency', source: 'ultimate', tags: ['concurrency', 'mutex'] }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!loading && problems.length > 0) {
      gsap.fromTo(
        '.problem-row',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, problems]);

  const handleSolve = (id) => {
    setSelectedProblemId(id);
    setView('playground');
  };

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="max-width-container" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>💻 Coding Challenge Lab</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Browse algorithms & concurrency challenges. Write codes and view verified solutions.
        </p>
      </header>

      {/* Filter Toolbar */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search problems by name or tag..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            className="input-field" 
            style={{ width: '140px', cursor: 'pointer' }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="advanced">Advanced</option>
          </select>

          <select 
            value={topic} 
            onChange={(e) => { setTopic(e.target.value); setSelectedTopic(e.target.value); }} 
            className="input-field" 
            style={{ width: '160px', cursor: 'pointer' }}
          >
            <option value="">All Topics</option>
            <option value="arrays">Arrays</option>
            <option value="dynamic-programming">Dynamic Prog</option>
            <option value="concurrency">Concurrency</option>
            <option value="trees">Trees</option>
            <option value="graphs">Graphs</option>
            <option value="linked-lists">Linked Lists</option>
            <option value="stacks">Stacks</option>
          </select>

          <select 
            value={source} 
            onChange={(e) => setSource(e.target.value)} 
            className="input-field" 
            style={{ width: '130px', cursor: 'pointer' }}
          >
            <option value="">All Sources</option>
            <option value="leetcode">LeetCode</option>
            <option value="ultimate">Ultimate</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </section>

      {/* Main Problems List */}
      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <AlertCircle size={20} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '0.9rem', color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--primary)' }}>
          <h3>Compiling Lab Environment...</h3>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No coding challenges match your search rules.</h3>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setDifficulty(''); setTopic(''); setSource(''); setSelectedTopic(''); }} style={{ marginTop: '16px' }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHALLENGE NAME</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOPIC</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIFFICULTY</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>SOURCE</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr 
                  key={problem.id} 
                  className="problem-row" 
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => handleSolve(problem.id)}
                >
                  <td style={{ padding: '18px 24px' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--text-muted)' }} />
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {problem.title}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {problem.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px', textTransform: 'capitalize', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {problem.topic.replace('-', ' ')}
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <span className={`badge badge-${problem.difficulty}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {problem.source}
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={(e) => { e.stopPropagation(); handleSolve(problem.id); }}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      Solve <Play size={10} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
