"use client";

import dynamic from "next/dynamic";
import NavBarV2 from "@/components/landing-v2/NavBarV2";
import FooterV2 from "@/components/landing-v2/FooterV2";
import BackgroundNarrative from "@/components/landing-v2/BackgroundNarrative";
import ConnectedMetaphorLayer from "@/components/landing-v2/ConnectedMetaphorLayer";

const HeroSection = dynamic(
    () => import("@/components/landing-v2/HeroSection"),
    { ssr: false }
);
const NarrativeSection = dynamic(
    () => import("@/components/landing-v2/NarrativeSection"),
    { ssr: false }
);
const ServicesSection = dynamic(
    () => import("@/components/landing-v2/ServicesSection"),
    { ssr: false }
);
const WhyZecurXSection = dynamic(
    () => import("@/components/landing-v2/WhyZecurXSection"),
    { ssr: false }
);
const TrustProofSection = dynamic(
    () => import("@/components/landing-v2/TrustProofSection"),
    { ssr: false }
);
const IndustriesSection = dynamic(
    () => import("@/components/landing-v2/IndustriesSection"),
    { ssr: false }
);
const BlogSection = dynamic(
    () => import("@/components/landing-v2/BlogSection"),
    { ssr: false }
);
const FinalCTASection = dynamic(
    () => import("@/components/landing-v2/FinalCTASection"),
    { ssr: false }
);

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image_url?: string;
    published_at: string;
    date?: string;
    category?: string;
    image?: string;
    labels?: Record<string, unknown>[];
}

export default function RedesignLandingClient({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="bg-black text-white min-h-screen relative overflow-x-hidden">
            <BackgroundNarrative />
            <ConnectedMetaphorLayer />

            <NavBarV2 />
            <main className="relative z-10">
                <HeroSection />
                <NarrativeSection />
                <ServicesSection />
                <WhyZecurXSection />
                <TrustProofSection />
                <IndustriesSection />
                <BlogSection posts={posts} />
                <FinalCTASection />
            </main>
            <FooterV2 />
        </div>
    );
}
