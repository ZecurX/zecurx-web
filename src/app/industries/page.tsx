import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries - SaaS, AI, SMEs & EdTech Security",
  description: "Specialized security services for SaaS startups, AI companies, SMEs, and educational institutions. We understand your unique challenges.",
  keywords: ["startup security", "AI security", "SME cybersecurity", "EdTech security", "SaaS security"],
  openGraph: {
    title: "Industries - SaaS, AI, SMEs & EdTech Security | ZecurX",
    description: "Specialized security services for SaaS startups, AI companies, SMEs, and educational institutions.",
    type: "website",
    url: "https://zecurx.com/industries",
  },
  alternates: {
    canonical: "https://zecurx.com/industries",
  },
};


import React, { Suspense } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import IndustryHero from "@/components/industries/IndustryHero";
import IndustryTabs from "@/components/industries/IndustryTabs";
import CaseStudies from "@/components/industries/CaseStudies";

export default function IndustriesPage() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />
      <IndustryHero />
      <Suspense>
        <IndustryTabs />
      </Suspense>
      <CaseStudies />
      <ReadyToSecureSection />
      <Footer />
    </main>
  );
}
