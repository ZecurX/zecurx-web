import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ResearchPage from "@/components/resources/pages/ResearchPage";
import { getTopSecurityStories } from "@/lib/hacker-news";

export const metadata: Metadata = {
    title: "Research & Insights | ZecurX - Threat Intelligence",
    description: "Real-time threat intelligence and vulnerability analysis curated from global sources.",
    keywords: "cybersecurity research, threat intelligence, security reports, vulnerability research, ZecurX research, hacker news",
};

export default async function ResourcesResearchPage() {
    const stories = await getTopSecurityStories(100);
    
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <ResearchPage initialStories={stories} />
            <Footer />
        </main>
    );
}
