import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ResearchPage from "@/components/resources/pages/ResearchPage";

export const metadata: Metadata = {
    title: "Research & Insights | ZecurX - Threat Intelligence",
    description: "Data-driven reports and proprietary threat intelligence findings that reveal the current state of the cyber landscape and predict future attack methodologies.",
    keywords: "cybersecurity research, threat intelligence, security reports, vulnerability research, ZecurX research",
};

export default function ResourcesResearchPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <ResearchPage />
            <Footer />
        </main>
    );
}
