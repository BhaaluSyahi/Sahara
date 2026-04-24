import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import requestService from '../services/requestService';
import '../styles/CreateRequestPage.css';

function CreateRequestPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_type: 'online',
    location_text: '',
    latitude: '',
    longitude: '',
    category: 'healthcare'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        return;
      }

      // Prepare request data
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location_type: formData.location_type,
        category: formData.category,
        ...(formData.location_type === 'location' && {
          location_text: formData.location_text.trim(),
          latitude: formData.latitude.trim() || null,
          longitude: formData.longitude.trim() || null
        })
      };

      await requestService.createRequest(requestData);
      setSuccess('Request created successfully!');
      
      // Redirect to requests page after 2 seconds
      setTimeout(() => {
        navigate('/requests');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/requests');
  };

  return (
    <div className="create-request-page">
      <Navbar />
      <div className="create-request-container">
        <div className="create-request-header">
          <h1>Create New Request</h1>
          <p>Fill in the details below to create a new volunteer request</p>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-request-form">
          <div className="form-group">
            <label htmlFor="title">Request Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title for your request"
              required
              maxLength={200}
            />
            <small>Maximum 200 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about what you need help with"
              required
              rows={6}
              maxLength={2000}
            />
            <small>Maximum 2000 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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
            <small>Select the category that best describes your request</small>
          </div>

          <div className="form-group">
            <label htmlFor="location_type">Location Type *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="location_type"
                  value="online"
                  checked={formData.location_type === 'online'}
                  onChange={handleChange}
                />
                <span>Online (Remote)</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="location_type"
                  value="location"
                  checked={formData.location_type === 'location'}
                  onChange={handleChange}
                />
                <span>In-Person Location</span>
              </label>
            </div>
          </div>

          {formData.location_type === 'location' && (
            <>
              <div className="form-group">
                <label htmlFor="location_text">Location Details</label>
                <input
                  type="text"
                  id="location_text"
                  name="location_text"
                  value={formData.location_text}
                  onChange={handleChange}
                  placeholder="Enter address or location description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">Latitude (Optional)</label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 40.7128"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Longitude (Optional)</label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRequestPage;
