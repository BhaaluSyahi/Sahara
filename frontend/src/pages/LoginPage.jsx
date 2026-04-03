import Navbar from '../components/Navbar';
import HeroPanel from '../components/HeroPanel';
import AuthCard from '../components/AuthCard';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <Navbar />
      <div className="login-page__body">
        <HeroPanel />
        <AuthCard />
      </div>
    </div>
  );
}

export default LoginPage;
