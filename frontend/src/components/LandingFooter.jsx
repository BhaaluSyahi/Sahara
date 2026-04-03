import useAuthStore from '../store/useAuthStore';
import '../styles/LandingFooter.css';

function LandingFooter() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <footer className="landing-footer">
      <p className="landing-footer__brand">Sahara</p>
      <nav className="landing-footer__links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/guide">Volunteer Guide</a>
        <a href="/partner">Partner with Us</a>
      </nav>
      <p className="landing-footer__copy">
        © 2026 Sahara Volunteer Matching. Cultivating impact through connection.
      </p>
      {!isLoggedIn && (
        <a href="/login?tab=signup" className="landing-footer__cta">+ Register Now</a>
      )}
    </footer>
  );
}

export default LandingFooter;
