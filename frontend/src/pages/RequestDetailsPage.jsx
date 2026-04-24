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
  const [retrying, setRetrying] = useState(false);
  const [retryCategory, setRetryCategory] = useState('');
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [canViewParticipants, setCanViewParticipants] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
    fetchParticipants();
    checkUserRole();
  }, [requestId]);

  useEffect(() => {
    checkParticipantAccess();
  }, [request, userRole, isOwner]);

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

  const handleRetryRequest = async () => {
    if (!retryCategory) {
      setError('Please select a category for retry');
      return;
    }

    setRetrying(true);
    setError('');

    try {
      await requestService.retryRequest(requestId, retryCategory);
      // Refresh request details
      await fetchRequestDetails();
      setShowRetryModal(false);
      setRetryCategory('healthcare');
    } catch (error) {
      setError(error.message || 'Failed to retry request');
    } finally {
      setRetrying(false);
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

  const checkParticipantAccess = async () => {
    if (!request || !userRole) return;
    
    setCheckingAccess(true);
    try {
      // If user is the issuer, they can view participants
      if (isOwner) {
        setCanViewParticipants(true);
        return;
      }
      
      // If issuer is an organization, check if user is a member
      if (request.issuer_type === 'organization') {
        const token = localStorage.getItem('sahara_token');
        if (token) {
          try {
            const response = await fetch(`/api/v1/organizations/${request.issuer_id}/membership-check`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            setCanViewParticipants(data.is_member);
          } catch (error) {
            console.error('Error checking organization membership:', error);
            setCanViewParticipants(false);
          }
        }
      } else {
        // If issuer is a volunteer and user is not the issuer, they can't view participants
        setCanViewParticipants(false);
      }
    } finally {
      setCheckingAccess(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
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
          
          {checkingAccess ? (
            <p className="loading-participants">Checking access permissions...</p>
          ) : participants.length === 0 ? (
            <p className="no-participants">No participants yet.</p>
          ) : canViewParticipants ? (
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant.id} className="participant-card">
                  <div className="participant-info">
                    <h3>{participant.volunteer_name || 'Anonymous Volunteer'}</h3>
                    <p>Role: {participant.role}</p>
                    <p>Joined: {formatDate(participant.joined_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="participants-summary">
              <p>{participants.length} participant{participants.length !== 1 ? 's' : ''} have joined this request.</p>
              <p>Contact the request issuer for more details about participants.</p>
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
              {request.agent_research_status === 'failed' && (
                <button
                  onClick={() => setShowRetryModal(true)}
                  className="btn btn-warning"
                >
                  Retry Request
                </button>
              )}
            </div>
          )}
        </div>

        {/* Retry Modal */}
        {showRetryModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Retry Failed Request</h3>
              <p>Your request failed to process. Please select a new category and try again.</p>
              
              <div className="form-group">
                <label htmlFor="retryCategory">Category *</label>
                <select
                  id="retryCategory"
                  value={retryCategory}
                  onChange={(e) => setRetryCategory(e.target.value)}
                  required
                >
                  <option value="flood">Flood</option>
                  <option value="drought">Drought</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="welfare">Welfare</option>
                  <option value="livelihood">Livelihood</option>
                  <option value="environment">Environment</option>
                  <option value="disaster">Disaster</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowRetryModal(false);
                    setRetryCategory('healthcare');
                  }}
                  className="btn btn-secondary"
                  disabled={retrying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetryRequest}
                  className="btn btn-primary"
                  disabled={retrying}
                >
                  {retrying ? 'Retrying...' : 'Retry Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestDetailsPage;
