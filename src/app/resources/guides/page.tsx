import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import GuidesPage from "@/components/resources/pages/GuidesPage";

export const metadata: Metadata = {
    title: "Security Guides - Best Practices",
    description: "Step-by-step playbooks for IT teams and security leaders to implement best practices, harden systems, and prepare for incidents.",
    keywords: "security guides, best practices, system hardening, incident response, secure coding, ZecurX guides",
    openGraph: {
        title: "Security Guides - Best Practices | ZecurX",
        description: "Step-by-step playbooks for IT teams and security leaders to implement best practices.",
        type: "website",
        url: "https://zecurx.com/resources/guides",
    },
    alternates: {
        canonical: "https://zecurx.com/resources/guides",
    },
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
