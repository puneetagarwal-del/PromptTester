import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function PromptDetail({ promptId, onBack, testCases }) {
  const [prompt, setPrompt] = useState(null);
  const [latestRun, setLatestRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrompt();
  }, [promptId]);

  const loadPrompt = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/prompts/${promptId}`);
      setPrompt(response.data);
      
      if (response.data.test_runs && response.data.test_runs.length > 0) {
        setLatestRun(response.data.test_runs[0]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load prompt: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTests = async () => {
    if (testCases.length === 0) {
      setError('No test cases available. Please add test cases first.');
      return;
    }

    try {
      setRunning(true);
      setError(null);

      const response = await axios.post(`${API_BASE}/test-runs`, {
        prompt_id: promptId
      });

      setLatestRun(response.data);
      loadPrompt();
    } catch (err) {
      setError('Failed to run tests: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading prompt...</div>;
  }

  if (!prompt) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Prompt not found</p>
        <button className="btn-back" onClick={onBack}>Back</button>
      </div>
    );
  }

  const passRate = latestRun ? Math.round(latestRun.pass_rate * 100) : 0;

  return (
    <div className="prompt-detail">
      <div className="detail-header">
        <div>
          <h2>{prompt.name}</h2>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>
            Created: {new Date(prompt.created_at).toLocaleString()}
          </p>
        </div>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stats */}
      {latestRun && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Pass Rate</div>
            <div className="stat-value">{passRate}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Passed</div>
            <div className="stat-value">{latestRun.passed}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value fail">{latestRun.failed}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{latestRun.total_tests}</div>
          </div>
        </div>
      )}

      {/* Prompt Content */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#e2e8f0' }}>Prompt Template</h3>
        <pre style={{ 
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '10px',
          borderRadius: '4px',
          color: '#cbd5e1',
          fontSize: '12px',
          overflowX: 'auto'
        }}>
          {prompt.content}
        </pre>
      </div>

      {/* Run Tests Button */}
      <button 
        className="btn-submit"
        onClick={handleRunTests}
        disabled={running}
        style={{ marginBottom: '30px' }}
      >
        {running ? 'Running Tests...' : 'Run Tests'}
      </button>

      {/* Test Results */}
      {latestRun && latestRun.results && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#e2e8f0' }}>Test Results</h3>
          <div className="test-results">
            {latestRun.results.map((result, idx) => (
              <div 
                key={idx}
                className={`test-result ${result.passed ? 'pass' : 'fail'}`}
              >
                <div className="test-header">
                  <span className="test-id">{result.test_id}</span>
                  <div>
                    <span className={`test-status ${result.passed ? 'pass' : 'fail'}`}>
                      {result.passed ? '✓ PASS' : '✗ FAIL'}
                    </span>
                    <span className="test-score">
                      {' '}({Math.round(result.similarity_score * 100)}% similar)
                    </span>
                  </div>
                </div>

                <div className="test-detail-row">
                  <div className="test-detail-label">Input:</div>
                  <div className="test-detail-value">{result.expected}</div>
                </div>

                <div className="test-detail-row">
                  <div className="test-detail-label">Expected Output:</div>
                  <div className="test-detail-value">{result.expected}</div>
                </div>

                <div className="test-detail-row">
                  <div className="test-detail-label">Actual Output:</div>
                  <div className="test-detail-value">{result.actual}</div>
                </div>

                {result.reasoning && (
                  <div className="test-detail-row">
                    <div className="test-detail-label">Reasoning:</div>
                    <div className="test-detail-value">{result.reasoning}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!latestRun && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#94a3b8'
        }}>
          <p>No test results yet. Click "Run Tests" to get started!</p>
        </div>
      )}
    </div>
  );
}

export default PromptDetail;
