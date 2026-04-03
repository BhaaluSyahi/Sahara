import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import OpportunitiesSection from '../components/OpportunitiesSection';
import AuthenticitySection from '../components/AuthenticitySection';
import LandingFooter from '../components/LandingFooter';

function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <OpportunitiesSection />
      <AuthenticitySection />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
