import Hero from "./Hero";
import Features from "./Features";
import LearningPath from "./LearningPath";
import MethodologySection from "./MethodologySection";
import PromoVideo from "./PromoVideo";
import Testimonials from "./Testimonials";
import RecitersShowcase from "./RecitersShowcase";
import TrustAndSources from "./TrustAndSources";
import SupportAccessSection from "./SupportAccessSection";
import CTABanner from "./CTABanner";

export default function LandingContent() {
  return (
    <>
      <Hero />
      <Features />
      <LearningPath />
      <MethodologySection />
      <TrustAndSources />
      <PromoVideo />
      <Testimonials />
      <RecitersShowcase />
      <SupportAccessSection />
      <CTABanner />
    </>
  );
}
