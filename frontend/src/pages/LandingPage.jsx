import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import OpportunitiesSection from '../components/OpportunitiesSection';
import AuthenticitySection from '../components/AuthenticitySection';
import LandingFooter from '../components/LandingFooter';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import bgImage from '../assets/wmremove-transformed.png';
import '../styles/LandingPage.css';

function FadeSection({ children, delay = 0 }) {
  const { ref, visible } = useFadeInOnScroll(0.12);
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

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-page__bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="landing-page__content">
        <Navbar />
        <FadeSection>
          <HeroSection />
        </FadeSection>
        <FadeSection delay={50}>
          <StatsSection />
        </FadeSection>
        <FadeSection delay={50}>
          <OpportunitiesSection />
        </FadeSection>
        <FadeSection delay={50}>
          <AuthenticitySection />
        </FadeSection>
        <FadeSection delay={50}>
          <LandingFooter />
        </FadeSection>
      </div>
    </div>
  );
}

export default LandingPage;
