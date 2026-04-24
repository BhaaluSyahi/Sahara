import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import requestService from '../services/requestService';
import '../styles/RequestsPage.css';

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, closed
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const data = await requestService.getMyRequests(status);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (requestId) => {
    try {
      await requestService.joinRequest(requestId);
      fetchRequests(); // Refresh requests
    } catch (error) {
      console.error('Failed to join request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'closed': return 'status-closed';
      case 'deleted': return 'status-deleted';
      default: return '';
    }
  };

  const getAgentStatusIcon = (agentStatus) => {
    switch (agentStatus) {
      case 'queued':
        return '🔄';
      case 'in_progress':
        return '🔍';
      case 'complete':
        return '✅';
      default:
        return '⏳';
    }
  };

  return (
    <div className="requests-page">
      <Navbar />
      <div className="requests-container">
        <div className="requests-header">
          <h1>My Requests</h1>
          <button 
            className="create-request-btn"
            onClick={() => navigate('/requests/create')}
          >
            Create New Request
          </button>
        </div>

        <div className="requests-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button 
            className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
            onClick={() => setFilter('closed')}
          >
            Closed
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <div className="requests-list">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p>No requests found. Create your first request to get started!</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <h3>{request.title}</h3>
                    <span className={`status ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <p className="request-description">{request.description}</p>
                  
                  {request.location_text && (
                    <div className="request-location">
                      📍 {request.location_text}
                    </div>
                  )}

                  <div className="request-progress">
                    <div className="progress-header">
                      <span>AI Research Progress</span>
                      <span className="agent-status">
                        {getAgentStatusIcon(request.agent_research_status)} 
                        {request.agent_research_status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${request.progress_percent}%` }}
                      />
                    </div>
                    <span className="progress-text">{request.progress_percent}%</span>
                  </div>

                  {request.agent_research_status === 'in_progress' && (
                    <div className="research-indicator">
                      <div className="searching-icon">🔍</div>
                      <span>AI Agent is researching this request...</span>
                    </div>
                  )}

                  {request.recommendations && (
                    <div className="recommendations">
                      <h4>Recommendations:</h4>
                      <ul>
                        {request.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="request-actions">
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/requests/${request.id}`)}
                    >
                      View Details
                    </button>
                    {request.status === 'open' && user?.role === 'volunteer' && (
                      <button 
                        className="join-btn"
                        onClick={() => handleJoinRequest(request.id)}
                      >
                        Join Request
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestsPage;
