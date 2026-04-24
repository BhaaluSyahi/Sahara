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
      // Handle different types of errors more gracefully
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Database connection failed')) {
          errorMessage = 'Service temporarily unavailable. Please try again in a few moments.';
        } else if (error.message.includes('Login failed')) {
          errorMessage = 'Login failed. Please check your information and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
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
      // Handle different types of errors more gracefully
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Email already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.message.includes('Database connection failed')) {
          errorMessage = 'Service temporarily unavailable. Please try again in a few moments.';
        } else if (error.message.includes('Registration failed')) {
          errorMessage = 'Registration failed. Please check your information and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
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
