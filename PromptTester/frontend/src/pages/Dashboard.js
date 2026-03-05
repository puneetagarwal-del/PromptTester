import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function Dashboard({ prompts, onViewPrompt, onDataChanged }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Name and content are required');
      return;
    }

    if (!formData.content.includes('{input}')) {
      setError('Prompt must contain {input} placeholder');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await axios.post(`${API_BASE}/prompts`, {
        name: formData.name,
        content: formData.content
      });

      setFormData({ name: '', content: '' });
      setShowAddModal(false);
      onDataChanged();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create prompt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (promptId) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await axios.delete(`${API_BASE}/prompts/${promptId}`);
        onDataChanged();
      } catch (err) {
        setError('Failed to delete prompt');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Prompts ({prompts.length})</h2>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + New Prompt
        </button>
      </div>

      {prompts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <p>No prompts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="prompts-grid">
          {prompts.map(prompt => (
            <div key={prompt.id} className="prompt-card" onClick={() => onViewPrompt(prompt.id)}>
              <div className="prompt-name">{prompt.name}</div>
              
              {prompt.last_run ? (
                <div className="prompt-status">
                  <span className="status-pass">
                    ✓ {Math.round(prompt.last_run.pass_rate * 100)}% Pass
                  </span>
                  <span>{prompt.last_run.passed}/{prompt.last_run.total}</span>
                </div>
              ) : (
                <div className="prompt-status">
                  <span className="status-none">Never tested</span>
                </div>
              )}

              {prompt.last_run && (
                <div className="prompt-date">
                  Last tested: {formatDate(prompt.last_run.created_at)}
                </div>
              )}

              <div className="prompt-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn-small"
                  onClick={() => onViewPrompt(prompt.id)}
                >
                  View Results
                </button>
                <button 
                  className="btn-small danger"
                  onClick={() => handleDelete(prompt.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Prompt Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Prompt</h3>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Prompt Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., customer_support_v1"
                />
              </div>

              <div className="form-group">
                <label>Prompt Template</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="You are helpful. Question: {input}&#10;Answer:"
                />
                <small style={{ color: '#64748b', marginTop: '5px', display: 'block' }}>
                  Must include {'{input}'} placeholder
                </small>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
