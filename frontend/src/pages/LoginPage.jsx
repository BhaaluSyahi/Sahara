import HeroPanel from '../components/HeroPanel';
import AuthCard from '../components/AuthCard';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <HeroPanel />
      <AuthCard />
    </div>
  );
}

export default LoginPage;
