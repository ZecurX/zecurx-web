import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import WebinarsPage from "@/components/resources/pages/WebinarsPage";

export const metadata: Metadata = {
    title: "Webinars | ZecurX - Expert Sessions",
    description: "On-demand and live sessions featuring industry veterans discussing real-world case studies, regulatory updates, and demonstrations of next-gen security technologies.",
    keywords: "cybersecurity webinars, security training, expert sessions, live events, ZecurX webinars",
};

export default function ResourcesWebinarsPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <WebinarsPage />
            <Footer />
        </main>
    );
}
