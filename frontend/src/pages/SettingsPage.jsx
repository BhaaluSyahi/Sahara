import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import '../styles/SettingsPage.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    requestUpdates: true,
    organizationUpdates: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showContactInfo: false,
    allowDirectMessages: true
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', { notifications, privacy });
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button
              className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy
            </button>
            <button
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'account' && (
              <div className="account-settings">
                <h2>Account Settings</h2>
                
                <div className="setting-group">
                  <h3>Email</h3>
                  <p>{user?.email}</p>
                  <button className="change-btn">Change Email</button>
                </div>

                <div className="setting-group">
                  <h3>Password</h3>
                  <p>••••••••</p>
                  <button className="change-btn">Change Password</button>
                </div>

                <div className="setting-group">
                  <h3>Account Type</h3>
                  <p className="role-display">{user?.role}</p>
                </div>

                <div className="setting-group danger">
                  <h3>Danger Zone</h3>
                  <button className="delete-account-btn">Delete Account</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="notification-settings">
                <h2>Notification Preferences</h2>
                
                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        emailNotifications: e.target.checked
                      })}
                    />
                    <span>Email Notifications</span>
                  </label>
                  <p>Receive email updates about your requests and activities</p>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        pushNotifications: e.target.checked
                      })}
                    />
                    <span>Push Notifications</span>
                  </label>
                  <p>Receive browser notifications for important updates</p>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={notifications.requestUpdates}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        requestUpdates: e.target.checked
                      })}
                    />
                    <span>Request Updates</span>
                  </label>
                  <p>Get notified when your requests are updated</p>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={notifications.organizationUpdates}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        organizationUpdates: e.target.checked
                      })}
                    />
                    <span>Organization Updates</span>
                  </label>
                  <p>Get notified about organization activities</p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="privacy-settings">
                <h2>Privacy Settings</h2>
                
                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={privacy.profileVisible}
                      onChange={(e) => setPrivacy({
                        ...privacy,
                        profileVisible: e.target.checked
                      })}
                    />
                    <span>Profile Visibility</span>
                  </label>
                  <p>Make your profile visible to other users</p>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={privacy.showContactInfo}
                      onChange={(e) => setPrivacy({
                        ...privacy,
                        showContactInfo: e.target.checked
                      })}
                    />
                    <span>Show Contact Information</span>
                  </label>
                  <p>Display your contact info in your profile</p>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={privacy.allowDirectMessages}
                      onChange={(e) => setPrivacy({
                        ...privacy,
                        allowDirectMessages: e.target.checked
                      })}
                    />
                    <span>Allow Direct Messages</span>
                  </label>
                  <p>Let other users send you direct messages</p>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-settings">
                <h2>About Sahara</h2>
                
                <div className="about-section">
                  <h3>Version</h3>
                  <p>Sahara Volunteer Matching System v1.0.0</p>
                </div>

                <div className="about-section">
                  <h3>Mission</h3>
                  <p>Connecting volunteers with organizations to make a positive impact in communities.</p>
                </div>

                <div className="about-section">
                  <h3>Features</h3>
                  <ul>
                    <li>Volunteer profile management</li>
                    <li>Organization creation and management</li>
                    <li>Request tracking with AI-powered research</li>
                    <li>Real-time status updates</li>
                    <li>Bidirectional rating system</li>
                  </ul>
                </div>

                <div className="about-section">
                  <h3>Support</h3>
                  <p>For help and support, contact us at support@sahara.org</p>
                </div>

                <div className="about-section">
                  <h3>Legal</h3>
                  <div className="legal-links">
                    <a href="/terms">Terms of Service</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/cookies">Cookie Policy</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="settings-actions">
            <button className="save-btn" onClick={handleSaveSettings}>
              Save Changes
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
