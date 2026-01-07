import HeroSection from "@/components/landing/HeroSection";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
// import NavBar from "@/components/landing/NavBar";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import PlatformCapabilitiesSection from "@/components/landing/PlatformCapabilitiesSection";
import WhyZecurXSection from "@/components/landing/WhyZecurXSection";
import IndustriesSection from "@/components/landing/IndustriesSection";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CreativeNavBar />
      <HeroSection />
      <WhatWeDoSection />
      <PlatformCapabilitiesSection />
      <WhyZecurXSection />
      <IndustriesSection />
      <ReadyToSecureSection />
      <Footer />
    </main>
  );
}
