import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import ServiceBentoFeatures from "@/components/ui/service-bento-features";
import {
  FadeUp,
  FadeUpScroll,
  StaggerGrid,
  StaggerItem,
  HoverCard,
  ScaleInScroll,
} from "@/components/services/ServicePageAnimations";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";

export const metadata: Metadata = {
  title: "Cloud & DevSecOps Security | ZecurX",
  description:
    "Most cloud breaches are caused by misconfigurations. We help you secure your cloud infrastructure and deployment pipelines.",
  keywords: [
    "cloud security",
    "DevSecOps",
    "AWS security",
    "Azure security",
    "GCP security",
    "CI/CD security",
    "Kubernetes security",
  ],
  openGraph: {
    title: "Cloud & DevSecOps Security | ZecurX",
    description:
      "Most cloud breaches are caused by misconfigurations. We help you secure your cloud infrastructure and deployment pipelines.",
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
    desc: "We conduct a comprehensive audit of your AWS, GCP, or Azure environment against CIS Benchmarks and best practices. We identify open S3 buckets, unencrypted databases, and insecure security group rules that leave you exposed to the public internet.",
    icon: "Search",
    span: 6,
    variant: "highlight",
  },
  {
    title: "IAM & Least Privilege Analysis",
    desc: "Identity is the new perimeter. We map out your IAM roles, policies, and permission chains to identify over-privileged users and services. We help you implement a true least-privilege model to limit blast radius in case of a breach.",
    icon: "Key",
    span: 3,
  },
  {
    title: "Kubernetes & Container Security",
    desc: "We review your Kubernetes clusters (EKS, GKE, AKS) for misconfigurations. We check for insecure pod security policies, privileged containers, and exposed API servers, ensuring your orchestration layer is as secure as your applications.",
    icon: "Container",
    span: 3,
  },
  {
    title: "CI/CD Pipeline Security",
    desc: "We secure your software supply chain. We audit your GitHub Actions, GitLab CI, or Jenkins pipelines to prevent secret leakage, code tampering, and unauthorized deployments. We help you embed security scans (SAST/DAST) directly into your pull requests.",
    icon: "GitBranch",
    span: 2,
  },
  {
    title: "Infrastructure as Code (IaC) Scanning",
    desc: "We scan your Terraform, CloudFormation, and Helm charts to catch security issues before they are deployed. By shifting security left, we help you prevent misconfigurations from ever reaching your production environment.",
    icon: "FileCode",
    span: 2,
  },
  {
    title: "Secret Management Review",
    desc: "We identify hardcoded secrets in your codebase and configuration files. We help you migrate to secure secret management solutions like AWS Secrets Manager or HashiCorp Vault, ensuring sensitive keys are rotated and managed securely.",
    icon: "KeyRound",
    span: 2,
  },
];

const deliverables = [
  {
    title: "Cloud Risk Assessment Report",
    desc: "A detailed report categorizing vulnerabilities by severity (Critical, High, Medium, Low) with clear business impact statements.",
  },
  {
    title: "Remediation Playbooks",
    desc: "Step-by-step guides and copy-paste CLI commands or Terraform code snippets to fix identified misconfigurations immediately.",
  },
  {
    title: "Compliance Mapping",
    desc: "Mapping of findings to relevant compliance frameworks like SOC 2, ISO 27001, HIPAA, or PCI-DSS to support your audit readiness.",
  },
  {
    title: "Architecture Review Session",
    desc: "A deep-dive workshop with your engineering team to discuss long-term architectural improvements and security patterns.",
  },
];

const platforms = [
  { name: "AWS", services: "EC2, S3, IAM, Lambda, RDS, EKS" },
  { name: "GCP", services: "Compute, GCS, IAM, GKE, Cloud Run" },
  { name: "Azure", services: "VMs, Blob, AD, AKS, Functions" },
];

const cloudCaseStudies: CaseStudy[] = [
  {
    id: 1,
    heading: "S3 Bucket Misconfiguration Averted",
    quote:
      "ZecurX discovered 14 publicly accessible S3 buckets containing customer PII during our cloud posture review. Their remediation playbook let us fix everything in under a day.",
    name: "Vikram Desai",
    role: "DevOps Lead, E-commerce Platform",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=800&fit=crop",
    icon: "Cloud",
    metrics: [
      {
        value: "14",
        label: "Exposed Buckets Fixed",
        sub: "Containing customer PII",
      },
      { value: "24h", label: "Time to Remediate", sub: "From report to fix" },
    ],
  },
  {
    id: 2,
    heading: "Kubernetes Cluster Hardened",
    quote:
      "Our EKS cluster had privileged containers and an exposed API server. ZecurX's team implemented pod security policies and network policies that locked everything down.",
    name: "Sneha Kapoor",
    role: "Platform Engineer, AI Startup",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=800&fit=crop",
    icon: "Container",
    metrics: [
      {
        value: "8",
        label: "Critical K8s Fixes",
        sub: "Pod security, RBAC, network",
      },
      { value: "0", label: "Incidents Post-Audit", sub: "Zero breaches since" },
    ],
  },
  {
    id: 3,
    heading: "CI/CD Pipeline Secrets Cleaned",
    quote:
      "We had API keys and database passwords hardcoded in our GitHub Actions workflows. ZecurX helped us migrate to Vault and set up secret scanning in our PRs.",
    name: "Arjun Menon",
    role: "SRE, SaaS Company",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&fit=crop",
    icon: "GitBranch",
    metrics: [
      { value: "37", label: "Secrets Rotated", sub: "Across all environments" },
      {
        value: "100%",
        label: "Pipeline Coverage",
        sub: "Automated secret scanning",
      },
    ],
  },
];

