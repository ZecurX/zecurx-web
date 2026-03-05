import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import ServiceBentoFeatures from "@/components/ui/service-bento-features";
import {
    FadeUp,
    FadeUpScroll,
    StaggerGrid,
    StaggerItem,
    HoverCard,
    ScaleInScroll,
} from "@/components/services/ServicePageAnimations";

export const metadata: Metadata = {
    title: "Application Security Services | ZecurX",
    description: "We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them. Web, API, and source code security testing.",
    keywords: ["application security", "penetration testing", "API security", "OWASP", "secure code review", "web security"],
    openGraph: {
        title: "Application Security Services | ZecurX",
        description: "We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them.",
        type: "website",
        url: "https://zecurx.com/services/application-security",
    },
    alternates: {
        canonical: "https://zecurx.com/services/application-security",
    },
};

const capabilities = [
    {
        title: "Web Application Penetration Testing",
        desc: "We perform deep-dive manual testing combined with automated scanning to identify complex vulnerabilities like logic flaws, race conditions, and access control bypasses (IDOR) that standard scanners miss. We align our testing with OWASP Top 10 and WASC standards.",
        icon: "Search",
        span: 6,
        variant: "highlight",
    },
    {
        title: "API Security Testing",
        desc: "Modern apps run on APIs. We test your REST, GraphQL, and gRPC endpoints for broken object level authorization (BOLA), mass assignment, and injection flaws. We verify that your backend validates every request, not just the ones from your UI.",
        icon: "Code",
        span: 3,
    },
    {
        title: "Business Logic Assessment",
        desc: "We analyze your specific application workflows to find flaws that technical scanners can't see—like coupon fraud, pricing manipulation, or privilege escalation through legitimate features. This requires understanding your business context, not just your code.",
        icon: "FileCode",
        span: 3,
    },
    {
        title: "Secure Code Review",
        desc: "We review your source code (manual + SAST) to catch security issues at the root. We identify hardcoded secrets, insecure cryptographic implementations, and vulnerable dependencies in your codebase before they reach production.",
        icon: "FileCheck",
        span: 2,
    },
    {
        title: "Authentication & Authorization",
        desc: "We rigorously test your IAM implementation. This includes testing for session fixation, JWT weaknesses, OAuth/OIDC misconfigurations, and ensuring that multi-tenant data isolation is strictly enforced.",
        icon: "KeyRound",
        span: 2,
    },
    {
        title: "Retesting & Fix Validation",
        desc: "We don't just hand you a report and leave. We retest every fixed vulnerability to ensure the remediation is effective and hasn't introduced new regressions. You get a clean bill of health report for your auditors.",
        icon: "CheckCircle",
        span: 2,
    },
];

const deliverables = [
    {
        title: "Executive Summary",
        desc: "A high-level risk overview designed for stakeholders and non-technical leadership, highlighting business impact and ROI of remediation.",
    },
    {
        title: "Technical Vulnerability Report",
        desc: "Detailed findings with CVSS scores, proof-of-concept (PoC) exploits, and step-by-step reproduction instructions for your engineering team.",
    },
    {
        title: "Remediation Roadmap",
        desc: "Prioritized fix recommendations tailored to your tech stack (e.g., 'Use this specific React hook' instead of generic advice), helping you fix critical issues fast.",
    },
    {
        title: "Compliance Artifacts",
        desc: "Formal testing attestations and reports that satisfy requirements for SOC 2, ISO 27001, HIPAA, and vendor security questionnaires.",
    },
];

const stats = [
    { value: "500+", label: "Vulnerabilities Found" },
    { value: "98%", label: "Fix Rate" },
    { value: "48h", label: "Avg. Turnaround" },
];

const appSecCaseStudies: CaseStudy[] = [
    {
        id: 1,
        heading: "Critical IDOR Vulnerability Eliminated",
        quote:
            "ZecurX found a critical IDOR flaw in our multi-tenant SaaS that could have exposed all customer data. Their team didn't just report it — they helped us redesign the authorization layer.",
        name: "Rahul Sharma",
        role: "CTO, FinTech Startup",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop",
        icon: "ShieldCheck",
        metrics: [
            { value: "23", label: "Critical Vulns Found", sub: "In first assessment" },
            { value: "100%", label: "Fix Rate", sub: "Within 30 days" },
        ],
    },
    {
        id: 2,
        heading: "API Security Overhaul",
        quote:
            "Our GraphQL API had broken access controls that automated scanners completely missed. ZecurX's manual testing uncovered 12 BOLA vulnerabilities across our endpoints.",
        name: "Priya Nair",
        role: "Engineering Lead, HealthTech",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop",
        icon: "Bug",
        metrics: [
            { value: "12", label: "BOLA Flaws Patched", sub: "Across API surface" },
            { value: "40%", label: "Faster Releases", sub: "With security built-in" },
        ],
    },
    {
        id: 3,
        heading: "SOC 2 Pentest Passed First Try",
        quote:
            "We needed a penetration test for SOC 2 Type II. ZecurX provided a thorough assessment with compliance-ready artifacts that our auditor accepted without any questions.",
        name: "Ankit Verma",
        role: "VP Engineering, SaaS Platform",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=800&fit=crop",
        icon: "Scan",
        metrics: [
            { value: "48h", label: "Report Delivery", sub: "After testing completed" },
            { value: "0", label: "Audit Findings", sub: "Zero non-conformities" },
        ],
    },
];

