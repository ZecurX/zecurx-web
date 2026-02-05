import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
    title: "AI Security Services | ZecurX",
    description: "Secure your AI/ML systems and LLM applications. We provide threat modeling, prompt injection testing, and abuse scenario analysis for AI-powered products.",
    keywords: ["AI security", "LLM security", "prompt injection", "AI red teaming", "machine learning security", "GenAI security"],
    openGraph: {
        title: "AI Security Services | ZecurX",
        description: "Secure your AI/ML systems and LLM applications with expert threat modeling and testing.",
        type: "website",
        url: "https://zecurx.com/services/ai-security",
    },
    alternates: {
        canonical: "https://zecurx.com/services/ai-security",
    },
};

const capabilities = [
    {
        title: "LLM Application Security Testing",
        desc: "We test your LLM-powered applications against the OWASP LLM Top 10 (2025), including prompt injection, sensitive information disclosure, and improper output handling. We identify ways attackers can manipulate your AI to bypass controls or leak sensitive data."
    },
    {
        title: "Prompt Injection & Jailbreak Testing",
        desc: "We systematically test for both direct injection (jailbreaking) and indirect injection through RAG pipelines. We find ways to override system prompts, extract hidden instructions, exfiltrate data via poisoned documents, and trigger unauthorized actions."
    },
    {
        title: "AI Threat Modeling",
        desc: "We analyze your AI system architecture to identify attack surfaces specific to ML systems—from training data poisoning and model extraction to adversarial inputs and supply chain risks in third-party models, datasets, and plugins."
    },
    {
        title: "RAG & Agentic Workflow Security",
        desc: "We assess your Retrieval-Augmented Generation systems and AI agents for vector database vulnerabilities, document injection attacks, excessive agency risks, and authorization bypasses in tool/function calling workflows."
    },
    {
        title: "System Prompt & Data Leakage Testing",
        desc: "We probe for system prompt leakage vulnerabilities that reveal hidden instructions. We test for accidental disclosure of PII, training data, and confidential information through crafted queries and edge-case inputs."
    },
    {
        title: "Resource & Cost Abuse Analysis",
        desc: "We identify denial-of-service vectors and unbounded consumption risks—recursive agentic loops, token exhaustion attacks, and resource abuse scenarios that could degrade performance or exhaust API credits."
    }
];

const deliverables = [
    {
        title: "OWASP LLM Top 10 Assessment",
        desc: "Comprehensive findings mapped to the OWASP LLM Top 10 (2025) framework with risk ratings, exploitation scenarios, and prioritized remediation aligned to industry standards."
    },
    {
        title: "Prompt Injection Test Report",
        desc: "Detailed results of adversarial testing with successful payloads, bypass techniques discovered, and specific hardening recommendations for your prompts, guardrails, and input/output filters."
    },
    {
        title: "AI Guardrails Architecture",
        desc: "Tailored recommendations for implementing defense-in-depth—input validation, output sanitization, content moderation, rate limiting, and least-privilege controls for AI agents and tools."
    },
    {
        title: "Red Team Attack Narratives",
        desc: "Step-by-step attack chains showing how vulnerabilities could be exploited in practice—from initial prompt manipulation to data exfiltration or unauthorized actions—helping your team understand real-world impact."
    }
];

export default function AISecurityPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-8">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Emerging Technology Security
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        AI Security
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                        Secure your AI/ML systems and LLM applications. We provide threat modeling, prompt injection testing, and abuse scenario analysis for AI-powered products.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get an AI Security Review
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
                                <span className="text-muted-foreground">Test</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Specialized security testing for the unique attack surface of AI systems.
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
                                Actionable insights to secure your AI systems against emerging threats.
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
                            Building with AI? Secure it properly.
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Get ahead of AI-specific threats. We help you ship AI features with confidence.
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
