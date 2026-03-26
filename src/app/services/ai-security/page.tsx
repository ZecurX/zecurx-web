import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Bot, Shield, Code, Database, Search, Activity, Cpu, LineChart } from "lucide-react";
import Image from "next/image";
import ServiceBentoFeatures from "@/components/ui/service-bento-features";

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
        title: "LLM Application Testing",
        desc: "We test your LLM-powered apps against the OWASP Top 10, including prompt injection, data disclosure, and output handling. We find ways attackers bypass controls.",
        icon: "Bot",
        span: 3,
        variant: "highlight" as const,
    },
    {
        title: "Prompt Injection & Jailbreaks",
        desc: "Testing for direct injection and indirect injection through RAG pipelines. We find ways to override prompts and extract instructions.",
        icon: "Code",
        span: 3,
    },
    {
        title: "AI Threat Modeling",
        desc: "Analyzing your AI system architecture to identify attack surfaces specific to ML systems and supply chain risks.",
        icon: "Shield",
        span: 2,
    },
    {
        title: "RAG & Agent Workflow Security",
        desc: "Assessing Retrieval-Augmented Generation systems and AI agents for vector DB vulnerabilities and excessive agency risks.",
        icon: "Database",
        span: 2,
    },
    {
        title: "System Prompt Leakage",
        desc: "Probing for system prompt leakage vulnerabilities and accidental disclosure of PII or training data through crafted queries.",
        icon: "Search",
        span: 2,
    },
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
        <main className="bg-[#f8fbff] min-h-screen text-[#0c1a2e] selection:bg-[#4a69e6]/30 relative overflow-hidden">
            <CreativeNavBar />

            {/* ── HERO ────────────────────────────────────────────── */}
            <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a69e6]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
                    <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
                </div>

                <div className="max-w-[1320px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <BlurFade delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white font-space-grotesk text-xs font-medium tracking-widest uppercase mb-6">
                                    Emerging Tech Security
                                </div>
                            </BlurFade>

                            <BlurFade delay={0.2}>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0c1a2e] mb-6 leading-[1.05] font-manrope">
                                    AI & LLM <span className="text-[#4a69e6]">Security</span>
                                </h1>
                            </BlurFade>

                            <BlurFade delay={0.3}>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-inter">
                                    Secure your AI systems against prompt injection, training data poisoning, and unauthorized model extraction before deployment.
                                </p>
                            </BlurFade>

                            <BlurFade delay={0.4}>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/contact"
                                        className="relative inline-flex items-center justify-center gap-2 bg-[#4a69e6] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                                    >
                                        Get an AI Security Review
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/how-we-work"
                                        className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                                    >
                                        How We Work
                                    </Link>
                                </div>
                            </BlurFade>
                        </div>

                        <BlurFade delay={0.3}>
                            <div className="flex justify-center lg:justify-end">
                                <div className="relative glass-card bg-white/50 border border-slate-200/60 rounded-3xl p-8 shadow-[0_18px_44px_rgba(30,58,95,0.05)] w-full max-w-[480px]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a69e6]/5 blur-[40px] rounded-full pointer-events-none" />
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com"}/images/services/cloud-security.png`}
                                        alt="AI Security illustration"
                                        width={400}
                                        height={400}
                                        className="w-full h-auto relative z-10 drop-shadow-sm"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* ── BENTO GRID (CAPABILITIES) ───────────────────────── */}
            <ServiceBentoFeatures
                label="Capabilities"
                title="What We"
                titleAccent="Test"
                subtitle="Specialized security testing for the unique attack surface of modern AI and ML systems."
                items={capabilities as any}
            />

            {/* ── WHAT YOU GET ─────────────────────────────────────── */}
            <section className="py-20 md:py-32 px-6 bg-white border-y border-slate-100 relative z-10">
                <div className="max-w-[1320px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        <div className="lg:col-span-4">
                            <BlurFade delay={0.1}>
                                <div className="lg:sticky lg:top-32">
                                    <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-4">
                                        Deliverables
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-bold font-manrope text-[#0c1a2e] mb-6 leading-tight">
                                        What You <span className="text-[#4a69e6]">Get</span>
                                    </h2>
                                    <p className="text-lg text-slate-600 font-inter leading-relaxed mb-8">
                                        Actionable insights and hardening strategies to secure your AI features against emerging LLM threats.
                                    </p>
                                </div>
                            </BlurFade>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {deliverables.map((item, i) => (
                                    <BlurFade key={i} delay={0.2 + (i * 0.1)} className="h-full">
                                        <div className="group glass-card h-full relative overflow-hidden p-8 rounded-3xl border border-slate-200/60 bg-[#f8fbff]/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a69e6]/5 blur-[40px] rounded-full group-hover:bg-[#4a69e6]/10 transition-colors pointer-events-none" />
                                            <div className="absolute top-6 right-6 text-6xl font-bold font-manrope text-white shadow-sm select-none pointer-events-none z-0">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <div className="relative z-10 h-full flex flex-col pt-8">
                                                <h3 className="text-xl font-bold font-manrope text-[#0c1a2e] mb-3 group-hover:text-[#4a69e6] transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-slate-600 font-inter leading-relaxed text-[15px] flex-grow">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </BlurFade>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ──────────────────────────────────────── */}
            <section className="py-20 md:py-32 px-6 relative z-10">
                <div className="max-w-[1000px] mx-auto">
                    <BlurFade delay={0.2}>
                        <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4a69e6]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4a69e610_1px,transparent_1px),linear-gradient(to_bottom,#4a69e610_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                                    Building with AI? <span className="text-[#4a69e6]">Secure it properly.</span>
                                </h2>
                                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                                    Get ahead of AI-specific threats. We help you ship AI features with confidence.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link
                                        href="/contact"
                                        className="relative inline-flex items-center justify-center gap-2 bg-[#4a69e6] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                                    >
                                        Contact Us
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                                    >
                                        All Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>

            <Footer />
        </main>
    );
}
