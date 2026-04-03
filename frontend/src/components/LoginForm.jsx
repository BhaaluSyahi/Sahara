import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordField from './PasswordField';
import useAuthStore from '../store/useAuthStore';
import PageLoader from './PageLoader';
import '../styles/LoginForm.css';

// ─── API Config ───────────────────────────────────────────────────────────────
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// ─── API Call (wire to your backend) ─────────────────────────────────────────
async function loginUser(usernameOrEmail, password) {
  // TODO: replace with your actual login endpoint
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Login failed (${res.status})`);
  }
  return res.json(); // expected: { token, user }
}

// ─── Google OAuth handler (wire to your backend) ──────────────────────────────
async function loginWithGoogle(credentialResponse) {
  // TODO: send Google credential to your backend for verification
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Google login failed (${res.status})`);
  }
  return res.json(); // expected: { token, user }
}

// ─────────────────────────────────────────────────────────────────────────────
function LoginForm({ onForgotPassword }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ usernameOrEmail: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {
      usernameOrEmail: usernameOrEmail.trim() ? '' : 'Username or email is required',
      password: password.trim() ? '' : 'Password is required',
    };
    setErrors(newErrors);
    if (newErrors.usernameOrEmail || newErrors.password) return;

    setLoading(true);
    try {
      const data = await loginUser(usernameOrEmail, password);
      login(data.user, data.token); // store user + token in Zustand + localStorage
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageLoader visible={loading} />
      <form className="login-form" onSubmit={handleSubmit} noValidate>
      {apiError && <div className="login-form__api-error">{apiError}</div>}

      <div className="login-form__field">
        <label htmlFor="usernameOrEmail" className="login-form__label">
          Username or Email
        </label>
        <input
          id="usernameOrEmail"
          type="text"
          className="login-form__input"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        {errors.usernameOrEmail && (
          <span className="login-form__error">{errors.usernameOrEmail}</span>
        )}
      </div>

      <div className="login-form__field">
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <span className="login-form__error">{errors.password}</span>
        )}
        <div className="login-form__forgot-wrapper">
          <button type="button" className="login-form__forgot" onClick={onForgotPassword}>
            Forgot Password?
          </button>
        </div>
      </div>

      <button type="submit" className="login-form__submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login to Portal'}
      </button>
    </form>
    </>
  );
}

export { loginWithGoogle };
export default LoginForm;
