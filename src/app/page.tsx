import HeroSectionV3 from "@/components/landing/HeroSectionV3";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import WhyZecurXSection from "@/components/landing/WhyZecurXSection";
import IndustriesSection from "@/components/landing/IndustriesSection";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import LatestBlogSection from "@/components/landing/LatestBlogSection";
import Footer from "@/components/landing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
  description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems with practical, real-world security.",
  keywords: ["cybersecurity services", "application security", "penetration testing", "cloud security", "DevSecOps", "AI security", "startup security"],
  openGraph: {
    title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems.",
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
      <WhyZecurXSection />
      <IndustriesSection />
      <ReadyToSecureSection />
      <LatestBlogSection />
      <Footer />
    </main>
  );
}
