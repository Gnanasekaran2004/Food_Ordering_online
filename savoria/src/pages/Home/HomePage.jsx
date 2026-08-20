import HeroSection     from './sections/HeroSection';
import MarqueeSection  from './sections/MarqueeSection';
import IntroSection    from './sections/IntroSection';
import QuoteSection    from './sections/QuoteSection';
import ServicesSection from './sections/ServicesSection';

export default function HomePage() {
  return (
    <main className="page-enter">
      <HeroSection />
      <MarqueeSection />
      <IntroSection />
      <QuoteSection />
      <ServicesSection />
    </main>
  );
}
