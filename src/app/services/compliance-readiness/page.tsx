import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Compliance Readiness | ZecurX",
    description: "Prepare for security compliance without slowing down your product development. ISO 27001, SOC 2, and India DPDP Act readiness support.",
    keywords: ["compliance readiness", "ISO 27001", "SOC 2", "DPDP Act", "security compliance", "audit preparation"],
    openGraph: {
        title: "Compliance Readiness | ZecurX",
        description: "Prepare for security compliance without slowing down your product development.",
        type: "website",
        url: "https://zecurx.com/services/compliance-readiness",
    },
    alternates: {
        canonical: "https://zecurx.com/services/compliance-readiness",
    },
};

const frameworks = [
    {
        title: "ISO 27001",
        desc: "We guide you through the entire ISMS implementation process. From defining your scope and conducting risk assessments to developing policies and preparing for the stage 1 and stage 2 audits. We help you build a security culture, not just pass a checklist."
    },
    {
        title: "SOC 2 (Type I & II)",
        desc: "We help SaaS companies prepare for SOC 2 audits. We assist with defining your trust service criteria (Security, Availability, Confidentiality, etc.), mapping controls to your existing processes, and collecting evidence to prove operational effectiveness over time."
    },
    {
        title: "India DPDP Act",
        desc: "We help businesses align with India's Digital Personal Data Protection Act. We assist with data mapping, consent management architectures, grievance redressal mechanisms, and implementing technical safeguards for personal data."
    },
    {
        title: "HIPAA Security Rule",
        desc: "For healthcare-related applications, we ensure you meet the physical, technical, and administrative safeguards required to protect ePHI. We help with risk analysis, business associate agreements, and access control implementations."
    }
];

const scope = [
    {
        title: "Gap Assessment",
        desc: "We perform a detailed analysis of your current security posture against the target framework's controls. You get a clear roadmap of exactly what is missing and how to fix it."
    },
    {
        title: "Policy & Control Documentation",
        desc: "We don't give you templates to fill out. We work with you to write custom Information Security Policies, Incident Response Plans, and SOPs that actually reflect how your startup operates."
    },
    {
        title: "Technical Control Implementation",
        desc: "We don't just write docs. We help you configure your cloud, endpoints, and tools to meet the technical requirements of the standard (e.g., setting up MDM, configuring AWS GuardDuty)."
    },
    {
        title: "Internal Audit Support",
        desc: "We conduct a mock audit before the real external auditor arrives. We interview your team, check your evidence, and identify any last-minute gaps to ensure you pass with zero non-conformities."
    }
];

export default function ComplianceReadinessPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="mb-8">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                                    Supporting Service
                                </span>
                            </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                                Compliance Readiness
                            </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                                Prepare for security compliance without slowing down your product development. We help you navigate frameworks with confidence.
                            </p>
                    <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                                >
                                    Start Compliance Journey
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
                                src={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com'}/images/services/compliance-readiness.png`}
                                alt="Compliance Readiness illustration"
                                width={500}
                                height={500}
                                className="w-full max-w-md dark:invert dark:hue-rotate-180"
                                priority
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
                                Frameworks <br />
                                <span className="text-muted-foreground">We Support</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Whether you are targeting enterprise deals or regulatory alignment, we have you covered.
                            </p>
                            <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col">
                        {frameworks.map((item, i) => (
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
                                How We <br />
                                <span className="text-muted-foreground">Help</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                We are not auditors. We are your partners in preparing for the audit, doing the heavy lifting on documentation and tech.
                            </p>
                            <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 gap-12">
                        {scope.map((item, i) => (
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
                            Need to get compliant?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            We help startups and SMEs navigate compliance without the enterprise overhead.
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
