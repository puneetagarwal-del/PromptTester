import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';
import PromptDetail from './pages/PromptDetail';
import TestCaseManager from './pages/TestCaseManager';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [promptsRes, testCasesRes] = await Promise.all([
        axios.get(`${API_BASE}/prompts`),
        axios.get(`${API_BASE}/test-cases`)
      ]);
      setPrompts(promptsRes.data.prompts || []);
      setTestCases(testCasesRes.data.test_cases || []);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrompt = (promptId) => {
    setSelectedPromptId(promptId);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setSelectedPromptId(null);
    setCurrentPage('dashboard');
    loadData();
  };

  const handleTestCasesUpdated = () => {
    loadData();
  };

  return (
    <div className="App">
      <header className="header">
        <h1>PromptTester</h1>
        <nav className="nav">
          <button 
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('dashboard'); handleBack(); }}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${currentPage === 'test-cases' ? 'active' : ''}`}
            onClick={() => setCurrentPage('test-cases')}
          >
            Test Cases
          </button>
        </nav>
      </header>

      <main className="main">
        {error && <div className="error-banner">{error}</div>}
        
        {loading && <div className="loading">Loading...</div>}

        {!loading && currentPage === 'dashboard' && (
          <Dashboard 
            prompts={prompts} 
            onViewPrompt={handleViewPrompt}
            onDataChanged={loadData}
          />
        )}

        {!loading && currentPage === 'detail' && selectedPromptId && (
          <PromptDetail 
            promptId={selectedPromptId}
            onBack={handleBack}
            testCases={testCases}
          />
        )}

        {!loading && currentPage === 'test-cases' && (
          <TestCaseManager 
            testCases={testCases}
            onUpdated={handleTestCasesUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default App;