export default function CloudDevSecOpsPage() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[300px] bg-foreground/[0.015] blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <FadeUp delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
                    <HeroWords>Infrastructure Security</HeroWords>
                  </span>
                </div>
              </FadeUp>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                <HeroWords delay={heroEnd(2)}>Cloud & </HeroWords>
                <HeroWords delay={heroEnd(4)}>
                  <span className="text-muted-foreground">DevSecOps</span>
                </HeroWords>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                <HeroWords delay={heroEnd(5)}>
                  Most cloud breaches are caused by misconfigurations. We help
                  you secure your cloud infrastructure and deployment pipelines.
                </HeroWords>
              </p>

              <div
                className="flex flex-wrap gap-4 opacity-0"
                style={{
                  animation: "word-appear 0.5s ease-out forwards",
                  animationDelay: `${heroEnd(22)}ms`,
                }}
              >
                <Link
                  href="/contact"
                  className="group px-7 py-3.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  Get a Cloud Audit
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
                  className="px-7 py-3.5 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                >
                  How We Work
                </Link>
              </div>
            </div>

            <FadeUp delay={0.3}>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-foreground/[0.03] blur-[60px] rounded-full scale-150 pointer-events-none" />
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com"}/images/services/cloud-devsecops.png`}
                    alt="Cloud & DevSecOps Security illustration"
                    width={400}
                    height={400}
                    className="w-56 h-56 md:w-72 md:h-72 relative z-10 dark:invert dark:hue-rotate-180 drop-shadow-lg"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEvUExURba+4tjh9tjg9djf9dje9Nbd8tTa8dDV7snP68DG59rg9Nrg89rf89ne8djc8NXZ7tDU7MnN6L3D5K+3393g8d3g8dzf8Nvd79rb7dbX7NHS6cjK5ru/4quz3t/g79/f7t7e7d3c7Nva69fW6dDQ58bH5Li84aix3uHg7OHf6+Dd6t/b6dzY6NfU5s/N5cPE47W64aav3+Pf6ePe6OLc5+Da5tzW5dbR5MzK47/B47G44qOv4eXe5uTd5ePb5ODY5NvU49PP48jH47u+46225KGv5Obe4+Xc4uPa4uDX4tnS4tDM48PE5La85am05p+v5+fd4Obb4OPZ4N7V4dbQ4svJ477B5bC556Wz6J6v6ejc3eba3uLX39vT4NLN4sXG5Li+5qy36KKy6pyv6////xRKlZcAAABkdFJOUwADBQgJCQcFAgEGCxAUEw8KBQIBChMcIiEaEQkEAg8bKDAvJhkOBwMRIC84Ny0fEgkEER8tNzctIBQLBQ4ZJSwtJhwSCgUJEBkeHxsVDggEBQkNEBEQDQkGAwIEBgcICAYFAwLUWnaMAAAAAWJLR0Rkwtq4CQAAAHZJREFUCB1jYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PLATFORM SUPPORT ────────────────────────────────── */}
      <section className="border-y border-border/40 bg-muted/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-border/40">
            {platforms.map((platform, i) => (
              <FadeUpScroll key={i} delay={i * 0.1}>
                <div className="py-10 md:py-14 text-center px-4">
                  <div className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
                    {platform.name}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">
                    {platform.services}
                  </div>
                </div>
              </FadeUpScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE REVIEW (BENTO GRID) ─────────────────────── */}
      <ServiceBentoFeatures
        label="Scope"
        title="What We"
        titleAccent="Review"
        subtitle="From your cloud console to your deployment scripts, we secure the entire infrastructure stack."
        items={scope as any}
      />

      {/* ── WHAT YOU GET ─────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 bg-muted/5 border-y border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <FadeUpScroll>
                <div className="lg:sticky lg:top-32">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">
                    Deliverables
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    What You <span className="text-muted-foreground">Get</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Practical, prioritized guidance to harden your environment
                    without breaking your deployment velocity.
                  </p>
                  <div className="hidden lg:block w-12 h-0.5 bg-foreground/20" />
                </div>
              </FadeUpScroll>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {deliverables.map((item, i) => (
                  <FadeUpScroll key={i} delay={i * 0.08}>
                    <div className="group relative p-6 md:p-8 rounded-2xl border border-border/50 bg-background hover:border-foreground/20 transition-all duration-300 h-full">
                      <div className="absolute top-6 right-6 text-6xl font-bold text-foreground/[0.03] select-none">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-[15px]">
                        {item.desc}
                      </p>
                    </div>
                  </FadeUpScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────── */}
      <CaseStudies
        title="Cloud security in action"
        subtitle="Real-world results from securing cloud infrastructure and deployment pipelines."
        studies={cloudCaseStudies}
      />

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <ScaleInScroll>
            <div className="relative p-8 md:p-14 rounded-3xl border border-border/40 bg-card/20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Secure your cloud before it becomes a headline.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                  Get a cloud security audit from engineers who understand
                  infrastructure at scale.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
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
                    className="px-8 py-4 border border-border text-foreground font-medium rounded-full hover:bg-muted/50 transition-colors"
                  >
                    All Services
                  </Link>
                </div>
              </div>
            </div>
          </ScaleInScroll>
        </div>
      </section>

      <Footer />
    </main>
  );
}
