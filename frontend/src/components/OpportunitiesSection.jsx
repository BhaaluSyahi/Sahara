import '../styles/OpportunitiesSection.css';

const opportunities = [
  {
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    tags: [{ label: 'NUTRITION', color: 'green' }, { label: '4 WEEKS', color: 'gray' }],
    title: 'Urban Harvest Kitchen',
    desc: 'Help prepare organic, nutrient-rich meals for local school programs using surplus...',
  },
  {
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    tags: [{ label: 'EDUCATION', color: 'green' }, { label: 'REMOTE', color: 'gray' }],
    title: 'Digital Literacy Mentor',
    desc: 'Guide seniors through the essentials of modern connectivity and digital...',
  },
  {
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
    tags: [{ label: 'CLIMATE', color: 'green' }, { label: 'WEEKLY', color: 'gray' }],
    title: 'Sanctuary Restoration',
    desc: 'Participate in preserving native botanical species and maintaining ecological...',
  },
];

function OpportunitiesSection() {
  return (
    <section className="opps">
      <div className="opps__header">
        <div>
          <h2 className="opps__title">Curated impact pathways.</h2>
          <p className="opps__subtitle">
            We don't just match skills; we match passions. Explore opportunities designed
            to nurture both the community and your personal growth.
          </p>
        </div>
        <a href="/opportunities" className="opps__view-all">View all opportunities →</a>
      </div>

      <div className="opps__grid">
        {opportunities.map((opp) => (
          <div key={opp.title} className="opp-card">
            <img src={opp.img} alt={opp.title} className="opp-card__img" />
            <div className="opp-card__body">
              <div className="opp-card__tags">
                {opp.tags.map((tag) => (
                  <span key={tag.label} className={`opp-card__tag opp-card__tag--${tag.color}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
              <h3 className="opp-card__title">{opp.title}</h3>
              <p className="opp-card__desc">{opp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OpportunitiesSection;
