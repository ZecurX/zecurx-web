import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import CaseStudiesPage from "@/components/resources/pages/CaseStudiesPage";

export const metadata: Metadata = {
    title: "Case Studies - Real-World Security Solutions",
    description: "Explore how organizations across industries have strengthened their security posture with ZecurX solutions.",
    keywords: "cybersecurity case studies, security success stories, industry solutions, ZecurX",
    openGraph: {
        title: "Case Studies - Real-World Security Solutions | ZecurX",
        description: "Explore how organizations across industries have strengthened their security posture with ZecurX solutions.",
        type: "website",
        url: "https://zecurx.com/resources/case-studies",
    },
    alternates: {
        canonical: "https://zecurx.com/resources/case-studies",
    },
};

export default function ResourcesCaseStudiesPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <CaseStudiesPage />
            <Footer />
        </main>
    );
}
