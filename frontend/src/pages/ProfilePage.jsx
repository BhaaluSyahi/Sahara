import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import volunteerService from '../services/volunteerService';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'volunteer') {
      fetchVolunteerProfile();
    } else {
      setProfile({ user });
      setLoading(false);
    }
  }, [user]);

  const fetchVolunteerProfile = async () => {
    try {
      const data = await volunteerService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      // Profile doesn't exist, set to null to show creation prompt
      setProfile(null);
      setFormData({
        name: '',
        phone: '',
        latitude: '',
        longitude: '',
        specialty: '',
        bio: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      if (profile) {
        // Update existing profile
        await volunteerService.updateProfile(formData);
      } else {
        // Create new profile
        await volunteerService.createProfile(formData);
      }
      
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="profile-actions">
            {user?.role === 'volunteer' && (
              <button 
                className="edit-btn"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="user-info">
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span className="role-badge">{user?.role}</span>
            </div>
          </div>

          {user?.role === 'volunteer' && (
            <div className="volunteer-profile">
              <h2>Volunteer Profile</h2>
              
              {!profile && !editing ? (
                <div className="no-profile">
                  <p>You haven't created your volunteer profile yet.</p>
                  <p>Creating a profile helps us match you with the right volunteer opportunities.</p>
                  <button 
                    className="create-profile-btn"
                    onClick={() => setEditing(true)}
                  >
                    Create Profile
                  </button>
                </div>
              ) : editing ? (
                <form className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialty">Specialty</label>
                    <input
                      id="specialty"
                      type="text"
                      value={formData.specialty || ''}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      placeholder="e.g., Healthcare, Education, Technical"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      placeholder="Tell us about yourself and how you'd like to help..."
                    />
                  </div>

                  <div className="location-group">
                    <div className="form-group">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        id="latitude"
                        type="text"
                        value={formData.latitude || ''}
                        onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        placeholder="Optional: Your location latitude"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        id="longitude"
                        type="text"
                        value={formData.longitude || ''}
                        onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        placeholder="Optional: Your location longitude"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="save-btn"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (profile ? 'Save Changes' : 'Create Profile')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  {profile ? (
                    <>
                      <div className="info-item">
                        <label>Name:</label>
                        <span>{profile.name || 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone:</label>
                        <span>{profile.phone || 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <label>Specialty:</label>
                        <span>{profile.specialty || 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <label>Bio:</label>
                        <span>{profile.bio || 'Not set'}</span>
                      </div>
                      {(profile.latitude || profile.longitude) && (
                        <div className="info-item">
                          <label>Location:</label>
                          <span>
                            {profile.latitude && `Lat: ${profile.latitude}`}
                            {profile.latitude && profile.longitude && ', '}
                            {profile.longitude && `Lng: ${profile.longitude}`}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-profile">
                      <p>You haven't created your volunteer profile yet.</p>
                      <button 
                        className="create-profile-btn"
                        onClick={() => setEditing(true)}
                      >
                        Create Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {user?.role === 'employee' && (
            <div className="employee-info">
              <h2>Employee Dashboard</h2>
              <div className="employee-actions">
                <button 
                  className="action-btn"
                  onClick={() => navigate('/organizations')}
                >
                  Manage Organizations
                </button>
                <button 
                  className="action-btn"
                  onClick={() => navigate('/requests')}
                >
                  View Requests
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
