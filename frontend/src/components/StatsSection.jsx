import '../styles/StatsSection.css';

function StatsSection() {
  return (
    <section className="stats">
      <div className="stats__card stats__card--white">
        <h2 className="stats__big">5,000+ Hours</h2>
        <p className="stats__desc">
          Donated by our incredible community of volunteers across the globe,
          impacting thousands of lives every single day.
        </p>
      </div>
      <div className="stats__card stats__card--green">
        <h2 className="stats__big">92%</h2>
        <p className="stats__label">MATCH RATE</p>
      </div>
      <div className="stats__card stats__card--lime">
        <h2 className="stats__big stats__big--dark">450</h2>
        <p className="stats__label stats__label--dark">ACTIVE PROJECTS</p>
      </div>
    </section>
  );
}

export default StatsSection;
