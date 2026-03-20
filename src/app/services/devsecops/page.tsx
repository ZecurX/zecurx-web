import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroWords } from "@/components/ui/hero-words";
import { heroEnd } from "@/lib/hero-timing";

export const metadata: Metadata = {
    title: "DevSecOps Services | ZecurX",
    description: "Integrate security into your CI/CD pipeline. We help you shift left with automated security testing, Kubernetes hardening, and secure deployment practices.",
    keywords: ["DevSecOps", "CI/CD security", "Kubernetes security", "pipeline security", "shift left", "container security"],
    openGraph: {
        title: "DevSecOps Services | ZecurX",
        description: "Integrate security into your CI/CD pipeline with automated testing and Kubernetes hardening.",
        type: "website",
        url: "https://zecurx.com/services/devsecops",
    },
    alternates: {
        canonical: "https://zecurx.com/services/devsecops",
    },
};

const capabilities = [
    {
        title: "CI/CD Pipeline Security",
        desc: "We audit your build and deployment pipelines for security weaknesses—exposed secrets, unsigned artifacts, insecure plugin configurations, and missing security gates. We help you set up automated security checks that block vulnerabilities before they reach production."
    },
    {
        title: "SAST & SCA Integration",
        desc: "We implement and tune static analysis (SAST) and software composition analysis (SCA) tools for your codebase. We configure them to minimize false positives, generate automated fix PRs, and integrate seamlessly with your PR/MR workflow."
    },
    {
        title: "Kubernetes & Container Hardening",
        desc: "We assess your Kubernetes clusters for security misconfigurations including pod security standards, network policies, RBAC settings, and secrets management. We recommend secure base images and implement admission controllers to prevent insecure deployments."
    },
    {
        title: "Infrastructure as Code Security",
        desc: "We scan your Terraform, CloudFormation, Helm charts, and Kubernetes manifests to catch misconfigurations before deployment. We integrate policy-as-code tools like OPA/Gatekeeper and set up automated IaC security gates."
    },
    {
        title: "Secrets Management Implementation",
        desc: "We design and implement secure secrets management using HashiCorp Vault, AWS Secrets Manager, or cloud-native solutions. We set up secrets scanning in your pipeline to catch hardcoded credentials before they're committed."
    },
    {
        title: "Developer Security Enablement",
        desc: "We configure IDE plugins and CLI tools so developers can find vulnerabilities as they code—not after the sprint. We set up real-time security feedback that acts like a 'linter for security' rather than a blocking gate."
    }
];

const deliverables = [
    {
        title: "Pipeline Security Assessment",
        desc: "Comprehensive review of your CI/CD pipeline with specific findings and remediation steps for each stage from code commit to production deployment."
    },
    {
        title: "Security Integration Roadmap",
        desc: "A phased plan to integrate security tooling into your pipeline with minimal disruption to developer velocity and clear success metrics."
    },
    {
        title: "Hardening Runbooks",
        desc: "Step-by-step implementation guides for Kubernetes hardening, container security, and infrastructure-as-code policies tailored to your environment."
    },
    {
        title: "Developer Security Training",
        desc: "Hands-on training for your engineering team on secure development practices, security tool usage, and responding to security findings."
    }
];

