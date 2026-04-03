import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <LoginPage />
    </GoogleOAuthProvider>
  );
}

export default App;
