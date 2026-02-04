import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

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
                        DevSecOps
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                        Integrate security into your CI/CD pipeline. We help you shift left with automated security testing, Kubernetes hardening, and secure deployment practices.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                        >
                            Get DevSecOps Support
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
                                <span className="text-muted-foreground">Implement</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Security automation that scales with your development velocity.
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
                                Security that enables velocity, not slows it down. Automated guardrails your developers will actually use.
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
                            Ready to secure your pipeline?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Build security into your development workflow from day one. Fast, automated, developer-friendly.
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
