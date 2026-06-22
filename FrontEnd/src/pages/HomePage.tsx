import { HeroSection } from '../components/landing/HeroSection';
import { AboutAISection } from '../components/landing/AboutAISection';
import { WhyECGSection } from '../components/landing/WhyECGSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { DemoPreviewSection } from '../components/landing/DemoPreviewSection';
import { StatsSection } from '../components/landing/StatsSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { ContactSection } from '../components/landing/ContactSection';
import { FAQSection } from '../components/landing/FAQSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutAISection />
      <WhyECGSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoPreviewSection />
      <StatsSection />
      <BenefitsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
