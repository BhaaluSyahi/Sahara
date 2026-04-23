import React, { useState } from 'react';
import PasswordField from './PasswordField';

function SignUpForm({ onSuccess, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Always register as volunteer - employee accounts are created internally
    onSuccess(email, password, 'volunteer');
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="volunteer-info">
        <h3>Join as a Volunteer</h3>
        <p>Help make a difference in your community by joining our volunteer network.</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          disabled={loading}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <PasswordField
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Create a password"
          disabled={loading}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <PasswordField
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Confirm your password"
          disabled={loading}
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>
      
      <button
        type="submit"
        className={`submit-button ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Join as Volunteer'}
      </button>
    </form>
  );
}

export default SignUpForm;
