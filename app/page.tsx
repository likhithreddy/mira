import { LandingNav } from '@/components/shared/landing-nav';
import { HeroSection } from '@/components/shared/hero-section';
import { FeaturesSection } from '@/components/shared/features-section';
import { HowItWorksSection } from '@/components/shared/how-it-works-section';
import { AboutSection } from '@/components/shared/about-section';
import { CtaSection } from '@/components/shared/cta-section';
import { BrowserBanner } from '@/components/shared/browser-banner';
import { ScrollToTop } from '@/components/shared/scroll-to-top';

export default function HomePage() {
  return (
    <main className="bg-background">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <CtaSection />
      <BrowserBanner />
      <ScrollToTop />
    </main>
  );
}
