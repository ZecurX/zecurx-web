import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import SeminarsPage from "@/components/resources/pages/SeminarsPage";

export const metadata: Metadata = {
    title: "Seminars - Expert Sessions",
    description: "Live and on-demand sessions featuring industry veterans on real-world case studies and security technologies.",
    keywords: "cybersecurity seminars, security training, expert sessions, live events, ZecurX seminars",
    openGraph: {
        title: "Seminars - Expert Sessions | ZecurX",
        description: "Live and on-demand sessions featuring industry veterans on real-world case studies.",
        type: "website",
        url: "https://zecurx.com/resources/seminars",
    },
    alternates: {
        canonical: "https://zecurx.com/resources/seminars",
    },
};

export default function ResourcesSeminarsPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <SeminarsPage />
            <Footer />
        </main>
    );
}
