import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <span className="navbar__logo">Sahara</span>
        <ul className="navbar__links">
          <li><a href="/" className="navbar__link navbar__link--active">Home</a></li>
          <li><a href="/complaints" className="navbar__link">My Complaints</a></li>
          <li><a href="/contact" className="navbar__link">Contact Us</a></li>
        </ul>
      </div>
      <div className="navbar__right">
        <button className="navbar__icon-btn" aria-label="Notifications">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <button className="navbar__avatar" aria-label="Profile">
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
