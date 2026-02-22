import CreativeNavBar from "@/components/landing/CreativeNavBar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { WhyUs } from "@/components/why-us";
import { Industries } from "@/components/industries";
import { Solutions } from "@/components/solutions";
import Footer from "@/components/landing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
  description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems with practical, real-world security.",
  keywords: ["cybersecurity services", "application security", "penetration testing", "cloud security", "DevSecOps", "AI security", "startup security"],
  openGraph: {
    title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems.",
    type: "website",
    url: "https://zecurx.com",
  },
  alternates: {
    canonical: "https://zecurx.com",
  },
};

export default function Home() {
  return (
    <main className="bg-bg-primary min-h-screen text-text-primary selection:bg-accent/30 relative font-sans">
      <CreativeNavBar />
      <Hero />
      <Services />
      <Solutions />
      <Industries />
      <WhyUs />
      <Footer />
    </main>
  );
}
