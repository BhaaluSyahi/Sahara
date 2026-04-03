import { useState } from 'react';
import PasswordField from './PasswordField';
import '../styles/LoginForm.css';

function LoginForm({ onForgotPassword }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ usernameOrEmail: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      usernameOrEmail: usernameOrEmail.trim() ? '' : 'Username or email is required',
      password: password.trim() ? '' : 'Password is required',
    };
    setErrors(newErrors);

    if (!newErrors.usernameOrEmail && !newErrors.password) {
      // no-op submit handler
      console.log({ usernameOrEmail, password });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
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
          <button
            type="button"
            className="login-form__forgot"
            onClick={onForgotPassword}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button type="submit" className="login-form__submit">
        Login to Portal
      </button>
    </form>
  );
}

export default LoginForm;
