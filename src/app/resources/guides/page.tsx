import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import GuidesPage from "@/components/resources/pages/GuidesPage";

export const metadata: Metadata = {
    title: "Security Guides | ZecurX - Best Practices",
    description: "Practical, step-by-step playbooks designed to help IT teams and security leaders implement best practices, harden systems, and prepare for incident response.",
    keywords: "security guides, best practices, system hardening, incident response, secure coding, ZecurX guides",
};

export default function ResourcesGuidesPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <GuidesPage />
            <Footer />
        </main>
    );
}
