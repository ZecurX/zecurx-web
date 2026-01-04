import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import WhitepapersPage from "@/components/resources/pages/WhitepapersPage";

export const metadata: Metadata = {
    title: "Whitepapers | ZecurX - Technical Security Reports",
    description: "Deep-dive technical documents and strategic reports that provide comprehensive insights into complex security challenges, architecture best practices, and industry compliance.",
    keywords: "cybersecurity whitepapers, security reports, technical documentation, zero trust, cloud compliance, ZecurX",
};

export default function ResourcesWhitepapersPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-blue-400/30">
            <CreativeNavBar />
            <WhitepapersPage />
            <Footer />
        </main>
    );
}
