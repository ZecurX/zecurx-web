import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesContent from "@/components/resources/ResourcesContent";
import ResourcesCTA from "@/components/resources/ResourcesCTA";

export const metadata: Metadata = {
    title: "Resources | ZecurX - Cybersecurity Knowledge Hub",
    description: "Stay informed with expert insights, technical research, real-world case studies, and educational resources from ZecurX cybersecurity professionals. Access blogs, whitepapers, research reports, security guides, and webinars.",
    keywords: "cybersecurity resources, security blog, whitepapers, threat intelligence, security research, webinars, case studies, ZecurX",
};

export default function ResourcesPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-primary/30">
            <CreativeNavBar />
            <ResourcesHero />
            <ResourcesContent />
            <ResourcesCTA />
            <Footer />
        </main>
    );
}
