import { useState } from 'react';
import '../styles/ForgotPasswordModal.css';

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');
    // TODO: wire up reset link API
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fpm-overlay" onClick={handleClose}>
      <div className="fpm-card" onClick={(e) => e.stopPropagation()}>
        <button className="fpm-close" aria-label="Close" onClick={handleClose}>
          &times;
        </button>
        <h2 className="fpm-title">Reset Password</h2>
        <p className="fpm-description">
          Enter your email address and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="fpm-field">
            <label htmlFor="fpm-email" className="fpm-label">Email</label>
            <input
              id="fpm-email"
              type="email"
              className={`fpm-input${error ? ' fpm-input--error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@example.com"
            />
            {error && <span className="fpm-error">{error}</span>}
          </div>
          <button type="submit" className="fpm-submit">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
