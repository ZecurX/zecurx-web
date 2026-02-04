import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Secure Code Review Services | ZecurX",
    description: "Expert manual code review combined with SAST analysis. We find vulnerabilities at the source before they reach production.",
    keywords: ["secure code review", "SAST", "source code analysis", "code audit", "security review", "static analysis"],
    openGraph: {
        title: "Secure Code Review Services | ZecurX",
        description: "Expert manual code review combined with SAST analysis to find vulnerabilities at the source.",
        type: "website",
        url: "https://zecurx.com/services/secure-code-review",
    },
    alternates: {
        canonical: "https://zecurx.com/services/secure-code-review",
    },
};

const capabilities = [
    {
        title: "Manual Security Code Review",
        desc: "Our security engineers manually review your codebase to identify complex vulnerabilities that automated tools miss—business logic flaws, race conditions, authentication bypasses, and insecure design patterns. We go beyond OWASP Top 10 to find high-impact issues."
    },
    {
        title: "SAST Integration & Triage",
        desc: "We run static application security testing tools tuned for your tech stack, then manually triage results to eliminate false positives. You get actionable findings with context-aware analysis that filters out unreachable code paths."
    },
    {
        title: "Dependency & Supply Chain Analysis",
        desc: "We analyze your third-party dependencies for known vulnerabilities (CVEs) and assess transitive dependency risks. We map your full dependency graph and prioritize which vulnerable packages actually need immediate updates based on exploitability."
    },
    {
        title: "Secrets & Credential Detection",
        desc: "We scan your repositories for hardcoded API keys, database credentials, private keys, and tokens. We also review your secrets management implementation to ensure proper handling throughout your development lifecycle."
    },
    {
        title: "Cryptographic Implementation Review",
        desc: "We assess your encryption, hashing, and key management implementations. We identify weak algorithms, improper IV/nonce handling, insecure random number generation, and key storage issues that could compromise data protection."
    },
    {
        title: "Architecture & Data Flow Analysis",
        desc: "Beyond line-by-line review, we assess your overall security architecture—trust boundaries, data flow paths, authentication mechanisms, and authorization models to identify systemic weaknesses and design-level vulnerabilities."
    }
];

const deliverables = [
    {
        title: "Annotated Code Findings",
        desc: "Each vulnerability is linked directly to the affected code with line numbers, file paths, and inline annotations explaining the issue and fix."
    },
    {
        title: "Severity-Ranked Report",
        desc: "Findings categorized by criticality with CVSS scores, exploitability assessment, and business impact analysis to help you prioritize remediation."
    },
    {
        title: "Fix Recommendations",
        desc: "Specific, implementable fix suggestions in your language and framework—not generic advice but actual code snippets and patterns you can use."
    },
    {
        title: "Security Patterns Guide",
        desc: "A tailored guide of secure coding patterns for your tech stack to prevent similar vulnerabilities in future development."
    }
];

export default function SecureCodeReviewPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-8">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Source Code Security
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        Secure Code Review
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                        Expert manual code review combined with SAST analysis. We find vulnerabilities at the source before they reach production.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Request a Code Review
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
                                What We <br />
                                <span className="text-muted-foreground">Review</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Deep analysis of your source code to find security issues before attackers do.
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
                                Developer-friendly reports with actionable fixes, not just a list of problems.
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
                            Ready to secure your codebase?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Get expert eyes on your code. We support all major languages and frameworks.
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
