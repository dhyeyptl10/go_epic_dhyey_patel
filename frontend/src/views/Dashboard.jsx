import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Play, Sparkles, Terminal, Award, HelpCircle } from 'lucide-react';

export default function Dashboard({ backendUrl, setView, setSelectedTopic, user }) {
  const [stats, setStats] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch live stats from API
    fetch(`${backendUrl}/api/v1/stats`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setStats(resJson.data);
        }
      })
      .catch((err) => console.log('Stats fetch error:', err));
  }, [backendUrl]);

  useEffect(() => {
    // GSAP animations for cards
    const ctx = gsap.context(() => {
      gsap.from('.stagger-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [stats]);

  const fallbackStats = {
    problemsCount: 10,
    topicsCount: 7,
    solutionsCount: 10,
    datasetsCount: 52
  };

  const currentStats = stats || fallbackStats;

  return (
    <div ref={containerRef} className="max-width-container" style={{ paddingBottom: '60px' }}>
      {/* Hero Header */}
      <header className="stagger-card" style={{
        textAlign: 'center',
        padding: '80px 20px 60px 20px',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.08)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: '20px'
        }}>
          <Sparkles size={14} /> Interactive Algorithms & Concurrency Engine
        </div>
        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          Master Go Concurrency & <br />
          <span className="text-gradient">Algorithms</span> Elegantly
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 30px auto',
          lineHeight: '1.6'
        }}>
          Analyze performance of 52 multi-core datasets, resolve concurrency challenges, and master algorithmic layouts with detailed execution solutions.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button onClick={() => setView('problems')} className="btn btn-primary" style={{ padding: '12px 28px' }}>
            <Terminal size={18} /> Enter Code Lab
          </button>
          <button onClick={() => setView('datasets')} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
            Explore Datasets
          </button>
        </div>
      </header>

      {/* Stats Counter Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        margin: '20px 0 60px 0'
      }}>
        <div className="glass-panel glass-panel-hover stagger-card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{currentStats.problemsCount}</span>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Interactive Problems</h4>
        </div>
        <div className="glass-panel glass-panel-hover stagger-card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{currentStats.topicsCount}</span>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Core Modules</h4>
        </div>
        <div className="glass-panel glass-panel-hover stagger-card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{currentStats.solutionsCount}</span>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Verified Solutions</h4>
        </div>
        <div className="glass-panel glass-panel-hover stagger-card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-orange)' }}>{currentStats.datasetsCount}</span>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Analysis Datasets</h4>
        </div>
      </section>

      {/* Topics Grid Overview */}
      <section style={{ marginTop: '40px' }} className="stagger-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>📚 Core Syllabus</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Jump straight into topics</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {[
            { id: '1', title: 'Concurrency', desc: 'Goroutines, buffered channels, sync.Mutex, error groups and execution pipelines.', badge: 'Advanced', difficulty: 'hard' },
            { id: '2', title: 'Dynamic Programming', desc: 'Tabulation & memoization paradigms for subset sum, LCS, and knapsack challenges.', badge: 'Medium', difficulty: 'medium' },
            { id: '3', title: 'Graphs & BFS/DFS', desc: 'Shortest path searches (Dijkstra), topological sorts, and cycle detections.', badge: 'Advanced', difficulty: 'hard' },
            { id: '4', title: 'Arrays & Two Pointers', desc: 'Linear structures, sliding windows, and contiguous array optimizations.', badge: 'Basic', difficulty: 'easy' }
          ].map((topic, index) => (
            <div 
              key={index} 
              className="glass-panel glass-panel-hover" 
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${topic.difficulty}`}>{topic.badge}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Module 0{index + 1}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{topic.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                {topic.desc}
              </p>
              <button 
                onClick={() => {
                  setSelectedTopic(topic.title.toLowerCase().replace(' & ', '-'));
                  setView('problems');
                }}
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center', marginTop: '10px' }}
              >
                Start Coding <Play size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
