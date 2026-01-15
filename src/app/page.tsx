import HeroSectionV3 from "@/components/landing/HeroSectionV3";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import PlatformCapabilitiesSection from "@/components/landing/PlatformCapabilitiesSection";
import WhyZecurXSection from "@/components/landing/WhyZecurXSection";
import IndustriesSection from "@/components/landing/IndustriesSection";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import LatestBlogSection from "@/components/landing/LatestBlogSection";
import Footer from "@/components/landing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZecurX - Advanced Cybersecurity Solutions, Training & Threat Intelligence",
  description: "Protect your business with ZecurX's cutting-edge cybersecurity platform. We deliver threat intelligence, endpoint security, cloud protection, zero-trust architecture, and professional security training with ISO-verified certifications.",
  keywords: ["cybersecurity", "threat intelligence", "endpoint security", "AI security", "zero trust architecture", "cloud security", "security automation", "cybersecurity training", "ethical hacking certification", "penetration testing certification"],
  openGraph: {
    title: "ZecurX - Advanced Cybersecurity Solutions, Training & Threat Intelligence",
    description: "Protect your business with ZecurX's cutting-edge cybersecurity platform. Threat intelligence, endpoint security, cloud protection, zero-trust architecture, and ISO-verified security certifications.",
    type: "website",
    url: "https://zecurx.com",
  },
  alternates: {
    canonical: "https://zecurx.com",
  },
};

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
