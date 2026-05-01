import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import CareerPreview from '../components/sections/CareerPreview';
import WhoItIsFor from '../components/sections/WhoItIsFor';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';

export default function Landing() {
  return (
    <main className="landing-page">
      <Hero />
      <Features />
      <HowItWorks />
      <CareerPreview />
      <Testimonials />
      <WhoItIsFor />
      <CTA />
    </main>
  );
}
