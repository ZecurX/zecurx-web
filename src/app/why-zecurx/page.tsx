import React from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import WhyHero from "@/components/why-zecurx/WhyHero";
import WhyContent from "@/components/why-zecurx/WhyContent";

export default function WhyZecurXPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />
            <WhyHero />
            <WhyContent />
            <Footer />
        </main>
    );
}
