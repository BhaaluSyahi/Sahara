import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthTabs from './AuthTabs';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordModal from './ForgotPasswordModal';
import useAuthStore from '../store/useAuthStore';
import authService from '../services/authService';
import '../styles/AuthCard.css';

function AuthCard() {
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // Open signup tab if ?tab=signup is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'signup') setActiveTab('signup');
  }, [location.search]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      const userData = authService.getUserFromToken();
      login(userData, response.access_token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password, role) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.register(email, password, role);
      const userData = authService.getUserFromToken();
      login(userData, response.access_token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-panel">
      <div className="auth-card">
        <div className="auth-card__logo">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M24 4L6 12V24C6 33.94 13.94 43.28 24 46C34.06 43.28 42 33.94 42 24V12L24 4Z"
              fill="#2e7d32"
            />
            <path
              d="M20 28l-4-4 1.41-1.41L20 25.17l8.59-8.58L30 18l-10 10z"
              fill="white"
            />
          </svg>
          <h1 className="auth-card__heading">Sahara</h1>
        </div>

        <p className="auth-card__subtitle">Volunteer Matching System</p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div key={activeTab} className="auth-card__form-transition">
          {activeTab === 'login' ? (
            <LoginForm 
              onSuccess={handleLogin} 
              loading={loading}
              onForgotPassword={() => setIsForgotPasswordOpen(true)} 
            />
          ) : (
            <SignUpForm 
              onSuccess={handleRegister} 
              loading={loading}
            />
          )}
        </div>

        <p className="auth-card__legal">
          By using this portal, you agree to our{' '}
          <a href="/terms" className="auth-card__legal-link">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="auth-card__legal-link">Privacy Policy</a>
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}

export default AuthCard;
