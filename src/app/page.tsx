import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import { generalFAQs, getFAQSchema, getBreadcrumbSchema, getHomeBreadcrumb } from "@/lib/schemas";

// Lazy load below-the-fold sections for better initial load performance
const WhatWeDoSection = dynamic(() => import("@/components/landing/WhatWeDoSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const PlatformCapabilitiesSection = dynamic(() => import("@/components/landing/PlatformCapabilitiesSection"), {
  loading: () => <div className="min-h-[600px]" />,
});
const WhyZecurXSection = dynamic(() => import("@/components/landing/WhyZecurXSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const IndustriesSection = dynamic(() => import("@/components/landing/IndustriesSection"), {
  loading: () => <div className="min-h-[500px]" />,
});
const ReadyToSecureSection = dynamic(() => import("@/components/landing/ReadyToSecureSection"), {
  loading: () => <div className="min-h-[500px]" />,
});
const Footer = dynamic(() => import("@/components/landing/Footer"), {
  loading: () => <div className="min-h-[300px]" />,
});

// Homepage SEO metadata
export const metadata: Metadata = {
  title: "ZecurX - Advanced Cybersecurity Solutions & VAPT Services India",
  description: "ZecurX offers advanced cybersecurity solutions, penetration testing (VAPT), vulnerability assessment, and ISO certified security training in India. Trusted by enterprises for cloud security, application security, DevSecOps, and professional ethical hacking courses. 1200+ students trained.",
  keywords: [
    "cybersecurity solutions India",
    "penetration testing services",
    "VAPT company India",
    "vulnerability assessment",
    "ethical hacking training",
    "cybersecurity training academy",
    "cloud security platform",
    "application security",
    "DevSecOps services",
    "red team services India",
    "security consulting",
    "ISO certified courses",
    "zxCPEH certification",
    "cyber security courses India"
  ],
  alternates: {
    canonical: "https://zecurx.com",
  },
  openGraph: {
    title: "ZecurX - Advanced Cybersecurity Solutions & Training Academy",
    description: "Enterprise-grade cybersecurity solutions, VAPT services, and ISO certified security training. Protect your business with ZecurX.",
    url: "https://zecurx.com",
    type: "website",
    images: [
      {
        url: "https://zecurx.com/og-home.png",
        width: 1200,
        height: 630,
        alt: "ZecurX Cybersecurity Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZecurX - Advanced Cybersecurity Solutions",
    description: "Enterprise-grade cybersecurity solutions, VAPT services, and ISO certified security training.",
    images: ["https://zecurx.com/og-home.png"],
  },
};

export default function Home() {
  // Structured data for homepage
  const faqSchema = getFAQSchema(generalFAQs);
  const breadcrumbSchema = getBreadcrumbSchema(getHomeBreadcrumb());

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
        <CreativeNavBar />
        <HeroSection />
        <WhatWeDoSection />
        <PlatformCapabilitiesSection />
        <WhyZecurXSection />
        <IndustriesSection />
        <ReadyToSecureSection />
        <Footer />
      </main>
    </>
  );
}
