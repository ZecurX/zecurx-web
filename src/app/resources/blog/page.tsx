import React from "react";
import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import BlogPage from "@/components/resources/pages/BlogPage";

export const metadata: Metadata = {
    title: "Blog - Cybersecurity Insights",
    description: "Expert analysis on cybersecurity trends, emerging threats, and practical defense strategies from ZecurX security engineers.",
    keywords: "cybersecurity blog, security insights, threat intelligence, cyber trends, ZecurX blog",
    openGraph: {
        title: "Blog - Cybersecurity Insights | ZecurX",
        description: "Expert analysis on cybersecurity trends, emerging threats, and practical defense strategies.",
        type: "website",
        url: "https://zecurx.com/resources/blog",
    },
    alternates: {
        canonical: "https://zecurx.com/resources/blog",
    },
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