export default function DevSecOpsPage() {
    return (
        <main className="min-h-screen bg-[#f8fbff] relative selection:bg-[#4a6ffa]/30">
            <CreativeNavBar />

            <div className="relative z-10 bg-[#f8fbff] mb-[700px] md:mb-[420px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] pb-20">
                {/* ── HERO ────────────────────────────────────────────── */}
                <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden">
                    <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4a6ffa]/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <BlurFade delay={0}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/60 bg-white/50 mb-8 backdrop-blur-sm shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4a6ffa]" />
                                <span className="text-xs font-semibold text-[#0c1a2e] uppercase tracking-[0.15em] font-['Space_Grotesk']">
                                    <HeroWords>Security Engineering</HeroWords>
                                </span>
                            </div>
                        </BlurFade>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0c1a2e] mb-6 leading-[1.05] font-['Manrope']">
                            <HeroWords delay={heroEnd(2)}>DevSecOps </HeroWords>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 font-['Inter']">
                            <HeroWords delay={heroEnd(4)}>
                                Integrate security into your CI/CD pipeline. We help you shift left with automated security testing, Kubernetes hardening, and secure deployment practices.
                            </HeroWords>
                        </p>

                        <div
                            className="flex flex-wrap gap-4 justify-center opacity-0"
                            style={{
                                animation: "word-appear 0.5s ease-out forwards",
                                animationDelay: `${heroEnd(22)}ms`,
                            }}
                        >
                            <Link
                                href="/contact"
                                className="group px-7 py-3.5 bg-[#4a6ffa] text-white font-semibold rounded-full hover:bg-[#3a5cea] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 shadow-[0_8px_20px_rgba(74,111,250,0.25)] hover:shadow-[0_12px_25px_rgba(74,111,250,0.35)]"
                            >
                                Get DevSecOps Support
                                <svg
                                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/how-we-work"
                                className="px-7 py-3.5 border border-slate-200 text-[#0c1a2e] font-medium rounded-full hover:bg-white transition-colors shadow-sm"
                            >
                                How We Work
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-slate-200/50 max-w-7xl mx-auto px-6" />

                {/* ── WHAT WE IMPLEMENT ──────────────────────────────── */}
                <section className="py-24 px-6 border-t border-slate-200/50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                        <div className="lg:col-span-1">
                            <BlurFade delay={0.2} inView>
                                <div className="lg:sticky lg:top-32">
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#0c1a2e] mb-6 leading-tight font-['Manrope']">
                                        What We <br className="hidden lg:block" />
                                        <span className="text-slate-500">Implement</span>
                                    </h2>
                                    <p className="text-slate-600 text-lg leading-relaxed mb-8 font-['Inter']">
                                        Security automation that scales with your development velocity.
                                    </p>
                                    <div className="hidden lg:block w-12 h-1 bg-[#4a6ffa] mb-8" />
                                </div>
                            </BlurFade>
                        </div>

                        <div className="lg:col-span-2 flex flex-col">
                            {capabilities.map((item, i) => (
                                <BlurFade key={i} delay={0.2 + i * 0.1} inView>
                                    <div className="group py-8 border-t border-slate-200/60 first:border-0 first:pt-0">
                                        <h3 className="text-xl font-bold text-[#0c1a2e] mb-3 group-hover:text-[#4a6ffa] transition-colors flex items-center gap-3 font-['Manrope']">
                                            <span className="text-xs font-mono text-[#4a6ffa]/70 border border-[#4a6ffa]/30 px-2 py-1 rounded bg-[#4a6ffa]/5">0{i + 1}</span>
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-lg pl-12 font-['Inter']">
                                            {item.desc}
                                        </p>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── WHAT YOU GET ──────────────────────────────────── */}
                <section className="py-24 px-6 bg-slate-50/50 border-y border-slate-200/50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                        <div className="lg:col-span-1">
                            <BlurFade delay={0.2} inView>
                                <div className="lg:sticky lg:top-32">
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#0c1a2e] mb-6 leading-tight font-['Manrope']">
                                        What You <br className="hidden lg:block" />
                                        <span className="text-slate-500">Get</span>
                                    </h2>
                                    <p className="text-slate-600 text-lg leading-relaxed mb-8 font-['Inter']">
                                        Security that enables velocity, not slows it down. Automated guardrails your developers will actually use.
                                    </p>
                                    <div className="hidden lg:block w-12 h-1 bg-[#4a6ffa] mb-8" />
                                </div>
                            </BlurFade>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {deliverables.map((item, i) => (
                                <BlurFade key={i} delay={0.2 + i * 0.1} inView>
                                    <div className="group relative p-6 md:p-8 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(30,58,95,0.04)] hover:shadow-[0_12px_40px_rgba(30,58,95,0.08)] hover:-translate-y-1 transition-all duration-300 h-full">
                                        <h3 className="text-xl font-bold text-[#0c1a2e] mb-3 group-hover:text-[#4a6ffa] transition-colors font-['Manrope']">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-[15px] font-['Inter']">
                                            {item.desc}
                                        </p>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── BOTTOM CTA ────────────────────────────────────── */}
                <section className="py-20 md:py-28 px-6">
                    <div className="max-w-4xl mx-auto">
                        <BlurFade delay={0.2} inView>
                            <div className="relative p-8 md:p-14 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl overflow-hidden text-center shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_50px_rgba(30,58,95,0.08)] transition-all duration-500">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-2xl md:text-4xl font-bold text-[#0c1a2e] mb-4 font-['Manrope']">
                                        Ready to secure your pipeline?
                                    </h2>
                                    <p className="text-slate-600 mb-8 max-w-lg mx-auto text-lg font-['Inter']">
                                        Build security into your development workflow from day one. Fast, automated, developer-friendly.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <Link
                                            href="/contact"
                                            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#4a6ffa] text-white font-semibold rounded-full hover:bg-[#3a5cea] hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(74,111,250,0.25)] hover:shadow-[0_12px_25px_rgba(74,111,250,0.35)]"
                                        >
                                            Contact Us
                                            <svg
                                                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </Link>
                                        <Link
                                            href="/services"
                                            className="px-8 py-4 border border-slate-200 text-[#0c1a2e] font-medium rounded-full hover:bg-white transition-colors shadow-sm"
                                        >
                                            All Services
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </section>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-0">
                <Footer />
            </div>
        </main>
    );
}
