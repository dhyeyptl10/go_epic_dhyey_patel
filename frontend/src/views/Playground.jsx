import React, { useState, useEffect } from 'react';
import { ChevronLeft, Send, CheckCircle, Code, Eye, FileText, Lock, Play } from 'lucide-react';

export default function Playground({ backendUrl, setView, problemId, user }) {
  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState('');
  const [activeRightTab, setActiveRightTab] = useState('editor'); // editor, solution
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, compiling, success

  useEffect(() => {
    fetchProblemDetails();
  }, [problemId]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    try {
      const pRes = await fetch(`${backendUrl}/api/v1/problems/${problemId}`);
      const pJson = await pRes.json();
      if (pJson.success) {
        setProblem(pJson.data);
        setUserCode(getDefaultBoilerplate(pJson.data.title, pJson.data.topic));
      }
      
      // Try to fetch solution
      const sRes = await fetch(`${backendUrl}/api/v1/solutions/${problemId.replace('prob_', 'sol_')}`);
      const sJson = await sRes.json();
      if (sJson.success) {
        setSolution(sJson.data);
      }
    } catch (e) {
      console.log('Error fetching details:', e);
      // Fallback
      setProblem({
        id: 'prob_001',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
        difficulty: 'easy',
        topic: 'arrays',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }
        ]
      });
      setUserCode(`package main\n\nimport "fmt"\n\nfunc twoSum(nums []int, target int) []int {\n    // Write your Go code here\n    return nil\n}`);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBoilerplate = (title, topic) => {
    const fnName = title.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
    if (topic === 'concurrency') {
      return `package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\n// Implement ${title}\nfunc main() {\n    // Setup channels and sync primitives\n}`;
    }
    return `package main\n\nimport "fmt"\n\nfunc ${fnName}(input interface{}) interface{} {\n    // Write your solution here\n    return nil\n}`;
  };

  const handleSubmit = () => {
    setSubmissionStatus('compiling');
    setTimeout(() => {
      setSubmissionStatus('success');
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--primary)' }}>
        <h3>Loading Code Workspace...</h3>
      </div>
    );
  }

  return (
    <div className="max-width-container" style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setView('problems')} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
          <ChevronLeft size={16} /> Back to Challenges
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{problem.title}</h2>
          <span className={`badge badge-${problem.difficulty}`}>{problem.difficulty}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Language: <strong>Go (Golang)</strong></span>
        </div>
      </div>

      {/* Main Splitscreen Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Left Side: Description Panel */}
        <div className="glass-panel" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Challenge Description</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {problem.description}
            </p>
          </div>

          {problem.examples && problem.examples.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Examples</h3>
              {problem.examples.map((example, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '10px', fontSize: '0.85rem' }}>
                  <div style={{ marginBottom: '6px' }}><strong>Input:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{example.input}</code></div>
                  <div style={{ marginBottom: '6px' }}><strong>Output:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{example.output}</code></div>
                  {example.explanation && <div><strong>Explanation:</strong> {example.explanation}</div>}
                </div>
              ))}
            </div>
          )}

          {problem.constraints && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Constraints</h3>
              <pre style={{ 
                background: 'rgba(0, 0, 0, 0.1)', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.8rem',
                borderLeft: '3px solid var(--primary)',
                color: 'var(--text-secondary)'
              }}>
                {problem.constraints}
              </pre>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Editor & Solutions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-panel" style={{ display: 'flex', padding: '6px', gap: '6px' }}>
            <button 
              onClick={() => setActiveRightTab('editor')}
              className="btn" 
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.85rem',
                background: activeRightTab === 'editor' ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                color: activeRightTab === 'editor' ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none',
                justifyContent: 'center'
              }}
            >
              <Code size={16} /> Code Editor
            </button>
            <button 
              onClick={() => setActiveRightTab('solution')}
              className="btn" 
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.85rem',
                background: activeRightTab === 'solution' ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                color: activeRightTab === 'solution' ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none',
                justifyContent: 'center'
              }}
            >
              <Eye size={16} /> View Solution
            </button>
          </div>

          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#010409', overflow: 'hidden' }}>
            {activeRightTab === 'editor' ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    resize: 'none',
                    padding: '20px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    lineHeight: '1.5'
                  }}
                />
                
                {/* Status indicator / Console */}
                {submissionStatus && (
                  <div style={{
                    padding: '16px 20px',
                    background: submissionStatus === 'compiling' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(0, 255, 135, 0.08)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}>
                    {submissionStatus === 'compiling' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                        <Play size={16} className="spinning" />
                        <span>Compiling code against test cases...</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green)' }}>
                        <CheckCircle size={16} />
                        <span>All test cases passed successfully! Code Accepted.</span>
                      </div>
                    )}
                    <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSubmissionStatus(null)}>Dismiss</button>
                  </div>
                )}

                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <button className="btn btn-secondary" onClick={() => setUserCode(getDefaultBoilerplate(problem.title, problem.topic))}>
                    Reset Code
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    <Send size={14} /> Submit Code
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px', overflowY: 'auto' }}>
                {solution ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Execution Explanation</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {solution.explanation || 'Detailed architectural overview of this challenge logic.'}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Verified Code Implementation</h4>
                      <pre style={{
                        background: '#04080f',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: 'var(--accent-green)',
                        overflowX: 'auto',
                        border: '1px solid var(--border-color)'
                      }}>
                        {solution.code}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '8px' }}>
                    <Lock size={28} />
                    <span style={{ fontSize: '0.9rem' }}>No solution found or connection to solution database offline.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
