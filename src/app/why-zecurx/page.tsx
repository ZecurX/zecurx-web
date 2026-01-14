import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why ZecurX - Leading Cybersecurity Innovation & Expertise | ZecurX",
  description: "Discover why organizations trust ZecurX for advanced cybersecurity. Learn about our AI-powered approach, expert team, and proven track record.",
  keywords: ["cybersecurity company", "security expertise", "AI security", "threat protection"],
  openGraph: {
    title: "Why ZecurX - Leading Cybersecurity Innovation & Expertise | ZecurX",
    description: "Discover why organizations trust ZecurX for advanced cybersecurity. Learn about our AI-powered approach, expert team, and proven track record.",
    type: "website",
    url: "https://zecurx.com/why-zecurx",
  },
  alternates: {
    canonical: "https://zecurx.com/why-zecurx",
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
