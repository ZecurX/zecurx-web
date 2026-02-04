import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

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
        title: "Cloud Security Posture Assessment",
        desc: "We audit your AWS, GCP, or Azure environment against CIS benchmarks and 100+ compliance frameworks (SOC 2, HIPAA, PCI-DSS). We identify publicly exposed storage, overly permissive IAM policies, unencrypted data stores, and misconfigurations that automated tools miss."
    },
    {
        title: "Attack Path Analysis",
        desc: "We map how an attacker could move through your cloud environment—correlating vulnerabilities, identities, network exposure, and secrets to identify 'toxic combinations' that create viable paths from initial access to critical asset compromise."
    },
    {
        title: "IAM & Entitlement Review (CIEM)",
        desc: "We analyze your identity and access management to find shadow admins, over-privileged service accounts, unused credentials, and risky cross-account trust relationships. We help you implement least-privilege access across your cloud estate."
    },
    {
        title: "Container & Kubernetes Security",
        desc: "We assess your EKS, AKS, and GKE clusters for pod security misconfigurations, network policy gaps, RBAC weaknesses, and secrets exposure. We test for container escape scenarios and cluster compromise paths."
    },
    {
        title: "Data Security Posture (DSPM)",
        desc: "We discover and classify sensitive data (PII, PHI, credentials) in your S3 buckets, Azure Blobs, GCS, and databases. We identify data exposure risks and help you implement proper access controls and encryption."
    },
    {
        title: "Serverless & Multi-Cloud Review",
        desc: "We test Lambda, Cloud Functions, and Azure Functions for injection flaws, excessive permissions, and insecure triggers. For multi-cloud environments, we ensure consistent security controls across all providers."
    }
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
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/3 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-8">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                            Infrastructure Security
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        Cloud Security
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                        Secure your AWS, GCP, and Azure environments. We identify misconfigurations, excessive permissions, and compliance gaps before they become breaches.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get a Cloud Assessment
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
                                <span className="text-muted-foreground">Assess</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Full-stack cloud security coverage across compute, storage, networking, and identity layers.
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
                                Cloud-native security insights with actionable remediation guidance for your specific environment.
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
                            Ready to secure your cloud?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Get a comprehensive cloud security assessment. We support AWS, GCP, Azure, and multi-cloud environments.
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
