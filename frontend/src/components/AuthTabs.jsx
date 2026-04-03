import '../styles/AuthTabs.css';

function AuthTabs({ activeTab, onTabChange }) {
  const handleKeyDown = (e, tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tab);
    }
  };

  return (
    <div className="auth-tabs">
      <button
        className={`auth-tabs__btn${activeTab === 'login' ? ' auth-tabs__btn--active' : ''}`}
        onClick={() => onTabChange('login')}
        onKeyDown={(e) => handleKeyDown(e, 'login')}
        type="button"
      >
        Login
      </button>
      <button
        className={`auth-tabs__btn${activeTab === 'signup' ? ' auth-tabs__btn--active' : ''}`}
        onClick={() => onTabChange('signup')}
        onKeyDown={(e) => handleKeyDown(e, 'signup')}
        type="button"
      >
        Sign Up
      </button>
    </div>
  );
}

export default AuthTabs;
