import React, { useState } from 'react';
import PasswordField from './PasswordField';

function LoginForm({ onSuccess, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSuccess(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          disabled={loading}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <PasswordField
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>
      
      <button
        type="submit"
        className={`submit-button ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;
