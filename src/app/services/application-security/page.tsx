import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";

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
        desc: "We perform deep-dive manual testing combined with automated scanning to identify complex vulnerabilities like logic flaws, race conditions, and access control bypasses (IDOR) that standard scanners miss. We align our testing with OWASP Top 10 and WASC standards."
    },
    {
        title: "API Security Testing",
        desc: "Modern apps run on APIs. We test your REST, GraphQL, and gRPC endpoints for broken object level authorization (BOLA), mass assignment, and injection flaws. We verify that your backend validates every request, not just the ones from your UI."
    },
    {
        title: "Business Logic Assessment",
        desc: "We analyze your specific application workflows to find flaws that technical scanners can't see—like coupon fraud, pricing manipulation, or privilege escalation through legitimate features. This requires understanding your business context, not just your code."
    },
    {
        title: "Secure Code Review",
        desc: "We review your source code (manual + SAST) to catch security issues at the root. We identify hardcoded secrets, insecure cryptographic implementations, and vulnerable dependencies in your codebase before they reach production."
    },
    {
        title: "Authentication & Authorization",
        desc: "We rigorously test your IAM implementation. This includes testing for session fixation, JWT weaknesses, OAuth/OIDC misconfigurations, and ensuring that multi-tenant data isolation is strictly enforced."
    },
    {
        title: "Retesting & Fix Validation",
        desc: "We don't just hand you a report and leave. We retest every fixed vulnerability to ensure the remediation is effective and hasn't introduced new regressions. You get a clean bill of health report for your auditors."
    }
];

const deliverables = [
    {
        title: "Executive Summary",
        desc: "A high-level risk overview designed for stakeholders and non-technical leadership, highlighting business impact and ROI of remediation."
    },
    {
        title: "Technical Vulnerability Report",
        desc: "Detailed findings with CVSS scores, proof-of-concept (PoC) exploits, and step-by-step reproduction instructions for your engineering team."
    },
    {
        title: "Remediation Roadmap",
        desc: "Prioritized fix recommendations tailored to your tech stack (e.g., 'Use this specific React hook' instead of generic advice), helping you fix critical issues fast."
    },
    {
        title: "Compliance Artifacts",
        desc: "Formal testing attestations and reports that satisfy requirements for SOC 2, ISO 27001, HIPAA, and vendor security questionnaires."
    }
];

export default function ApplicationSecurityPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="mb-8">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                                    Core Security Service
                                </span>
                            </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                                Application Security
                            </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                                We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them.
                            </p>
                    <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                                >
                                    Get a Security Assessment
                                </Link>
                                <Link
                                    href="/how-we-work"
                                    className="px-8 py-4 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                                >
                                    How We Work
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com'}/images/services/application-security.png`}
                                alt="Application Security illustration"
                                width={500}
                                height={500}
                                className="w-full max-w-md dark:invert dark:hue-rotate-180"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEvUExURZ2u8Z2t8p2u8p6u856v8p6u8Zys75mp7ZOl6Y2f5aCx8Z+w8Z+v8p+v8p+v8Z6v8J2t75qr7JWn6ZCi5aS18aOz8aKy8aGx8aGx8aCx8J+w7p2u7Jmr6ZWn5qm48ae38aa28aa28aW18KW176S07qKy7KCw6Zyt56y88qy78qy78qy78ay78ay78Ku676q57ae36qS06K+/87C/87LA87PB8rTC8rTC8bTC8LLA7rC+7K276rLB87TD87fF9LnH9LvI9LzJ87zJ8rrH8LjF7rTC7LPC87fF9LvJ9L7L9cHO9cLP9cLP9MHN87/L8bvH7rTD87nH9L7L9cLP9sXR9sfT9sjT9sfS9MTQ88HM8LTD87vJ9MDN9sXR98nU98vW98zX98vW9snU9cbR8v///x86rZoAAABkdFJOUwECAwUGBgUEAgECAwYICgoJBgQCAwUJDQ8PDQkGAwQIDBETExAMBwQFCg8UFxYSDQgEBgsRFhgXEw0IBAUKEBUXFhEMBwMECA0SExIOCQUDAwYJDA4NCgYDAgIDBQcIBwUDAgHYG7ayAAAAAWJLR0Rkwtq4CQAAAHZJREFUCB1jYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full h-px bg-border/40 max-w-7xl mx-auto px-6" />

            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <h2 className="text-3xl font-bold text-foreground mb-6 leading-tight">
                                What We <br />
                                <span className="text-muted-foreground">Test</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Comprehensive coverage across your application attack surface. We go beyond automated scanners.
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
                                Actionable intelligence, not just a list of bugs. We provide the context you need to fix issues fast.
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
                            Ready to secure your application?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Get a security assessment tailored to your tech stack. Fast turnaround, developer-friendly reports.
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