export default function ApplicationSecurityPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            {/* ── HERO ────────────────────────────────────────────── */}
            <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-foreground/[0.015] blur-[80px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <FadeUp delay={0}>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
                                        Core Security Service
                                    </span>
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.1}>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                                    Application{" "}
                                    <span className="text-muted-foreground">Security</span>
                                </h1>
                            </FadeUp>

                            <FadeUp delay={0.2}>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                                    We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them.
                                </p>
                            </FadeUp>

                            <FadeUp delay={0.3}>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/contact"
                                        className="group px-7 py-3.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2"
                                    >
                                        Get a Security Assessment
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                    <Link
                                        href="/how-we-work"
                                        className="px-7 py-3.5 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                                    >
                                        How We Work
                                    </Link>
                                </div>
                            </FadeUp>
                        </div>

                        <FadeUp delay={0.3}>
                            <div className="flex justify-center lg:justify-end">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-foreground/[0.03] blur-[60px] rounded-full scale-150 pointer-events-none" />
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com'}/images/services/application-security.png`}
                                        alt="Application Security illustration"
                                        width={400}
                                        height={400}
                                        className="w-56 h-56 md:w-72 md:h-72 relative z-10 dark:invert dark:hue-rotate-180 drop-shadow-lg"
                                        priority
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEvUExURZ2u8Z2t8p2u8p6u856v8p6u8Zys75mp7ZOl6Y2f5aCx8Z+w8Z+v8p+v8p+v8Z6v8J2t75qr7JWn6ZCi5aS18aOz8aKy8aGx8aGx8aCx8J+w7p2u7Jmr6ZWn5qm48ae38aa28aa28aW18KW176S07qKy7KCw6Zyt56y88qy78qy78qy78ay78ay78Ku676q57ae36qS06K+/87C/87LA87PB8rTC8rTC8bTC8LLA7rC+7K276rLB87TD87fF9LnH9LvI9LzJ87zJ8rrH8LjF7rTC7LPC87fF9LvJ9L7L9cHO9cLP9cLP9MHN87/L8bvH7rTD87nH9L7L9cLP9sXR9sfT9sjT9sfS9MTQ88HM8LTD87vJ9MDN9sXR98nU98vW98zX98vW9snU9cbR8v///x86rZoAAABkdFJOUwECAwUGBgUEAgECAwYICgoJBgQCAwUJDQ8PDQkGAwQIDBETExAMBwQFCg8UFxYSDQgEBgsRFhgXEw0IBAUKEBUXFhEMBwMECA0SExIOCQUDAwYJDA4NCgYDAgIDBQcIBwUDAgHYG7ayAAAAAWJLR0Rkwtq4CQAAAHZJREFUCB1jYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
                                    />
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ───────────────────────────────────────── */}
            <section className="border-y border-border/40 bg-muted/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-3 divide-x divide-border/40">
                        {stats.map((stat, i) => (
                            <FadeUpScroll key={i} delay={i * 0.1}>
                                <div className="py-10 md:py-14 text-center">
                                    <div className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </FadeUpScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHAT WE TEST (BENTO GRID) ───────────────────────── */}
            <ServiceBentoFeatures
                label="Capabilities"
                title="What We"
                titleAccent="Test"
                subtitle="Comprehensive coverage across your application attack surface. We go beyond automated scanners."
                items={capabilities as any}
            />

            {/* ── WHAT YOU GET ─────────────────────────────────────── */}
            <section className="py-20 md:py-32 px-6 bg-muted/5 border-y border-border/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        <div className="lg:col-span-4">
                            <FadeUpScroll>
                                <div className="lg:sticky lg:top-32">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">
                                        Deliverables
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                                        What You{" "}
                                        <span className="text-muted-foreground">Get</span>
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                        Actionable intelligence, not just a list of bugs. We provide the context you need to fix issues fast.
                                    </p>
                                    <div className="hidden lg:block w-12 h-0.5 bg-foreground/20" />
                                </div>
                            </FadeUpScroll>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {deliverables.map((item, i) => (
                                    <FadeUpScroll key={i} delay={i * 0.08}>
                                        <div className="group relative p-6 md:p-8 rounded-2xl border border-border/50 bg-background hover:border-foreground/20 transition-all duration-300 h-full">
                                            <div className="absolute top-6 right-6 text-6xl font-bold text-foreground/[0.03] select-none">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </FadeUpScroll>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CASE STUDIES ─────────────────────────────────────── */}
            <CaseStudies
                title="Proven security outcomes"
                subtitle="See how our application security assessments have helped teams ship secure code faster."
                studies={appSecCaseStudies}
            />

            {/* ── BOTTOM CTA ──────────────────────────────────────── */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScaleInScroll>
                        <div className="relative p-8 md:p-14 rounded-3xl border border-border/40 bg-card/20 overflow-hidden text-center">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                                    Ready to secure your application?
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                                    Get a security assessment tailored to your tech stack. Fast turnaround, developer-friendly reports.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link
                                        href="/contact"
                                        className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                        Contact Us
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="px-8 py-4 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                                    >
                                        All Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScaleInScroll>
                </div>
            </section>

            <Footer />
        </main>
    );
}
