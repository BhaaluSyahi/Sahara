import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';
import PasswordField from './PasswordField';
import useAuthStore from '../store/useAuthStore';
import '../styles/SignUpForm.css';

// ─── API Config ───────────────────────────────────────────────────────────────
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// ─── API Call (wire to your backend) ─────────────────────────────────────────
async function registerUser(payload) {
  // TODO: replace with your actual registration endpoint
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // payload shape: { name, email, password, state, city }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Registration failed (${res.status})`);
  }
  return res.json(); // expected: { token, user }
}

// ─────────────────────────────────────────────────────────────────────────────
function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const indianStates = useMemo(
    () => State.getStatesOfCountry('IN').sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const cities = useMemo(() => {
    if (!selectedState) return [];
    return City.getCitiesOfState('IN', selectedState).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!selectedState) newErrors.state = 'Please select your state';
    if (!selectedCity) newErrors.city = 'Please select your city';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const data = await registerUser({ name, email, password, state: selectedState, city: selectedCity });
      login(data.user, data.token); // store user + token in Zustand + localStorage
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form__scroll-wrapper">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        {apiError && <div className="signup-form__api-error">{apiError}</div>}

        <div className="signup-form__field">
          <label htmlFor="signup-name" className="signup-form__label">Name</label>
          <input
            id="signup-name"
            type="text"
            className={`signup-form__input${errors.name ? ' signup-form__input--error' : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
          {errors.name && <span className="signup-form__error">{errors.name}</span>}
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-email" className="signup-form__label">Email</label>
          <input
            id="signup-email"
            type="email"
            className={`signup-form__input${errors.email ? ' signup-form__input--error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <span className="signup-form__error">{errors.email}</span>}
        </div>

        <div className="signup-form__field">
          <PasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="signup-form__error">{errors.password}</span>}
        </div>

        <div className="signup-form__field">
          <PasswordField
            id="signup-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="signup-form__error">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-state" className="signup-form__label">State</label>
          <select
            id="signup-state"
            className={`signup-form__select${errors.state ? ' signup-form__input--error' : ''}`}
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">Select your state</option>
            {indianStates.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
            ))}
          </select>
          {errors.state && <span className="signup-form__error">{errors.state}</span>}
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-city" className="signup-form__label">City</label>
          <select
            id="signup-city"
            className={`signup-form__select${errors.city ? ' signup-form__input--error' : ''}`}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">{selectedState ? 'Select your city' : 'Select a state first'}</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
          {errors.city && <span className="signup-form__error">{errors.city}</span>}
        </div>

        <button type="submit" className="signup-form__submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
