import '../styles/HeroSection.css';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__left">
        <span className="hero__badge">🌱 Now matching for Summer 2026</span>
        <h1 className="hero__heading">
          Together, we{' '}
          <span className="hero__heading--green">cultivate</span>{' '}
          change.
        </h1>
        <p className="hero__subtext">
          Connect with purpose-driven initiatives. Sahara transforms the way
          volunteers find meaningful opportunities, creating a living sanctuary
          for community impact.
        </p>
        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary">Become a Volunteer</button>
          <button className="hero__btn hero__btn--outline">Browse Opportunities</button>
        </div>
      </div>

      <div className="hero__right">
        <div className="hero__img-wrapper">
          <img
            src={`${process.env.PUBLIC_URL}/Screenshot 2026-04-03 173151.png`}
            alt="Volunteers planting together"
            className="hero__img"
          />
          <div className="hero__card">
            <span className="hero__card-icon">🌿</span>
            <div>
              <p className="hero__card-title">Sustainability Hub</p>
              <p className="hero__card-desc">Matching 150+ environmental enthusiasts this month alone.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
