import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <a href="/" className="navbar__logo">Sahara</a>
        <ul className="navbar__links">
          <li><a href="/" className={`navbar__link${isActive('/') ? ' navbar__link--active' : ''}`}>Home</a></li>
          <li><a href="/dashboard" className={`navbar__link${isActive('/dashboard') ? ' navbar__link--active' : ''}`}>Dashboard</a></li>
          <li><a href="/requests" className={`navbar__link${isActive('/requests') ? ' navbar__link--active' : ''}`}>My Requests</a></li>
        </ul>
      </div>
      <div className="navbar__right">
        <button className="navbar__avatar" aria-label="Profile" onClick={handleProfileClick}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
