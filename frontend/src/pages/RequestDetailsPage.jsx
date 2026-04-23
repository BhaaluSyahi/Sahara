import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import requestService from '../services/requestService';
import volunteerService from '../services/volunteerService';
import '../styles/RequestDetailsPage.css';

function RequestDetailsPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
    fetchParticipants();
    checkUserRole();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      const data = await requestService.getRequest(requestId);
      setRequest(data);
      
      // Check if current user is the owner
      const token = localStorage.getItem('sahara_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsOwner(payload.sub === data.issuer_id);
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch request details');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const data = await requestService.getRequestParticipants(requestId);
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  };

  const checkUserRole = () => {
    const token = localStorage.getItem('sahara_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || '');
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  };

  const handleJoinRequest = async () => {
    if (userRole !== 'volunteer') {
      setError('Only volunteers can join requests');
      return;
    }

    setJoining(true);
    setError('');

    try {
      await requestService.joinRequest(requestId);
      // Refresh participants list
      await fetchParticipants();
    } catch (error) {
      if (error.message?.includes('Volunteer profile required')) {
        setError('You need to create a volunteer profile first. Go to Profile page to set up your profile.');
      } else if (error.message?.includes('not open for joining')) {
        setError('This request is not currently open for joining.');
      } else if (error.message?.includes('Request not found')) {
        setError('Request not found or has been deleted.');
      } else {
        setError(error.message || 'Failed to join request');
      }
    } finally {
      setJoining(false);
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
      case 'queued': return '🔄';
      case 'in_progress': return '🔍';
      case 'complete': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="request-details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="request-details-page">
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/requests')} className="btn btn-primary">
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-details-page">
      <Navbar />
      <div className="request-details-container">
        <div className="request-header">
          <div className="request-breadcrumb">
            <button onClick={() => navigate('/requests')} className="breadcrumb-link">
              ← Back to Requests
            </button>
          </div>
          
          <div className="request-title-section">
            <h1>{request.title}</h1>
            <div className="request-meta">
              <span className={`status-badge ${getStatusColor(request.status)}`}>
                {request.status.toUpperCase()}
              </span>
              <span className="request-type">
                {request.location_type === 'online' ? '🌐 Online' : '📍 In-Person'}
              </span>
              {request.agent_status && (
                <span className="agent-status">
                  {getAgentStatusIcon(request.agent_status)} AI Status
                </span>
              )}
            </div>
          </div>

          <div className="request-info">
            <div className="info-item">
              <strong>Created:</strong> {formatDate(request.created_at)}
            </div>
            <div className="info-item">
              <strong>Updated:</strong> {formatDate(request.updated_at)}
            </div>
            <div className="info-item">
              <strong>Issuer Type:</strong> {request.issuer_type}
            </div>
            {request.progress_percent !== undefined && (
              <div className="info-item">
                <strong>Progress:</strong> {request.progress_percent}%
              </div>
            )}
          </div>
        </div>

        <div className="request-content">
          <div className="request-description">
            <h2>Description</h2>
            <div className="description-content">
              {request.description}
            </div>
          </div>

          {request.location_type === 'location' && (
            <div className="request-location">
              <h2>Location Details</h2>
              {request.location_text && (
                <p><strong>Address:</strong> {request.location_text}</p>
              )}
              {(request.latitude && request.longitude) && (
                <p>
                  <strong>Coordinates:</strong> {request.latitude}, {request.longitude}
                </p>
              )}
            </div>
          )}

          {request.recommendations && (
            <div className="request-recommendations">
              <h2>AI Recommendations</h2>
              <div className="recommendations-content">
                {typeof request.recommendations === 'string' 
                  ? request.recommendations 
                  : JSON.stringify(request.recommendations, null, 2)
                }
              </div>
            </div>
          )}

          {request.infoboard && (
            <div className="request-infoboard">
              <h2>Research Board</h2>
              <div className="infoboard-content">
                {typeof request.infoboard === 'string' 
                  ? request.infoboard 
                  : JSON.stringify(request.infoboard, null, 2)
                }
              </div>
            </div>
          )}
        </div>

        <div className="request-participants">
          <h2>Participants ({participants.length})</h2>
          
          {participants.length === 0 ? (
            <p className="no-participants">No participants yet.</p>
          ) : (
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant.id} className="participant-card">
                  <div className="participant-info">
                    <h3>{participant.volunteer_name || 'Anonymous Volunteer'}</h3>
                    <p>Role: {participant.role}</p>
                    <p>Joined: {formatDate(participant.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="request-actions">
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {request.status === 'open' && userRole === 'volunteer' && !isOwner && (
            <button
              onClick={handleJoinRequest}
              className="btn btn-primary"
              disabled={joining}
            >
              {joining ? 'Joining...' : 'Join This Request'}
            </button>
          )}

          {isOwner && (
            <div className="owner-actions">
              <button
                onClick={() => navigate(`/requests/${requestId}/edit`)}
                className="btn btn-secondary"
              >
                Edit Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestDetailsPage;
