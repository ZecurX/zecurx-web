import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import SeminarsPage from "@/components/resources/pages/SeminarsPage";

export const metadata: Metadata = {
    title: "Seminars | ZecurX - Expert Sessions",
    description: "On-demand and live sessions featuring industry veterans discussing real-world case studies, regulatory updates, and demonstrations of next-gen security technologies.",
    keywords: "cybersecurity seminars, security training, expert sessions, live events, ZecurX seminars",
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
