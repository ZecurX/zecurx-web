import HeroSectionV3 from "@/components/landing/HeroSectionV3";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import PlatformCapabilitiesSection from "@/components/landing/PlatformCapabilitiesSection";
import WhyZecurXSection from "@/components/landing/WhyZecurXSection";
import IndustriesSection from "@/components/landing/IndustriesSection";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import LatestBlogSection from "@/components/landing/LatestBlogSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />
      <HeroSectionV3 />
      <WhatWeDoSection />
      <PlatformCapabilitiesSection />
      <WhyZecurXSection />
      <IndustriesSection />
      <ReadyToSecureSection />
      <LatestBlogSection />
      <Footer />
    </main>
  );
}
