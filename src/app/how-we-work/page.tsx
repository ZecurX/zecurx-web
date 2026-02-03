import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work - Our Security Approach & Engagement Model | ZecurX",
  description: "Learn how ZecurX delivers practical, real-world security. Our approach, engagement model, and security bundles for startups, SMEs, and AI teams.",
  keywords: ["cybersecurity approach", "security engagement", "penetration testing process", "security assessment"],
  openGraph: {
    title: "How We Work - Our Security Approach & Engagement Model | ZecurX",
    description: "Learn how ZecurX delivers practical, real-world security. Our approach, engagement model, and security bundles for startups, SMEs, and AI teams.",
    type: "website",
    url: "https://zecurx.com/how-we-work",
  },
  alternates: {
    canonical: "https://zecurx.com/how-we-work",
  },
};


import React from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import WhyHero from "@/components/why-zecurx/WhyHero";
import WhyContent from "@/components/why-zecurx/WhyContent";

export default function WhyZecurXPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />
            <WhyHero />
            <WhyContent />
            <Footer />
        </main>
    );
}
