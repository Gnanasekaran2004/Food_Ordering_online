import React from 'react';
import AboutHero           from './sections/AboutHero';
import StorySection        from './sections/StorySection';
import TimelineSection     from './sections/TimelineSection';
import KitchenScene3D      from './sections/KitchenScene3D';
import PhilosophySection   from './sections/PhilosophySection';
import KitchenCultureSection from './sections/KitchenCultureSection';
import MilestonesSection   from './sections/MilestonesSection';
import ClosingCTA          from './sections/ClosingCTA';

export default function AboutPage() {
  return (
    <main className="page-enter" aria-label="About SAVORIA">
      <AboutHero />
      <StorySection />
      <TimelineSection />
      <KitchenScene3D />
      <PhilosophySection />
      <KitchenCultureSection />
      <MilestonesSection />
      <ClosingCTA />
    </main>
  );
}
