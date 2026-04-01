import { HeroSection } from '@/components/shared/hero-section';
import { FeaturesSection } from '@/components/shared/features-section';
import { HowItWorksSection } from '@/components/shared/how-it-works-section';
import { AboutSection } from '@/components/shared/about-section';
import { BrowserBanner } from '@/components/shared/browser-banner';

export default function HomePage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <BrowserBanner />
    </main>
  );
}
