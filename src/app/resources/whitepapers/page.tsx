import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import WhitepapersPage from "@/components/resources/pages/WhitepapersPage";

export const metadata: Metadata = {
    title: "Whitepapers - Technical Security Reports",
    description: "Deep-dive technical documents on complex security challenges, architecture best practices, and compliance.",
    keywords: "cybersecurity whitepapers, security reports, technical documentation, zero trust, cloud compliance, ZecurX",
    openGraph: {
        title: "Whitepapers - Technical Security Reports | ZecurX",
        description: "Deep-dive technical documents on complex security challenges and architecture best practices.",
        type: "website",
        url: "https://zecurx.com/resources/whitepapers",
    },
    alternates: {
        canonical: "https://zecurx.com/resources/whitepapers",
    },
};

export default function ResourcesWhitepapersPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <WhitepapersPage />
            <Footer />
        </main>
    );
}
