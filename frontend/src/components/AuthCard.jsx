import { useState } from 'react';
import AuthTabs from './AuthTabs';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import GoogleAuthButton from './GoogleAuthButton';
import ForgotPasswordModal from './ForgotPasswordModal';
import '../styles/AuthCard.css';

function AuthCard() {
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

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

        <p className="auth-card__subtitle">Secure access to government services</p>

        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div key={activeTab} className="auth-card__form-transition">
          {activeTab === 'login' ? (
            <LoginForm onForgotPassword={() => setIsForgotPasswordOpen(true)} />
          ) : (
            <SignUpForm />
          )}
        </div>

        <div className="auth-card__divider">
          <hr className="auth-card__divider-line" />
          <span className="auth-card__divider-text">or</span>
          <hr className="auth-card__divider-line" />
        </div>

        <GoogleAuthButton
          onSuccess={(credentialResponse) => console.log('Google success', credentialResponse)}
          onError={() => console.log('Google error')}
        />

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
