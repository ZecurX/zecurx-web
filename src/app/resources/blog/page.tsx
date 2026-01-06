import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import BlogPage from "@/components/resources/pages/BlogPage";

export const metadata: Metadata = {
    title: "Blog | ZecurX - Cybersecurity Insights",
    description: "Stay ahead of the curve with expert analysis on the latest cybersecurity trends, emerging threat vectors, and practical defense strategies written by our security engineers.",
    keywords: "cybersecurity blog, security insights, threat intelligence, cyber trends, ZecurX blog",
};

export default function ResourcesBlogPage() {
    return (
        <main className="bg-background min-h-screen selection:bg-foreground/80/30">
            <CreativeNavBar />
            <BlogPage />
            <Footer />
        </main>
    );
}
