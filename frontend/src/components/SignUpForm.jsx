import { useState } from 'react';
import PasswordField from './PasswordField';
import '../styles/SignUpForm.css';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: name.trim() ? '' : 'Name is required',
      email: email.trim() ? '' : 'Email is required',
      password: password.trim() ? '' : 'Password is required',
      confirmPassword: confirmPassword.trim()
        ? password !== confirmPassword
          ? 'Passwords do not match'
          : ''
        : 'Please confirm your password',
    };
    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      // no-op submit handler
      console.log({ name, email, password });
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      <div className="signup-form__field">
        <label htmlFor="signup-name" className="signup-form__label">
          Name
        </label>
        <input
          id="signup-name"
          type="text"
          className="signup-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="signup-form__error">{errors.name}</span>}
      </div>

      <div className="signup-form__field">
        <label htmlFor="signup-email" className="signup-form__label">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          className="signup-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <button type="submit" className="signup-form__submit">
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;
