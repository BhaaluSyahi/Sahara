import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import bgImage from '../assets/wmremove-transformed.png';
import requestService from '../services/requestService';
import PageLoader from '../components/PageLoader';
import '../styles/DashboardPage.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = { open: 'orange', closed: 'green', deleted: 'gray' };

function FadeSection({ children, delay = 0 }) {
  const { ref, visible } = useFadeInOnScroll(0.08);
  return (
    <div
      ref={ref}
      className={`fade-in-section ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <ul className="cp-activity__list">
      {[1, 2, 3].map((i) => (
        <li key={i} className="cp-activity__item cp-activity__item--skeleton">
          <div className="skeleton skeleton--dot" />
          <div className="skeleton skeleton--line" />
        </li>
      ))}
    </ul>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  // ── Fetch requests ────────────────────────────────────────────────────────
  useEffect(() => {
    setRequestsLoading(true);
    setRequestsError(null);
    requestService.getMyRequests()
      .then(setRequests)
      .catch((err) => setRequestsError(err.message))
      .finally(() => setRequestsLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <PageLoader visible={requestsLoading} />
      <div className="dashboard-page__bg" style={{ backgroundImage: `url(${bgImage})` }} />

      <div className="dashboard-page__content">
        <Navbar />

        <main className="cp-main">
          <FadeSection>
            <section className="cp-hero">
              <p className="cp-hero__label">RESOLUTION CENTER</p>
              <h1 className="cp-hero__title">
                Your voice <span className="cp-hero__title--green">matters</span>.
              </h1>
              <p className="cp-hero__sub">
                Sahara Sanctuary is committed to growth and transparency. Whether you're
                seeking a solution or tracking progress, we're here to listen.
              </p>
            </section>
          </FadeSection>

          <FadeSection delay={80}>
            <section className="cp-actions">
              <div
                className={`cp-card${activeCard === 'file' ? ' cp-card--active' : ''}`}
                onClick={() => setActiveCard('file')}
              >
                <div className="cp-card__icon cp-card__icon--green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <h2 className="cp-card__title">Create a Request</h2>
                <p className="cp-card__desc">Request help or support for your needs. Our volunteer matching system connects you with qualified volunteers ready to assist.</p>
                <button className="cp-card__btn cp-card__btn--primary" onClick={() => navigate('/requests')}>Create New Request →</button>
              </div>

              <div
                className={`cp-card${activeCard === 'view' ? ' cp-card--active' : ''}`}
                onClick={() => setActiveCard('view')}
              >
                <div className="cp-card__icon cp-card__icon--gray">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <h2 className="cp-card__title">View Your Requests</h2>
                <p className="cp-card__desc">Monitor the status of your existing requests. Stay updated with real-time feedback and volunteer responses.</p>
                <button className="cp-card__btn cp-card__btn--outline" onClick={() => navigate('/requests')}>Track Progress ⊕</button>
              </div>
            </section>
          </FadeSection>

          <FadeSection delay={100}>
            <section className="cp-commitment">
              <h2 className="cp-commitment__title">Our Commitment to You</h2>
              <p className="cp-commitment__desc">
                Transparency is the bedrock of our community. We promise a fair, impartial, and timely
                resolution for every concern raised. Your comfort and safety within Sahara Sanctuary are
                our highest priorities, and we use your feedback to continuously evolve our standards of care.
              </p>
              <div className="cp-commitment__pillars">
                <div className="cp-pillar">
                  <span className="cp-pillar__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </span>
                  <div>
                    <p className="cp-pillar__title">Impartial Review</p>
                    <p className="cp-pillar__desc">Independent advocacy team handling all cases.</p>
                  </div>
                </div>
                <div className="cp-pillar">
                  <span className="cp-pillar__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <div>
                    <p className="cp-pillar__title">24-Hour Acknowledge</p>
                    <p className="cp-pillar__desc">Guaranteed initial response to all reports.</p>
                  </div>
                </div>
                <div className="cp-pillar">
                  <span className="cp-pillar__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <div>
                    <p className="cp-pillar__title">Full Transparency</p>
                    <p className="cp-pillar__desc">Step-by-step visibility into the resolution process.</p>
                  </div>
                </div>
              </div>
            </section>
          </FadeSection>

          <FadeSection delay={120}>
            <div className="cp-bottom">

              {/* ── Recent Activity ── */}
              <section className="cp-activity">
                <h2 className="cp-activity__title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Recent Activity
                </h2>

                {requestsLoading && <ActivitySkeleton />}

                {requestsError && (
                  <div className="cp-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{requestsError}</span>
                    <button className="cp-error__retry" onClick={() => {
                      setRequestsLoading(true);
                      setRequestsError(null);
                      requestService.getMyRequests().then(setRequests).catch((e) => setRequestsError(e.message)).finally(() => setRequestsLoading(false));
                    }}>Retry</button>
                  </div>
                )}

                {!requestsLoading && !requestsError && requests.length === 0 && (
                  <p className="cp-empty">No requests found.</p>
                )}

                {!requestsLoading && !requestsError && requests.length > 0 && (
                  <ul className="cp-activity__list">
                    {requests.map((r) => (
                      <li key={r.id} className="cp-activity__item">
                        <div className="cp-activity__dot" data-status={statusColor[r.status]} />
                        <div className="cp-activity__info">
                          <p className="cp-activity__name">{r.title} #{r.id}</p>
                          <p className="cp-activity__meta">{r.status} • {new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="cp-activity__arrow">›</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              
            </div>
          </FadeSection>
        </main>

        <footer className="cp-footer">
          <span className="cp-footer__brand">Sahara</span>
          <nav className="cp-footer__links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/help">Help Center</a>
          </nav>
          <span className="cp-footer__copy">© 2026 Sahara Sanctuary. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}

export default DashboardPage;
