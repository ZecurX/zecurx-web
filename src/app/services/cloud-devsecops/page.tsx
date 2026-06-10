import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Cloud, GitBranch, Shield, Lock, FileCode, Layers } from "lucide-react";
import { CloudDevSecOpsHero } from "./cloud-devsecops-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Cloud Security & DevSecOps | ZecurX",
  description:
    "Security embedded directly into cloud environments and CI/CD pipelines — shift-left at scale. We harden your cloud posture, secure your delivery pipeline, and ensure every line of infrastructure-as-code is safe before it reaches production.",
  keywords: [
    "cloud security",
    "DevSecOps",
    "CSPM",
    "Kubernetes security",
    "CI/CD pipeline security",
    "HashiCorp Vault",
    "infrastructure as code security",
    "AWS GCP Azure",
  ],
  openGraph: {
    title: "Cloud Security & DevSecOps | ZecurX",
    description:
      "Security embedded directly into cloud environments and CI/CD pipelines — shift-left at scale.",
    type: "website",
    url: "https://zecurx.com/services/cloud-devsecops",
  },
  alternates: {
    canonical: "https://zecurx.com/services/cloud-devsecops",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "Cloud Posture Management",
    desc: "Continuous misconfiguration detection and automated remediation across AWS, GCP, and Azure. Real-time alerting with severity scoring, IAM posture review, drift detection, and multi-account risk visibility — your cloud security control plane operating 24/7.",
    icon: "Cloud",
  },
  {
    title: "CI/CD Pipeline Security",
    desc: "Automated security gates, secrets scanning, and policy enforcement at every stage of your software delivery pipeline. SAST, SCA, SBOM generation, SLSA framework implementation, OPA/Conftest policy-as-code, and artifact signing — security that ships with your code.",
    icon: "GitBranch",
  },
  {
    title: "Container & Kubernetes Security",
    desc: "Image vulnerability scanning, runtime threat detection with Falco, RBAC deep audit, network policy hardening, and admission controller enforcement. CIS Kubernetes Benchmark assessment for EKS, GKE, AKS, and self-managed clusters.",
    icon: "Layers",
  },
  {
    title: "Infrastructure as Code Security Review",
    desc: "Static analysis of Terraform, Pulumi, CloudFormation, and Bicep templates before provisioning — catching misconfigurations at the source. Checkov, tfsec, and KICS scanning augmented with expert module review and CI/CD gate integration.",
    icon: "FileCode",
  },
  {
    title: "Secrets & Credential Management",
    desc: "HashiCorp Vault architecture, deployment, and dynamic credential configuration. Automated rotation policies, Vault Agent sidecar injection, and continuous secret leak detection across repositories, CI/CD systems, wikis, and chat platforms.",
    icon: "Lock",
  },
  {
    title: "Cloud Architecture Review",
    desc: "AWS Well-Architected Framework security pillar review, zero-trust architecture assessment, blast radius mapping, and hybrid connectivity security. Independent expert review of architectural decisions before they become permanent constraints.",
    icon: "Shield",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "Technical Findings Report",
    desc: "CVSS-scored misconfiguration and vulnerability findings with proof-of-concept evidence, affected resource mapping, and step-by-step remediation instructions tailored to your cloud provider and IaC toolchain.",
    icon: "FileText",
  },
  {
    title: "Executive Risk Dashboard",
    desc: "Board-ready risk score with trend tracking, benchmark comparisons, SLA-linked remediation timelines, and overall posture rating in plain business language — for CISO reporting and due diligence.",
    icon: "BarChart",
  },
  {
    title: "Remediation as Code",
    desc: "Findings delivered as pull requests, policy rules, Terraform patches, and runbooks — not just recommendations. Remediations are version-controlled, reviewable, and deployable through your existing workflows.",
    icon: "GitBranch",
  },
  {
    title: "Compliance Mapping Report",
    desc: "Findings mapped to CIS Benchmarks, SOC 2, ISO 27001, PCI-DSS v4.0, NIST CSF, RBI Cloud Framework, SEBI CSCRF, CERT-In Directions 2022, and DPDPA 2023 — ready for auditors and regulators.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "82%",
    label: "Cloud breaches involve misconfiguration or human error",
    sub: "Gartner",
  },
  {
    value: "< 2 Min",
    label: "Average time for exposed credentials to be abused",
    sub: "After exposure",
  },
  {
    value: "6 Services",
    label: "Specialised cloud and DevSecOps capabilities",
    sub: "One integrated practice",
  },
  {
    value: "Shift-Left",
    label: "Security at design, code, build, and deploy",
    sub: "Not just runtime",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "247 Cloud Misconfigurations Fixed — SOC 2 Achieved 3 Months Early",
    quote:
      "Initial assessment found 4 publicly accessible RDS snapshots with production customer data, 3 S3 buckets with static website hosting inadvertently enabled on internal stores, and 4 IAM roles with AdministratorAccess on non-privileged EC2 workloads. All critical findings were auto-remediated within 6 hours.",
    name: "Engineering Lead",
    role: "Series C Fintech (3 AWS Accounts + GCP)",
    icon: Cloud,
    lottie: getCdnUrl("lottie/cloud_posture.json"),
    metrics: [
      { value: "247", label: "Misconfigs Found", sub: "11 critical on day one" },
      { value: "6h", label: "Auto-Remediation", sub: "All critical findings fixed" },
    ],
  },
  {
    id: 2,
    heading: "Live Stripe Key Caught Before Reaching Public Repo",
    quote:
      "340 pipeline definitions across GitHub Actions and GitLab CI — no consistent security gate policy, secrets visible in pipeline logs, container images from unauthenticated Docker Hub. Six weeks after ZecurX implemented OPA/Conftest and Trufflehog, we caught our first real secret: a developer's live Stripe API key in a feature branch.",
    name: "Platform Engineering Lead",
    role: "SaaS Company (600 Developers)",
    icon: GitBranch,
    lottie: getCdnUrl("lottie/cicd_security.json"),
    metrics: [
      { value: "340", label: "Pipelines Secured", sub: "GitHub Actions + GitLab CI" },
      { value: "1st", label: "Real Secret Caught", sub: "Stripe key, feature branch" },
    ],
  },
  {
    id: 3,
    heading: "34 Cluster-Admin Service Accounts Reduced to 3",
    quote:
      "34 service accounts had cluster-admin or equivalent privileges — compared to 2 that actually required them. No NetworkPolicies meant a compromised pod in the payments namespace had unrestricted access to every other pod including the PHI data store. First week of Falco surfaced 4 anomalous events including unexpected connections to a crypto-mining pool.",
    name: "Head of Infrastructure",
    role: "Healthcare Cloud Platform (180+ Microservices on EKS)",
    icon: Layers,
    lottie: getCdnUrl("lottie/kubernetes_sec.json"),
    metrics: [
      { value: "34 → 3", label: "Privileged Service Accounts", sub: "RBAC remediation" },
      { value: "4", label: "Anomalous Events", sub: "Caught in week one by Falco" },
    ],
  },
  {
    id: 4,
    heading: "Single IaC Fix Remediated 23 Production Environments Simultaneously",
    quote:
      "A foundational RDS module used by 23 teams had encryption-at-rest disabled, deletion protection off, and publicly accessible set to true for development convenience — and all 23 teams had inherited these defaults into production. ZecurX delivered the fix as a pull request to the module repo — one merge fixed everything.",
    name: "VP Platform Engineering",
    role: "Global Logistics Company (120 Terraform Modules, 15 Teams)",
    icon: FileCode,
    lottie: getCdnUrl("lottie/iac_security.json"),
    metrics: [
      { value: "23", label: "Environments Fixed", sub: "With a single PR merge" },
      { value: "1", label: "Module PR", sub: "All teams remediated at once" },
    ],
  },
];

