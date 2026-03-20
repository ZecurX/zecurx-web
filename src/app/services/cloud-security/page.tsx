import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Cloud, Shield, Lock, Container, Database, Code } from "lucide-react";
import Image from "next/image";
import ServiceBentoFeatures from "@/components/ui/service-bento-features";

export const metadata: Metadata = {
    title: "Cloud Security Services | ZecurX",
    description: "Secure your AWS, GCP, and Azure environments. We identify misconfigurations, excessive permissions, and compliance gaps before they become breaches.",
    keywords: ["cloud security", "AWS security", "Azure security", "GCP security", "cloud penetration testing", "CSPM"],
    openGraph: {
        title: "Cloud Security Services | ZecurX",
        description: "Secure your AWS, GCP, and Azure environments with expert cloud security assessments.",
        type: "website",
        url: "https://zecurx.com/services/cloud-security",
    },
    alternates: {
        canonical: "https://zecurx.com/services/cloud-security",
    },
};

const capabilities = [
    {
        title: "Cloud Posture Assessment",
        desc: "We audit your AWS, GCP, or Azure environment against CIS benchmarks. We identify publicly exposed storage, overly permissive IAM, and misconfigurations automated tools miss.",
        icon: "Shield",
        span: 3,
        variant: "highlight" as const,
    },
    {
        title: "Attack Path Analysis",
        desc: "We map how an attacker could move through your cloud—correlating vulnerabilities, identities, and network exposure to identify 'toxic combinations'.",
        icon: "Cloud",
        span: 3,
    },
    {
        title: "IAM & Entitlement Review",
        desc: "We analyze identity and access management to find shadow admins and risky trust relationships, helping you implement least-privilege access.",
        icon: "Lock",
        span: 2,
    },
    {
        title: "Container & K8s Security",
        desc: "We assess your EKS, AKS, and GKE clusters for pod security misconfigurations, network policy gaps, and secrets exposure.",
        icon: "Box", // Using a standard icon, Box/Container
        span: 2,
    },
    {
        title: "Data Security Posture",
        desc: "We discover and classify sensitive data in your S3, Azure Blobs, GCS, and databases. We identify exposure risks and help implement encryption.",
        icon: "Database",
        span: 2,
    },
];

const deliverables = [
    {
        title: "Cloud Security Posture Report",
        desc: "A comprehensive assessment of your cloud environment with risk-ranked findings mapped to CIS benchmarks and compliance frameworks (SOC 2, ISO 27001, PCI-DSS)."
    },
    {
        title: "Attack Path Analysis",
        desc: "Visual representation of how an attacker could move through your cloud environment, from initial access to critical asset compromise, with specific remediation steps."
    },
    {
        title: "Infrastructure-as-Code Review",
        desc: "We review your Terraform, CloudFormation, or Pulumi templates to catch security issues before they're deployed. Shift-left security for your infrastructure."
    },
    {
        title: "Remediation Playbooks",
        desc: "Step-by-step fix instructions specific to your cloud provider with CLI commands, console steps, and IaC snippets you can implement immediately."
    }
];

export default function CloudSecurityPage() {
    return (
        <main className="bg-[#f8fbff] min-h-screen text-[#0c1a2e] selection:bg-[#4a6ffa]/30 relative overflow-hidden">
            <CreativeNavBar />

            {/* ── HERO ────────────────────────────────────────────── */}
            <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a6ffa]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
                    <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
                </div>

                <div className="max-w-[1320px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <BlurFade delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white font-space-grotesk text-xs font-medium tracking-widest uppercase mb-6">
                                    Infrastructure Security
                                </div>
                            </BlurFade>

                            <BlurFade delay={0.2}>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0c1a2e] mb-6 leading-[1.05] font-manrope">
                                    Cloud <span className="text-[#4a6ffa]">Security</span>
                                </h1>
                            </BlurFade>

                            <BlurFade delay={0.3}>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-inter">
                                    Secure your AWS, GCP, and Azure environments. We identify misconfigurations, excessive permissions, and compliance gaps before they become breaches.
                                </p>
                            </BlurFade>

                            <BlurFade delay={0.4}>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/contact"
                                        className="relative inline-flex items-center justify-center gap-2 bg-[#4a6ffa] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                                    >
                                        Get a Cloud Assessment
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
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a6ffa]/5 blur-[40px] rounded-full pointer-events-none" />
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com"}/images/services/cloud-security.png`}
                                        alt="Cloud Security illustration"
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
                titleAccent="Assess"
                subtitle="Full-stack cloud security coverage across compute, storage, networking, and identity layers."
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
                                        What You <span className="text-[#4a6ffa]">Get</span>
                                    </h2>
                                    <p className="text-lg text-slate-600 font-inter leading-relaxed mb-8">
                                        Cloud-native security insights with actionable remediation guidance for your specific environment.
                                    </p>
                                </div>
                            </BlurFade>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {deliverables.map((item, i) => (
                                    <BlurFade key={i} delay={0.2 + (i * 0.1)} className="h-full">
                                        <div className="group glass-card h-full relative overflow-hidden p-8 rounded-3xl border border-slate-200/60 bg-[#f8fbff]/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a6ffa]/5 blur-[40px] rounded-full group-hover:bg-[#4a6ffa]/10 transition-colors pointer-events-none" />
                                            <div className="absolute top-6 right-6 text-6xl font-bold font-manrope text-white shadow-sm select-none pointer-events-none z-0">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <div className="relative z-10 h-full flex flex-col pt-8">
                                                <h3 className="text-xl font-bold font-manrope text-[#0c1a2e] mb-3 group-hover:text-[#4a6ffa] transition-colors">
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
                        <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4a6ffa]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4a6ffa10_1px,transparent_1px),linear-gradient(to_bottom,#4a6ffa10_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                                    Ready to secure your <span className="text-[#4a6ffa]">cloud</span>?
                                </h2>
                                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                                    Get a comprehensive cloud security assessment. We support AWS, GCP, Azure, and multi-cloud environments.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link
                                        href="/contact"
                                        className="relative inline-flex items-center justify-center gap-2 bg-[#4a6ffa] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
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
