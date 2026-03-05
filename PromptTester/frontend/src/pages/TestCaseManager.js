import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function TestCaseManager({ testCases, onUpdated }) {
  const [formData, setFormData] = useState({ test_id: '', input: '', expected_output: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.test_id.trim() || !formData.input.trim() || !formData.expected_output.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await axios.post(`${API_BASE}/test-cases`, {
        test_id: formData.test_id,
        input: formData.input,
        expected_output: formData.expected_output
      });

      setFormData({ test_id: '', input: '', expected_output: '' });
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create test case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (testCaseId) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        await axios.delete(`${API_BASE}/test-cases/${testCaseId}`);
        onUpdated();
      } catch (err) {
        setError('Failed to delete test case');
      }
    }
  };

  return (
    <div className="test-case-manager">
      <h2 style={{ marginBottom: '30px' }}>Test Cases ({testCases.length})</h2>

      {error && <div className="error-banner">{error}</div>}

      {/* Add Test Case Form */}
      <div className="form-section">
        <h3 style={{ margin: '0 0 20px 0', color: '#e2e8f0' }}>Add New Test Case</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test ID</label>
            <input 
              type="text"
              name="test_id"
              value={formData.test_id}
              onChange={handleInputChange}
              placeholder="e.g., test_001"
            />
          </div>

          <div className="form-group">
            <label>Input (Question)</label>
            <textarea 
              name="input"
              value={formData.input}
              onChange={handleInputChange}
              placeholder="What should be asked to the prompt?"
            />
          </div>

          <div className="form-group">
            <label>Expected Output</label>
            <textarea 
              name="expected_output"
              value={formData.expected_output}
              onChange={handleInputChange}
              placeholder="What should the prompt respond with?"
            />
          </div>

          <button 
            type="submit"
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Test Case'}
          </button>
        </form>
      </div>

      {/* Test Cases List */}
      <div>
        <h3 style={{ margin: '30px 0 20px 0', color: '#e2e8f0' }}>Test Cases</h3>

        {testCases.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#94a3b8'
          }}>
            <p>No test cases yet. Add your first one above!</p>
          </div>
        ) : (
          <div className="test-cases-list">
            {testCases.map(testCase => (
              <div key={testCase.id} className="test-case-item">
                <div className="test-case-info">
                  <div className="test-case-id">{testCase.test_id}</div>
                  <div className="test-case-input">
                    <strong>Input:</strong> {testCase.input}
                  </div>
                  <div className="test-case-expected">
                    <strong>Expected:</strong> {testCase.expected_output}
                  </div>
                </div>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(testCase.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCaseManager;