// ── SHIFT-LEFT FRAMEWORK ──────────────────────────────────────────────────────

const shiftLeftSteps = [
  {
    title: "Design",
    desc: "Architecture review, threat modelling, and security requirements definition.",
  },
  {
    title: "Code",
    desc: "IaC review, SAST, secrets scanning, and dependency analysis in IDE and PR.",
  },
  {
    title: "Build",
    desc: "Container scanning, SBOM generation, artifact signing, and pipeline gates.",
  },
  {
    title: "Deploy",
    desc: "Policy gate enforcement, admission controllers, and runtime configuration validation.",
  },
  {
    title: "Operate",
    desc: "CSPM, runtime detection, posture drift alerting, and continuous compliance.",
  },
  {
    title: "Respond",
    desc: "Automated remediation, incident playbooks, and forensic log access.",
  },
];

// ── TOOLING COVERAGE ──────────────────────────────────────────────────────────

const toolingGroups = [
  {
    icon: "☁",
    title: "Cloud Platforms",
    items: [
      "Amazon Web Services (AWS)",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure",
      "Oracle Cloud Infrastructure (OCI)",
      "Multi-cloud and hybrid environments",
      "AWS GovCloud / Azure Government",
    ],
  },
  {
    icon: "⬡",
    title: "Container & Orchestration",
    items: [
      "Kubernetes (EKS, GKE, AKS, self-managed)",
      "Docker and containerd runtimes",
      "Helm chart security review",
      "Service mesh (Istio, Linkerd)",
      "Serverless (Lambda, Cloud Run, Functions)",
      "OpenShift enterprise Kubernetes",
    ],
  },
  {
    icon: "⚙",
    title: "DevSecOps Toolchain",
    items: [
      "GitHub Actions, GitLab CI, Jenkins, CircleCI",
      "HashiCorp Vault, Terraform, Packer",
      "Checkov, tfsec, Trivy, Falco, OPA",
      "Semgrep, Snyk, SonarQube, Grype",
      "GitGuardian, Trufflehog, Gitleaks",
      "Cosign, Sigstore, SLSA, Syft",
    ],
  },
];

