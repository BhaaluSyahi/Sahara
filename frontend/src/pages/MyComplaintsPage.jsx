import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LandingFooter from '../components/LandingFooter';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import bgImage from '../assets/wmremove-transformed.png';
import { getToken } from '../store/useAuthStore';
import '../styles/MyComplaintsPage.css';

function FadeSection({ children, delay = 0 }) {
  const { ref, visible } = useFadeInOnScroll(0.08);
  return (
    <div
      ref={ref}
      className={`fade-section${visible ? ' is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Mock Data (commented out) ────────────────────────────────────────────────
/*
const mockComplaints = [
  {
    id: 'SAH-8821',
    title: 'Broken Streetlight on Palm Grove Avenue',
    desc: 'The streetlight near the east entrance of Palm Grove has been flickering for three nights and is now completely out, creating a safety hazard for night walkers.',
    status: 'IN PROGRESS',
    date: 'Oct 12, 2024',
    zone: 'Zone A - Palm Grove',
  },
  {
    id: 'SAH-8790',
    title: 'Irrigation Leak in Central Garden',
    desc: 'Noticeable pooling of water near the orchid display. It seems one of the underground pipes has a significant leak affecting the walkway.',
    status: 'PENDING',
    date: 'Oct 10, 2024',
    zone: 'Central Sanctuary',
  },
  {
    id: 'SAH-8645',
    title: 'Waste Bin Overflow near Picnic Area',
    desc: 'Recycling bins were overflowing following the weekend community event. Maintenance was requested for immediate clearance.',
    status: 'RESOLVED',
    date: 'Oct 05, 2024',
    zone: 'Zone C - Recreational Hub',
  },
];
*/

// ─── API Config ───────────────────────────────────────────────────────────────
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

async function fetchMyComplaints(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/my-complaints?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch complaints (${res.status})`);
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  'IN PROGRESS': 'badge--inprogress',
  PENDING:       'badge--pending',
  RESOLVED:      'badge--resolved',
};

function StatusBadge({ status }) {
  return (
    <span className={`mc-badge ${STATUS_STYLES[status] || ''}`}>{status}</span>
  );
}

function ComplaintCard({ complaint }) {
  return (
    <div className="mc-card">
      <div className="mc-card__header">
        <span className="mc-card__id">#{complaint.id}</span>
        <StatusBadge status={complaint.status} />
      </div>
      <h3 className="mc-card__title">{complaint.title}</h3>
      <p className="mc-card__desc">{complaint.desc}</p>
      <div className="mc-card__footer">
        <span className="mc-card__meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Submitted {complaint.date}
        </span>
        <span className="mc-card__meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {complaint.zone}
        </span>
        <a href={`/complaints/${complaint.id}`} className="mc-card__link">
          View Full Details →
        </a>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadComplaints = () => {
    setLoading(true);
    setError(null);
    const filters = {};
    if (search) filters.search = search;
    if (statusFilter) filters.status = statusFilter;
    fetchMyComplaints(filters)
      .then(setComplaints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadComplaints(); }, []); // eslint-disable-line

  return (
    <div className="mc-page">
      <div className="mc-page__bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="mc-page__content">
        <Navbar />
        <main className="mc-main">
          <FadeSection>
            <section className="mc-hero">
              <h1 className="mc-hero__title">My Complaints</h1>
              <p className="mc-hero__sub">
                Track and manage your submitted concerns. We are committed to
                maintaining the sanctuary's integrity through your valuable feedback.
              </p>
            </section>
          </FadeSection>

          <FadeSection delay={80}>
            <div className="mc-layout">
          {/* ── Left: Search + List ── */}
          <div className="mc-left">
            {/* Search bar */}
            <div className="mc-search-row">
              <div className="mc-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by title or reference number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadComplaints()}
                />
              </div>
              <select
                className="mc-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="PENDING">Pending</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <button className="mc-filter-btn" onClick={loadComplaints}>Filter</button>
            </div>

            {/* States */}
            {loading && (
              <div className="mc-skeletons">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mc-card mc-card--skeleton">
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--text short" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mc-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
                <button className="mc-error__retry" onClick={loadComplaints}>Retry</button>
              </div>
            )}

            {!loading && !error && complaints.length === 0 && (
              <div className="mc-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p>No complaints found.</p>
              </div>
            )}

            {!loading && !error && complaints.map((c, i) => (
              <FadeSection key={c.id} delay={i * 80}>
                <ComplaintCard complaint={c} />
              </FadeSection>
            ))}
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="mc-sidebar">
            {/* New concern CTA */}
            <div className="mc-sidebar__cta">
              <h2 className="mc-sidebar__cta-title">Have a new concern?</h2>
              <p className="mc-sidebar__cta-desc">
                Your vigilance helps us maintain the beauty and safety of Sahara Sanctuary.
                Report any issues immediately for quick resolution.
              </p>
              <button className="mc-sidebar__cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                File New Complaint
              </button>
            </div>

            {/* Resolution stats */}
            <div className="mc-sidebar__stats">
              <h3 className="mc-sidebar__stats-title">Resolution Statistics</h3>
              <div className="mc-stat">
                <span className="mc-stat__label">Avg. Response Time</span>
                <span className="mc-stat__value">24h</span>
              </div>
              <div className="mc-stat__bar"><div className="mc-stat__fill" style={{ width: '70%' }} /></div>
              <div className="mc-stat" style={{ marginTop: '1rem' }}>
                <span className="mc-stat__label">Success Rate</span>
                <span className="mc-stat__value">98%</span>
              </div>
              <div className="mc-stat__bar"><div className="mc-stat__fill" style={{ width: '98%' }} /></div>
            </div>

            {/* Community rules */}
            <div className="mc-sidebar__rules">
              <div className="mc-rules__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="mc-rules__title">Community Rules</p>
                <p className="mc-rules__sub">Review our guidelines</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </aside>
            </div>
          </FadeSection>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}

export default MyComplaintsPage;
