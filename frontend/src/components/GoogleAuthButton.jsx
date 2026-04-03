import { GoogleLogin } from '@react-oauth/google';
import '../styles/GoogleAuthButton.css';

function GoogleAuthButton({ onSuccess, onError }) {
  return (
    <div className="google-auth-button">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

export default GoogleAuthButton;
