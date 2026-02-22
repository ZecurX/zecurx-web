import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Cloud & DevSecOps Security | ZecurX",
    description: "Most cloud breaches are caused by misconfigurations. We help you secure your cloud infrastructure and deployment pipelines.",
    keywords: ["cloud security", "DevSecOps", "AWS security", "Azure security", "GCP security", "CI/CD security", "Kubernetes security"],
    openGraph: {
        title: "Cloud & DevSecOps Security | ZecurX",
        description: "Most cloud breaches are caused by misconfigurations. We help you secure your cloud infrastructure and deployment pipelines.",
        type: "website",
        url: "https://zecurx.com/services/cloud-devsecops",
    },
    alternates: {
        canonical: "https://zecurx.com/services/cloud-devsecops",
    },
};

const scope = [
    {
        title: "Cloud Security Posture Review",
        desc: "We conduct a comprehensive audit of your AWS, GCP, or Azure environment against CIS Benchmarks and best practices. We identify open S3 buckets, unencrypted databases, and insecure security group rules that leave you exposed to the public internet."
    },
    {
        title: "IAM & Least Privilege Analysis",
        desc: "Identity is the new perimeter. We map out your IAM roles, policies, and permission chains to identify over-privileged users and services. We help you implement a true least-privilege model to limit blast radius in case of a breach."
    },
    {
        title: "Kubernetes & Container Security",
        desc: "We review your Kubernetes clusters (EKS, GKE, AKS) for misconfigurations. We check for insecure pod security policies, privileged containers, and exposed API servers, ensuring your orchestration layer is as secure as your applications."
    },
    {
        title: "CI/CD Pipeline Security",
        desc: "We secure your software supply chain. We audit your GitHub Actions, GitLab CI, or Jenkins pipelines to prevent secret leakage, code tampering, and unauthorized deployments. We help you embed security scans (SAST/DAST) directly into your pull requests."
    },
    {
        title: "Infrastructure as Code (IaC) Scanning",
        desc: "We scan your Terraform, CloudFormation, and Helm charts to catch security issues before they are deployed. By shifting security left, we help you prevent misconfigurations from ever reaching your production environment."
    },
    {
        title: "Secret Management Review",
        desc: "We identify hardcoded secrets in your codebase and configuration files. We help you migrate to secure secret management solutions like AWS Secrets Manager or HashiCorp Vault, ensuring sensitive keys are rotated and managed securely."
    }
];

const deliverables = [
    {
        title: "Cloud Risk Assessment Report",
        desc: "A detailed report categorizing vulnerabilities by severity (Critical, High, Medium, Low) with clear business impact statements."
    },
    {
        title: "Remediation Playbooks",
        desc: "Step-by-step guides and copy-paste CLI commands or Terraform code snippets to fix identified misconfigurations immediately."
    },
    {
        title: "Compliance Mapping",
        desc: "Mapping of findings to relevant compliance frameworks like SOC 2, ISO 27001, HIPAA, or PCI-DSS to support your audit readiness."
    },
    {
        title: "Architecture Review Session",
        desc: "A deep-dive workshop with your engineering team to discuss long-term architectural improvements and security patterns."
    }
];

export default function CloudDevSecOpsPage() {
    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="mb-8">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                                    Infrastructure Security
                                </span>
                            </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                                Cloud & DevSecOps Security
                            </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
                                Most cloud breaches are caused by misconfigurations. We help you secure your cloud infrastructure and deployment pipelines.
                            </p>
                    <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                                >
                                    Get a Cloud Audit
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
                                src={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://zecurx-web.fsn1.your-objectstorage.com'}/images/services/cloud-devsecops.png`}
                                alt="Cloud & DevSecOps Security illustration"
                                width={500}
                                height={500}
                                className="w-full max-w-md dark:invert dark:hue-rotate-180"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEvUExURba+4tjh9tjg9djf9dje9Nbd8tTa8dDV7snP68DG59rg9Nrg89rf89ne8djc8NXZ7tDU7MnN6L3D5K+3393g8d3g8dzf8Nvd79rb7dbX7NHS6cjK5ru/4quz3t/g79/f7t7e7d3c7Nva69fW6dDQ58bH5Li84aix3uHg7OHf6+Dd6t/b6dzY6NfU5s/N5cPE47W64aav3+Pf6ePe6OLc5+Da5tzW5dbR5MzK47/B47G44qOv4eXe5uTd5ePb5ODY5NvU49PP48jH47u+46225KGv5Obe4+Xc4uPa4uDX4tnS4tDM48PE5La85am05p+v5+fd4Obb4OPZ4N7V4dbQ4svJ477B5bC556Wz6J6v6ejc3eba3uLX39vT4NLN4sXG5Li+5qy36KKy6pyv6////xRKlZcAAABkdFJOUwADBQgJCQcFAgEGCxAUEw8KBQIBChMcIiEaEQkEAg8bKDAvJhkOBwMRIC84Ny0fEgkEER8tNzctIBQLBQ4ZJSwtJhwSCgUJEBgeHxsVDggEBQkNEBEQDQkGAwIEBgcICAYFAwLUWnaMAAAAAWJLR0Rkwtq4CQAAAHZJREFUCB1jYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
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
                                <span className="text-muted-foreground">Review</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                From your cloud console to your deployment scripts, we secure the entire infrastructure stack.
                            </p>
                            <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col">
                        {scope.map((item, i) => (
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
                                Practical, prioritized guidance to harden your environment without breaking your deployment velocity.
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
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-border/40 bg-card/20 text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">AWS</div>
                            <p className="text-sm text-muted-foreground">EC2, S3, IAM, Lambda, RDS</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/40 bg-card/20 text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">GCP</div>
                            <p className="text-sm text-muted-foreground">Compute, GCS, IAM, GKE</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/40 bg-card/20 text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">Azure</div>
                            <p className="text-sm text-muted-foreground">VMs, Blob, AD, AKS</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl border border-border/40 bg-card/20">
                        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                            Secure your cloud before it becomes a headline.
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl">
                            Get a cloud security audit from engineers who understand infrastructure at scale.
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