// ── FRAMEWORKS ────────────────────────────────────────────────────────────────

const indianFrameworks = [
  "CERT-In Cybersecurity Directions 2022 — cloud infrastructure audit requirements and incident reporting",
  "RBI Cloud Adoption Framework — shared responsibility, data residency, and audit access for banks and NBFCs",
  "SEBI CSCRF — cloud risk management and third-party service provider obligations",
  "DPDPA 2023 — data localisation, cross-border transfer controls, and cloud processor obligations",
  "MeitY Cloud Services Empanelment — GovCloud procurement security requirements",
  "IRDAI Cloud Computing Guidelines — insurance sector data and infrastructure security",
];

const internationalFrameworks = [
  "CIS Benchmarks — AWS, GCP, Azure, Kubernetes, Docker (Level 1 & 2)",
  "NIST SP 800-190 — Application Container Security Guide",
  "ISO/IEC 27017 — Cloud Security Controls and ISO 27018 — Cloud Privacy",
  "SOC 2 Type II — Security, Availability, and Confidentiality Trust Service Criteria",
  "PCI-DSS v4.0 — Cloud environment scoping and shared responsibility controls",
  "CSA Cloud Controls Matrix (CCM) v4 — cloud-specific security control framework",
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function CloudDevSecOpsPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <CloudDevSecOpsHero />

        {/* ── STATS BAR ─────────────────────────────────────────── */}
        <section className="py-12 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold font-manrope text-[#4c69e4] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white font-inter text-sm font-medium mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-slate-400 font-inter text-xs">{stat.sub}</div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY ZECURX ──────────────────────────────────────────── */}
        <section className="pt-20 pb-10 md:pt-32 md:pb-16 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Why ZecurX
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Engineering-Native Cloud Security at the{" "}
                  <span className="text-[#4c69e4]">Speed of Delivery</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "☁",
                  title: "Multi-Cloud Native Expertise",
                  desc: "Certified engineers across AWS (CSAA, CSSP), GCP (PCSE), and Azure (AZ-500, SC-100) — not generalists reading cloud documentation, but specialists who have architected, broken, and secured production cloud environments at enterprise scale working efficiently.",
                },
                {
                  icon: "⚙",
                  title: "Pipeline-Integrated Security",
                  desc: "We do not deliver security as a separate audit gate that slows delivery. We integrate security tooling, policy checks, and alerting directly into your existing GitHub Actions, GitLab CI, Jenkins, or Azure DevOps pipelines — invisible friction that stops real risks silently.",
                },
                {
                  icon: "⬡",
                  title: "Kubernetes-First Practice",
                  desc: "Our container security practice is built around production Kubernetes environments — not theoretical CIS benchmarks. We have hardened clusters running millions of daily requests across EKS, GKE, AKS, and self-managed deployments.",
                },
                {
                  icon: "📋",
                  title: "Compliance-as-Code Delivery",
                  desc: "Every ZecurX cloud engagement maps findings to the frameworks your auditors and regulators require — CIS Benchmarks, NIST CSF, SOC 2, ISO 27001, PCI-DSS, RBI, and SEBI — and delivers remediation in code, not just recommendations.",
                },
              ].map((item, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-manrope font-bold text-[#0c1a2e] text-lg">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 font-inter text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICE PORTFOLIO ──────────────────────────────────── */}
        <section className="pt-8 pb-20 md:pt-12 md:pb-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Service Portfolio
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Six Specialised <span className="text-[#4c69e4]">Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From posture management to pipeline hardening — one integrated cloud security practice.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── SHIFT-LEFT FRAMEWORK ─────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">Shift-Left Framework</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Security embedded at every stage of the infrastructure and application lifecycle.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {shiftLeftSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#4c69e4]/10 border border-[#4c69e4]/20 flex items-center justify-center">
                      <span className="text-[#4c69e4] font-bold font-manrope text-lg">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-sm">{step.title}</h3>
                    <p className="text-slate-500 font-inter text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── DELIVERABLES ─────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Deliverables
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  What You <span className="text-[#4c69e4]">Receive</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Actionable, code-level outputs — not just PDF reports.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceTimeline items={deliverables} />
            </BlurFade>
          </div>
        </section>

        {/* ── CASE STUDIES ─────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 bg-slate-50/60 border-y border-slate-100 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Success Stories
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Proven cloud security <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our cloud and DevSecOps engagements have caught critical misconfigurations
                  and secured delivery pipelines before incidents occurred.
                </p>
              </div>
            </BlurFade>

            <div className="flex flex-col gap-6">
              {caseStudies.map((study, i) => {
                const Icon = study.icon;
                return (
                  <BlurFade key={study.id} delay={0.1 + i * 0.05}>
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-0">
                        {/* Content */}
                        <div className="p-8 md:p-10 flex flex-col gap-6">
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#4c69e4]/10 border border-[#4c69e4]/20 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#4c69e4]" />
                            </div>
                            <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl leading-snug">
                              {study.heading}
                            </h3>
                          </div>

                          <blockquote className="relative pl-5 border-l-2 border-[#4c69e4]/30">
                            <p className="text-slate-600 font-inter text-[15px] leading-relaxed italic">
                              "{study.quote}"
                            </p>
                            <footer className="mt-3 text-sm font-inter">
                              <span className="font-semibold text-[#0c1a2e]">{study.name}</span>
                              <span className="text-slate-400 ml-2">— {study.role}</span>
                            </footer>
                          </blockquote>

                          <div className="flex flex-wrap gap-4 pt-2">
                            {study.metrics.map((m, mi) => (
                              <div
                                key={mi}
                                className="flex flex-col gap-0.5 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200"
                              >
                                <span className="font-manrope font-bold text-[#0c1a2e] text-xl">
                                  {m.value}
                                </span>
                                <span className="text-slate-700 font-inter text-xs font-medium">
                                  {m.label}
                                </span>
                                <span className="text-slate-400 font-inter text-xs">{m.sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Visual panel */}
                        <div className="hidden md:flex items-center justify-center w-[280px] bg-slate-50 border-l border-slate-100 p-8">
                          <div className="w-full aspect-square rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                            <Icon className="w-16 h-16 text-[#4c69e4]/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TOOLING COVERAGE ─────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Platform Coverage
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Native Expertise Across the{" "}
                  <span className="text-[#4c69e4]">Cloud Ecosystem</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Deep tooling coverage across cloud platforms, container orchestration, and the DevSecOps toolchain.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {toolingGroups.map((group, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-2xl">{group.icon}</span>
                      <h3 className="font-manrope font-bold text-[#0c1a2e] text-lg">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-[#4c69e4] mt-0.5 shrink-0 text-xs">◉</span>
                          <span className="text-slate-600 font-inter text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ── FRAMEWORKS & COMPLIANCE ──────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Standards & Compliance
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Regulatory <span className="text-[#4c69e4]">Alignment</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Every cloud engagement maps to the frameworks your regulators and auditors require.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlurFade delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">🇮🇳</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      Indian Regulatory Frameworks
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {indianFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#4c69e4] mt-1 shrink-0">◉</span>
                        <span className="text-slate-600 font-inter text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>

              <BlurFade delay={0.2}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">🌐</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      International Standards & Frameworks
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {internationalFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#4c69e4] mt-1 shrink-0">◉</span>
                        <span className="text-slate-600 font-inter text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* ── ENGAGEMENT MODELS ────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Engagement Models
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Cloud Maturity</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Designed around your team structure, compliance timeline, and delivery velocity.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "📋",
                  title: "Point-in-Time Assessment",
                  desc: "Scoped cloud security assessment — architecture review, CSPM scan, IaC review, or specific service audit. Fixed deliverable with CVSS-scored findings, executive summary, and remediation guidance. Typical duration 2–4 weeks. Ideal for compliance audit preparation and new environment reviews.",
                },
                {
                  icon: "🔄",
                  title: "Continuous Posture Management",
                  desc: "Ongoing cloud security monitoring with ZecurX as your managed CSPM operator — continuous misconfiguration detection, drift alerting, auto-remediation, and monthly posture reporting. Priced per cloud account. Ideal for regulated industries with continuous compliance obligations.",
                },
                {
                  icon: "🏗",
                  title: "Platform Engineering Embed",
                  desc: "ZecurX cloud security engineers embedded in your platform team — contributing to IaC module library development, pipeline security architecture, Vault deployment, and Kubernetes hardening as named team members. Engagement by sprint or quarterly retainer.",
                },
                {
                  icon: "🚀",
                  title: "Cloud Migration Security",
                  desc: "Security architecture and review for cloud migration programmes — landing zone design, workload security classification, migration wave security gates, and post-migration posture validation. Integrates with AWS MAP, GCP Migrate, and Azure Migrate workstreams.",
                },
              ].map((model, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{model.icon}</span>
                      <h3 className="font-manrope font-bold text-[#0c1a2e] text-lg">
                        {model.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 font-inter text-sm leading-relaxed">{model.desc}</p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1000px] mx-auto">
            <BlurFade delay={0.2}>
              <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4c69e4]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4c69e410_1px,transparent_1px),linear-gradient(to_bottom,#4c69e410_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-4">
                    Secure your cloud infrastructure{" "}
                    <span className="text-[#4c69e4]">at the speed of delivery.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-4 max-w-xl mx-auto text-lg leading-relaxed">
                    Request a complimentary Cloud Security Posture Snapshot — a 48-hour read-only
                    assessment of your cloud environment with a prioritised findings summary,
                    delivered at no cost.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-500 font-inter mb-10">
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Get Posture Snapshot
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                    >
                      All Services
                    </Link>
                  </div>
                  <p className="mt-8 text-xs text-slate-400 font-inter">
                  </p>
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