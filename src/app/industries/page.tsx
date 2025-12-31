import React, { Suspense } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ReadyToSecureSection from "@/components/landing/ReadyToSecureSection";
import IndustryHero from "@/components/industries/IndustryHero";
import IndustryTabs from "@/components/industries/IndustryTabs";
import CaseStudies from "@/components/industries/CaseStudies";

export default function IndustriesPage() {
    return (
        <main className="bg-background min-h-screen">
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
