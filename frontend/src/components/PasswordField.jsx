import { useState } from 'react';
import '../styles/PasswordField.css';

function PasswordField({ id, label, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-field">
      <label htmlFor={id} className="password-field__label">
        {label}
      </label>
      <div className="password-field__wrapper">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="password-field__input"
        />
        <button
          type="button"
          className="password-field__toggle"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
