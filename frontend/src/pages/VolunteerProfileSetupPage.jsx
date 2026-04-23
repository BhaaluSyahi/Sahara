import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import volunteerService from '../services/volunteerService';
import useAuthStore from '../store/useAuthStore';
import '../styles/VolunteerProfileSetupPage.css';

function VolunteerProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    phone: '',
    
    // Step 2: Location
    locationType: 'coordinates', // coordinates or address
    latitude: '',
    longitude: '',
    address: '',
    
    // Step 3: Professional Details
    specialty: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setError('Name is required');
          return false;
        }
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          setError('Please enter a valid phone number');
          return false;
        }
        return true;
      
      case 2:
        if (formData.locationType === 'coordinates') {
          if (!formData.latitude || !formData.longitude) {
            setError('Both latitude and longitude are required');
            return false;
          }
          const lat = parseFloat(formData.latitude);
          const lon = parseFloat(formData.longitude);
          if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            setError('Please enter valid coordinates (Lat: -90 to 90, Lon: -180 to 180)');
            return false;
          }
        } else {
          if (!formData.address.trim()) {
            setError('Address is required');
            return false;
          }
        }
        return true;
      
      case 3:
        if (!formData.specialty.trim()) {
          setError('Specialty is required');
          return false;
        }
        if (!formData.bio.trim()) {
          setError('Bio is required');
          return false;
        }
        if (formData.bio.length < 50) {
          setError('Bio must be at least 50 characters');
          return false;
        }
        if (formData.bio.length > 500) {
          setError('Bio must be less than 500 characters');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare profile data
      const profileData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        specialty: formData.specialty.trim(),
        bio: formData.bio.trim()
      };

      // Add location data based on type
      if (formData.locationType === 'coordinates') {
        profileData.latitude = formData.latitude;
        profileData.longitude = formData.longitude;
      } else {
        // For address-based, we could geocode here, but for now store as is
        profileData.latitude = null;
        profileData.longitude = null;
      }

      await volunteerService.createProfile(profileData);
      
      // Redirect to dashboard after successful profile creation
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ['Basic Info', 'Location', 'Professional', 'Review'];
    return (
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index + 1 === currentStep ? 'active' : index + 1 < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Basic Information</h2>
            <p>Tell us about yourself</p>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
              <small>Optional - helps organizations contact you</small>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Your Location</h2>
            <p>Help us find requests near you</p>
            
            <div className="form-group">
              <label>Location Type</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="locationType"
                    value="coordinates"
                    checked={formData.locationType === 'coordinates'}
                    onChange={handleInputChange}
                  />
                  <span>Use GPS Coordinates</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="locationType"
                    value="address"
                    checked={formData.locationType === 'address'}
                    onChange={handleInputChange}
                  />
                  <span>Use Address</span>
                </label>
              </div>
            </div>

            {formData.locationType === 'coordinates' ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="latitude">Latitude *</label>
                    <input
                      type="text"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="40.7128"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitude">Longitude *</label>
                    <input
                      type="text"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="-74.0060"
                    />
                  </div>
                </div>
                <small>You can get coordinates from Google Maps or your device's GPS</small>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Professional Details</h2>
            <p>Tell us about your skills and experience</p>
            
            <div className="form-group">
              <label htmlFor="specialty">Specialty/Field *</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="e.g., Medical, Education, Engineering, Social Work"
                required
              />
              <small>What's your primary area of expertise?</small>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio *</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your experience, and what kind of volunteer work you're interested in..."
                rows={6}
                maxLength={500}
                required
              />
              <small>{formData.bio.length}/500 characters minimum</small>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content review-step">
            <h2>Review Your Profile</h2>
            <p>Please review your information before submitting</p>
            
            <div className="review-section">
              <h3>Basic Information</h3>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
            </div>

            <div className="review-section">
              <h3>Location</h3>
              {formData.locationType === 'coordinates' ? (
                <p><strong>Coordinates:</strong> {formData.latitude}, {formData.longitude}</p>
              ) : (
                <p><strong>Address:</strong> {formData.address}</p>
              )}
            </div>

            <div className="review-section">
              <h3>Professional Details</h3>
              <p><strong>Specialty:</strong> {formData.specialty}</p>
              <p><strong>Bio:</strong> {formData.bio}</p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
              >
                Edit Information
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="volunteer-profile-setup-page">
      <Navbar />
      <div className="setup-container">
        <div className="setup-header">
          <h1>Complete Your Volunteer Profile</h1>
          <p>This helps us match you with the right opportunities</p>
        </div>

        {renderStepIndicator()}

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="setup-form">
          {renderStepContent()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn btn-secondary"
                disabled={loading}
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default VolunteerProfileSetupPage;
