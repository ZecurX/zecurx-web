import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Secure Development Services | ZecurX",
    description: "Build secure MVPs and prototypes from day one. We help startups and teams implement security-first development practices without slowing down.",
    keywords: ["secure development", "secure MVP", "security consulting", "startup security", "secure by design", "security architecture"],
    openGraph: {
        title: "Secure Development Services | ZecurX",
        description: "Build secure MVPs and prototypes from day one with security-first development practices.",
        type: "website",
        url: "https://zecurx.com/services/secure-development",
    },
    alternates: {
        canonical: "https://zecurx.com/services/secure-development",
    },
};

const capabilities = [
    {
        title: "Security Architecture Design",
        desc: "We help you design secure system architecture from the ground up—authentication flows, data protection strategies, API security patterns, and infrastructure design. Get it right the first time so you don't need to rearchitect later."
    },
    {
        title: "Embedded Security Engineering",
        desc: "Building fast doesn't mean building insecure. We work alongside your development team as embedded security engineers, catching issues in real-time during design and code review rather than after the sprint."
    },
    {
        title: "Authentication & Authorization Design",
        desc: "We design and review your IAM implementation—OAuth/OIDC flows, session management, RBAC/ABAC models, JWT handling, and multi-tenancy isolation. We help you implement patterns that scale securely."
    },
    {
        title: "Security Requirements Translation",
        desc: "We translate compliance requirements (SOC 2, HIPAA, GDPR, PCI-DSS) into actionable technical specifications your developers can implement. No more guessing what 'adequate security controls' means in code."
    },
    {
        title: "Secure API & Protocol Design",
        desc: "We help you design APIs that are secure by default—proper authentication, fine-grained authorization, input validation, rate limiting, and error handling patterns that prevent common vulnerabilities."
    },
    {
        title: "Security Tooling & Automation",
        desc: "We help you build or select the right security tools for your stack. From custom security linters to automated testing frameworks, we focus on tooling that catches bugs early and scales with your team."
    }
];

const deliverables = [
    {
        title: "Security Architecture Document",
        desc: "A comprehensive security design document covering your application's security controls, data flows, trust boundaries, and threat model—a living document for your team."
    },
    {
        title: "Security Implementation Guide",
        desc: "Step-by-step implementation guidance for security controls specific to your stack with code examples, library recommendations, and configuration templates."
    },
    {
        title: "Compliance Mapping",
        desc: "Clear mapping of your security controls to compliance requirements (SOC 2, HIPAA, etc.) to streamline future audits and security questionnaires."
    },
    {
        title: "Ongoing Security Support",
        desc: "Retainer-based access to security expertise for architecture reviews, code reviews, and security questions as your product evolves."
    }
];

export default function SecureDevelopmentPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-8">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Security Engineering
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        Secure Development
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                        Build secure MVPs and prototypes from day one. We help startups and teams implement security-first development practices without slowing down.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get Development Support
                        </Link>
                        <Link
                            href="/how-we-work"
                            className="px-8 py-4 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                        >
                            How We Work
                        </Link>
                    </div>
                </div>
            </section>

            <div className="w-full h-px bg-border/40 max-w-7xl mx-auto px-6" />

            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <h2 className="text-3xl font-bold text-foreground mb-6 leading-tight">
                                How We <br />
                                <span className="text-muted-foreground">Help</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Security expertise embedded in your development process from the start.
                            </p>
                            <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col">
                        {capabilities.map((item, i) => (
                            <div key={i} className="group py-8 border-t border-white/10 first:border-0 first:pt-0">
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors flex items-center gap-3">
                                    <span className="text-xs font-mono text-primary/50 border border-primary/20 px-2 py-1 rounded">0{i + 1}</span>
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-lg pl-12">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-muted/5 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <h2 className="text-3xl font-bold text-foreground mb-6 leading-tight">
                                What You <br />
                                <span className="text-muted-foreground">Get</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Security built in, not bolted on. Documentation and guidance that scales with your team.
                            </p>
                            <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 gap-12">
                        {deliverables.map((item, i) => (
                            <div key={i} className="group relative pl-8 border-l border-white/10 hover:border-primary/50 transition-colors py-2">
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl border border-border/40 bg-card/20">
                        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                            Building something new?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Start with security from day one. We help you move fast without creating security debt.
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
