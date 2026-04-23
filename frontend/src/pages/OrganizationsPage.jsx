import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import '../styles/OrganizationsPage.css';

function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/v1/organizations');
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (formData) => {
    try {
      await api.post('/api/v1/organizations', formData);
      setShowCreateForm(false);
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const getVerificationStatus = (verified) => {
    return verified ? 'verified' : 'pending';
  };

  const getOrgTypeLabel = (type) => {
    switch (type) {
      case 'village': return 'Village Council';
      case 'ngo': return 'NGO';
      case 'other': return 'Other Organization';
      default: return type;
    }
  };

  return (
    <div className="organizations-page">
      <Navbar />
      <div className="organizations-container">
        <div className="organizations-header">
          <h1>Organizations</h1>
          {user?.role === 'employee' && (
            <button 
              className="create-org-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Organization
            </button>
          )}
        </div>

        {showCreateForm && (
          <CreateOrganizationForm 
            onSubmit={handleCreateOrganization}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {loading ? (
          <div className="loading">Loading organizations...</div>
        ) : (
          <div className="organizations-list">
            {organizations.length === 0 ? (
              <div className="empty-state">
                <p>No organizations found.</p>
                {user?.role === 'employee' && (
                  <button 
                    className="create-first-org-btn"
                    onClick={() => setShowCreateForm(true)}
                  >
                    Create the first organization
                  </button>
                )}
              </div>
            ) : (
              organizations.map(org => (
                <div key={org.id} className="organization-card">
                  <div className="org-header">
                    <h3>{org.name}</h3>
                    <div className="org-badges">
                      <span className={`verification-status ${getVerificationStatus(org.verified)}`}>
                        {org.verified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                      <span className="org-type">{getOrgTypeLabel(org.type)}</span>
                    </div>
                  </div>
                  
                  {org.description && (
                    <p className="org-description">{org.description}</p>
                  )}

                  <div className="org-stats">
                    <div className="stat">
                      <span className="stat-label">Members</span>
                      <span className="stat-value">{org.member_count || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Active Requests</span>
                      <span className="stat-value">{org.active_requests || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Documents</span>
                      <span className="stat-value">{org.document_count || 0}</span>
                    </div>
                  </div>

                  <div className="org-actions">
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/organizations/${org.id}`)}
                    >
                      View Details
                    </button>
                    {user?.role === 'volunteer' && org.verified && (
                      <button className="join-btn">
                        Join Organization
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

function CreateOrganizationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'village',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="create-org-modal">
      <div className="modal-content">
        <h2>Create Organization</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="org-name">Organization Name</label>
            <input
              id="org-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="org-type">Organization Type</label>
            <select
              id="org-type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="village">Village Council</option>
              <option value="ngo">NGO</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="org-description">Description</label>
            <textarea
              id="org-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              placeholder="Describe your organization's mission and activities..."
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrganizationsPage;
