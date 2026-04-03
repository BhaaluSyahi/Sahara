import '../styles/AuthenticitySection.css';

const gridImgs = [
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300', alt: 'Team hands together' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300', alt: 'People collaborating' },
  { src: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300', alt: 'Green leaf closeup' },
  { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300', alt: 'Happy children' },
];

function AuthenticitySection() {
  return (
    <section className="auth-section">
      <div className="auth-section__img-grid">
        {gridImgs.map((img) => (
          <div key={img.alt} className="auth-section__img-cell">
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>

      <div className="auth-section__content">
        <h2 className="auth-section__title">Authenticity in every connection.</h2>
        <p className="auth-section__desc">
          At Sahara, we believe volunteering should be as rewarding for the giver as it
          is for the receiver. Our platform uses an organic matching ecosystem that
          considers your skills, schedule, and soulful aspirations to find the perfect
          sanctuary for your talents.
        </p>
        <ul className="auth-section__list">
          <li className="auth-section__list-item">
            <span className="auth-section__check">✓</span>
            <div>
              <p className="auth-section__list-title">Verified Impact</p>
              <p className="auth-section__list-desc">Every organization is vetted for ethical standards and community value.</p>
            </div>
          </li>
          <li className="auth-section__list-item">
            <span className="auth-section__check">✓</span>
            <div>
              <p className="auth-section__list-title">Growth Focused</p>
              <p className="auth-section__list-desc">Gain certificates and endorsements as you build your volunteer profile.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default AuthenticitySection;
