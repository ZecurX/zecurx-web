import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Cybersecurity Services | ZecurX",
    description: "Security that helps you ship faster. Application security, cloud security, secure AI development, and compliance readiness for startups, SMEs, and AI teams.",
    keywords: ["cybersecurity services", "application security", "cloud security", "DevSecOps", "AI security", "compliance"],
    openGraph: {
        title: "Cybersecurity Services | ZecurX",
        description: "Security that helps you ship faster. Application security, cloud security, secure AI development, and compliance readiness.",
        type: "website",
        url: "https://zecurx.com/services",
    },
    alternates: {
        canonical: "https://zecurx.com/services",
    },
};

const coreServices = [
    {
        title: "Application Security",
        tagline: "Core Security Service",
        description: "Web, API, and source code security testing. We identify and fix real-world vulnerabilities before attackers exploit them.",
        href: "/services/application-security",
    },
    {
        title: "Cloud & DevSecOps Security",
        tagline: "Infrastructure Security",
        description: "Cloud misconfiguration and CI/CD security audits. Secure your AWS, GCP, or Azure infrastructure.",
        href: "/services/cloud-devsecops",
    },
];

const buildServices = [
    {
        title: "Secure AI Application Development",
        tagline: "Build & Secure",
        description: "Secure AI-powered MVPs and systems. LLM integration, threat modeling, and AI abuse testing.",
        href: "/services/secure-ai-development",
    },
    {
        title: "Compliance Readiness",
        tagline: "Supporting Service",
        description: "ISO 27001, SOC 2, and DPDP readiness support. Prepare for compliance without slowing down.",
        href: "/services/compliance-readiness",
    },
];

export default function ServicesPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                        Security Services
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
                        Practical, real-world security for startups, SMEs, and AI teams. We help you ship faster, not slower.
                    </p>

                    <Link
                        href="/contact"
                        className="inline-flex px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                    >
                        Get a Security Assessment
                    </Link>
                </div>
            </section>

            <div className="w-full h-px bg-border/40 max-w-5xl mx-auto" />

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-border/40" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Core Security Services
                        </span>
                        <div className="h-px flex-1 bg-border/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {coreServices.map((service, i) => (
                            <Link
                                key={i}
                                href={service.href}
                                className="group p-8 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 transition-all duration-300"
                            >
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                                    {service.tagline}
                                </span>
                                <h2 className="text-2xl font-bold text-foreground mt-3 mb-4 group-hover:text-foreground/80 transition-colors">
                                    {service.title}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <span className="text-sm font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
                                    Learn more →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-muted/10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-border/40" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Build & Compliance
                        </span>
                        <div className="h-px flex-1 bg-border/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {buildServices.map((service, i) => (
                            <Link
                                key={i}
                                href={service.href}
                                className="group p-8 rounded-2xl border border-border/40 bg-background hover:bg-card/30 transition-all duration-300"
                            >
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                                    {service.tagline}
                                </span>
                                <h2 className="text-2xl font-bold text-foreground mt-3 mb-4 group-hover:text-foreground/80 transition-colors">
                                    {service.title}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <span className="text-sm font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
                                    Learn more →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">
                                Free Tools
                            </span>
                            <h2 className="text-3xl font-bold text-foreground">
                                VulnHunter Suite
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Open security tools for reconnaissance and testing.
                            </p>
                        </div>
                        <Link
                            href="/tools"
                            className="px-6 py-3 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors whitespace-nowrap"
                        >
                            Explore Tools →
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl border border-border/40 bg-card/20 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            Ready to secure your product?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Get a security assessment tailored to your needs. Fast turnaround, developer-friendly approach.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
