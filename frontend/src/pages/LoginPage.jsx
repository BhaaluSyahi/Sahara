import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import AuthTabs from '../components/AuthTabs';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import useAuthStore from '../store/useAuthStore';
import authService from '../services/authService';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      const userData = authService.getUserFromToken();
      login(userData, response.access_token);
      navigate(from, { replace: true });
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
      
      // Redirect volunteers to profile setup, others to dashboard
      if (role === 'volunteer') {
        navigate('/volunteer-profile-setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <AuthCard>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <AuthTabs>
            <LoginForm onSuccess={handleLogin} loading={loading} />
            <SignUpForm onSuccess={handleRegister} loading={loading} />
          </AuthTabs>
          <div className="forgot-password">
            <ForgotPasswordModal />
          </div>
        </AuthCard>
        <div className="login-footer">
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
