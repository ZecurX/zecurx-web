import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Solutions - Sector-Specific Cybersecurity | ZecurX",
  description: "Tailored cybersecurity solutions for finance, healthcare, retail, manufacturing, and government sectors with industry-specific compliance.",
  keywords: ["industry cybersecurity", "sector security", "compliance solutions", "vertical security"],
  openGraph: {
    title: "Industry Solutions - Sector-Specific Cybersecurity | ZecurX",
    description: "Tailored cybersecurity solutions for finance, healthcare, retail, manufacturing, and government sectors with industry-specific compliance.",
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
