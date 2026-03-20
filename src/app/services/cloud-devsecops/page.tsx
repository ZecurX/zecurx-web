import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { CloudHero } from "./cloud-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";

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

const capabilities = [
  {
    title: "Cloud Security Posture Review",
    desc: "We conduct a comprehensive audit of your AWS, GCP, or Azure environment against CIS Benchmarks and best practices. We identify open S3 buckets, unencrypted databases, and insecure security group rules that leave you exposed to the public internet.",
    icon: "Search",
  },
  {
    title: "IAM & Least Privilege Analysis",
    desc: "Identity is the new perimeter. We map out your IAM roles, policies, and permission chains to identify over-privileged users and services. We help you implement a true least-privilege model to limit blast radius in case of a breach.",
    icon: "Key",
  },
  {
    title: "Kubernetes & Container Security",
    desc: "We review your Kubernetes clusters (EKS, GKE, AKS) for misconfigurations. We check for insecure pod security policies, privileged containers, and exposed API servers, ensuring your orchestration layer is as secure as your applications.",
    icon: "Container",
  },
  {
    title: "CI/CD Pipeline Security",
    desc: "We secure your software supply chain. We audit your GitHub Actions, GitLab CI, or Jenkins pipelines to prevent secret leakage, code tampering, and unauthorized deployments. We help you embed security scans (SAST/DAST) directly into your pull requests.",
    icon: "GitBranch",
  },
  {
    title: "Infrastructure as Code (IaC) Scanning",
    desc: "We scan your Terraform, CloudFormation, and Helm charts to catch security issues before they are deployed. By shifting security left, we help you prevent misconfigurations from ever reaching your production environment.",
    icon: "FileCode",
  },
  {
    title: "Secret Management Review",
    desc: "We identify hardcoded secrets in your codebase and configuration files. We help you migrate to secure secret management solutions like AWS Secrets Manager or HashiCorp Vault, ensuring sensitive keys are rotated and managed securely.",
    icon: "KeyRound",
  },
];

const deliverables = [
  {
    title: "Cloud Risk Assessment Report",
    desc: "A detailed report categorizing vulnerabilities by severity (Critical, High, Medium, Low) with clear business impact statements.",
    icon: "ShieldCheck",
  },
  {
    title: "Remediation Playbooks",
    desc: "Step-by-step guides and copy-paste CLI commands or Terraform code snippets to fix identified misconfigurations immediately.",
    icon: "Bug",
  },
  {
    title: "Compliance Mapping",
    desc: "Mapping of findings to relevant compliance frameworks like SOC 2, ISO 27001, HIPAA, or PCI-DSS to support your audit readiness.",
    icon: "Award",
  },
  {
    title: "Architecture Review Session",
    desc: "A deep-dive workshop with your engineering team to discuss long-term architectural improvements and security patterns.",
    icon: "GitBranch",
  },
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
];

const stats = [
  {
    value: "200+",
    label: "Cloud Audits",
  },
  {
    value: "99%",
    label: "Misconfigs Fixed",
  },
  {
    value: "24/7",
    label: "Continuous Mon",
  },
];

export default function CloudDevSecOpsPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <CloudHero />

        {/* ── STATS SECTION ───────────────────────── */}
        <section className="py-12 border-y border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-4 md:py-8 group">
                  <span className="text-4xl md:text-5xl font-bold text-[#0c1a2e] mb-2 font-manrope transition-colors duration-300 group-hover:text-[#496ae8]">
                    {stat.value}
                  </span>
                  <span className="text-slate-500 font-medium text-sm tracking-wide font-inter">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* ── WHAT WE TEST ───────────────────────── */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <div className="max-w-[1320px] mx-auto">
          <BlurFade delay={0.1}>
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                Capabilities
              </span>
              <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                What We <span className="text-[#4a6ffa]">Secure</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Comprehensive coverage across your cloud and infrastructure attack surface.
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.2}>
            <ServiceFeatureGrid items={capabilities} />
          </BlurFade>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
        <div className="max-w-[1320px] mx-auto">
          <BlurFade delay={0.1}>
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                Deliverables
              </span>
              <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                What You <span className="text-[#4a6ffa]">Get</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Actionable intelligence, not just a list of bugs. We provide the context you need to fix issues fast.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <ServiceTimeline items={deliverables} />
          </BlurFade>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────── */}
      <div className="bg-white border-y border-slate-100 relative z-10">
          <CaseStudies
            title="Proven security outcomes"
            subtitle="See how our cloud security assessments have helped teams ship secure code faster."
            studies={cloudCaseStudies}
          />
      </div>

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
                  Get a security assessment tailored to your infrastructure. Fast
                  turnaround, developer-friendly reports.
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
      </main>

      <Footer />
    </div>
  );
}