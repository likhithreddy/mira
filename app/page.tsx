import { HeroSection } from '@/components/shared/hero-section';
import { BrowserBanner } from '@/components/shared/browser-banner';

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden">
      <HeroSection />
      <BrowserBanner />
    </main>
  );
}
