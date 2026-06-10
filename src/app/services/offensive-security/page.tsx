import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, ShieldCheck, Smartphone, Network, Link as LinkIcon } from "lucide-react";
import { OffensiveHero } from "./offensive-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Offensive Security & Penetration Testing | ZecurX",
  description:
    "Simulate real-world adversaries across your entire attack surface — before they find you. We think, move, and operate exactly like the threat actors targeting your business.",
  keywords: [
    "offensive security",
    "penetration testing",
    "red team operations",
    "web API pentesting",
    "supply chain audit",
    "OSCP",
    "MITRE ATT&CK",
  ],
  openGraph: {
    title: "Offensive Security & Penetration Testing | ZecurX",
    description:
      "Simulate real-world adversaries across your entire attack surface — before they find you.",
    type: "website",
    url: "https://zecurx.com/services/7-layers/offensive-security",
  },
  alternates: {
    canonical: "https://zecurx.com/services/7-layers/offensive-security",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "Web & API Penetration Testing",
    desc: "Deep logic flaw discovery that goes far beyond automated scanners — complex business logic abuse, authentication bypasses, and chained multi-step attack paths. Covers OWASP Top 10 (Web) and OWASP API Security Top 10 with CVSS 3.1 scoring and PoC evidence.",
    icon: "Globe",
  },
  {
    title: "Mobile App Security Testing",
    desc: "iOS and Android security testing — from binary reverse engineering and runtime manipulation (Frida) to API interception and local storage forensics. Full OWASP MASVS assessment for both platforms.",
    icon: "Smartphone",
  },
  {
    title: "Network & Infrastructure Pentesting",
    desc: "Internal, external, and network segmentation testing — full attack chain documentation from initial access to domain compromise. Active Directory attack chains, cloud misconfiguration exploitation, and MITRE ATT&CK mapping.",
    icon: "Network",
  },
  {
    title: "Source Code Security Review",
    desc: "Manual and SAST-assisted review of critical codebases — finding logic flaws, injection vulnerabilities, hardcoded secrets, and insecure patterns. Covers Java, Python, Go, Node.js/TypeScript, PHP, C/C++, Ruby, Swift, Kotlin, and Rust.",
    icon: "FileCode",
  },
  {
    title: "Red Team Operations",
    desc: "Full-chain adversary simulations combining physical intrusion, social engineering, and digital attack vectors — testing your people, processes, and technology simultaneously. Cobalt Strike / Sliver C2 with full OPSEC discipline and Purple Team debrief.",
    icon: "Target",
  },
  {
    title: "Supply Chain Security Audit",
    desc: "Third-party dependency analysis, vendor risk assessment, and open source component review. SBOM generation in CycloneDX and SPDX formats, CI/CD pipeline audit, and dependency confusion exposure assessment.",
    icon: "Link",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "Technical Report",
    desc: "Detailed finding write-ups with PoC evidence, CVSS 3.1 severity scores, step-by-step reproduction instructions, root cause analysis, prioritised remediation recommendations, and affected asset mapping.",
    icon: "FileText",
  },
  {
    title: "Executive Summary",
    desc: "Risk posture assessment in business language with overall security rating, benchmarking, top 3 critical risks, investment and effort estimates for remediation, and a board-presentation ready format.",
    icon: "BarChart",
  },
  {
    title: "Remediation Support",
    desc: "30-day post-report developer Q&A access, secure code fix guidance for each finding, re-test of all remediated vulnerabilities, remediation validation attestation letter, and finding closure tracking dashboard.",
    icon: "CheckCircle",
  },
  {
    title: "Compliance Artifacts",
    desc: "CERT-In / RBI submission-ready summary, formal testing attestations, and documentation satisfying CERT-In Directions 2022, RBI Cyber Security Framework, SEBI CSCRF, SOC 2, ISO 27001, and HIPAA requirements.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "207 Days",
    label: "Average attacker dwell time before detection",
    sub: "IBM 2023",
  },
  {
    value: "74%",
    label: "Breaches involve human element",
    sub: "Phishing & social engineering",
  },
  {
    value: "6 Services",
    label: "Specialised offensive security capabilities",
    sub: "One integrated practice",
  },
  {
    value: "CVE-Grade",
    label: "Findings reported with CVSS scoring",
    sub: "With PoC evidence",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "Multi-Tenant Isolation Failure Discovered in B2B SaaS",
    quote:
      "ZecurX discovered a chained vulnerability in our admin API — a low-severity info disclosure combined with a BOLA flaw allowed any authenticated user to access all other tenants' data. It hadn't been flagged by any automated tool or our previous vendor.",
    name: "Engineering Lead",
    role: "B2B SaaS Platform (400+ Enterprise Clients)",
    icon: ShieldCheck,
    lottie: getCdnUrl("lottie/idor_vuln.json"),
    metrics: [
      { value: "72h", label: "Remediation Time", sub: "After report delivery" },
      { value: "0", label: "Scanner Detection", sub: "Missed by all automated tools" },
    ],
  },
  {
    id: 2,
    heading: "Critical Fintech API Flaw Found Before Launch",
    quote:
      "ZecurX bypassed our certificate pinning with Frida and discovered an undocumented internal API endpoint that accepted transaction approvals without secondary authentication. CVSS 9.8 — patched before the release went live.",
    name: "CISO",
    role: "Fintech Mobile Banking App (2.3M Users)",
    icon: Smartphone,
    lottie: getCdnUrl("lottie/mobile_sec.json"),
    metrics: [
      { value: "CVSS 9.8", label: "Critical Severity", sub: "Transaction approval bypass" },
      { value: "Pre-launch", label: "Caught Before Release", sub: "Zero user impact" },
    ],
  },
  {
    id: 3,
    heading: "Domain Admin in 4 Hours 22 Minutes",
    quote:
      "Starting from a standard user workstation, ZecurX achieved Domain Administrator access in under 5 hours — through an unpatched print spooler and a Kerberoastable service account. We had passed our external audit with zero critical findings.",
    name: "Head of IT Security",
    role: "Regional Bank (47 Branches)",
    icon: Network,
    lottie: getCdnUrl("lottie/network_pentest.json"),
    metrics: [
      { value: "4h 22m", label: "Time to Domain Admin", sub: "From standard user workstation" },
      { value: "0", label: "SIEM Alerts Triggered", sub: "Full detection gap exposure" },
    ],
  },
  {
    id: 4,
    heading: "Credential Harvesting Payload Found in Production npm Package",
    quote:
      "A deprecated npm package in our auth module had been taken over. ZecurX found obfuscated credential harvesting code auto-updated into our production environment 6 weeks prior. The SBOM let us identify the package within 4 minutes.",
    name: "VP Engineering",
    role: "SaaS Company",
    icon: LinkIcon,
    lottie: getCdnUrl("lottie/supply_chain.json"),
    metrics: [
      { value: "4 min", label: "Package Identified", sub: "Using generated SBOM" },
      { value: "0", label: "Data Exfiltrated", sub: "Contained before breach" },
    ],
  },
];

// ── METHODOLOGY STEPS ─────────────────────────────────────────────────────────

const methodologySteps = [
  {
    title: "Scoping & RoE",
    desc: "Define objectives, scope boundaries, rules of engagement, and legal authorisation.",
  },
  {
    title: "Reconnaissance",
    desc: "OSINT, attack surface mapping, and technology fingerprinting.",
  },
  {
    title: "Exploitation",
    desc: "Active testing — manual and tool-assisted vulnerability exploitation.",
  },
  {
    title: "Post-Exploitation",
    desc: "Lateral movement, persistence, privilege escalation, and objective achievement.",
  },
  {
    title: "Reporting",
    desc: "CVSS-scored findings, PoC evidence, executive summary, and technical report.",
  },
  {
    title: "Remediation Check",
    desc: "Re-test of all findings post-remediation to confirm effective fix.",
  },
];

// ── FRAMEWORKS ────────────────────────────────────────────────────────────────

const indianFrameworks = [
  "CERT-In Cybersecurity Directions 2022 — mandatory penetration testing obligations",
  "RBI Cyber Security Framework — annual VAPT requirements for regulated banks",
  "SEBI CSCRF — penetration testing mandates for market infrastructure institutions",
  "DPDPA 2023 — pre-processing security assessment for personal data handlers",
  "IRDAI Information & Cyber Security Guidelines — IT system audit requirements",
  "MeitY Empanelment — CERT-In empanelled security auditing organisation",
];

const internationalFrameworks = [
  "OWASP Testing Guide v4.2 — web and API penetration testing methodology",
  "PTES (Penetration Testing Execution Standard) — full lifecycle framework",
  "OSSTMM (Open Source Security Testing Methodology Manual)",
  "MITRE ATT&CK Framework — TTP mapping for all offensive engagements",
  "NIST SP 800-115 — Technical Guide to Information Security Testing",
  "CVSS 3.1 — Common Vulnerability Scoring System for all findings",
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function OffensiveSecurityPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className=" pt-8 pb-4 flex-1">
        <OffensiveHero />

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
                  The Difference Between a{" "}
                  <span className="text-[#4c69e4]">Compliance Checkbox</span> and a Genuine
                  Adversary Simulation
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Operator-Grade Expertise",
                  desc: "Our offensive security team holds OSCP, OSCE3, CRTO, CRTE, eCPTX, and PNPT certifications. These are hands-on, examination-based credentials that cannot be earned through multiple-choice tests — they require real exploitation under pressure.",
                },
                {
                  title: "No Automation Theatre",
                  desc: "Automated vulnerability scanners find known CVEs. Our testers find the logic flaws, authentication bypasses, and chained attack paths that no scanner can detect — because they require human creativity and adversarial thinking.",
                },
                {
                  title: "Full Legal & Ethical Framework",
                  desc: "Every engagement is governed by a formal Rules of Engagement (RoE) document, written authorisation, defined scope boundaries, and a structured communication protocol. Your legal and compliance teams will have everything they need.",
                },
                {
                  title: "Board-Ready Reporting",
                  desc: "Our deliverables include two reports: a detailed technical report for your security and engineering teams with PoC evidence and remediation steps, and an executive summary for leadership and the board — in plain business language.",
                },
              ].map((item, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#4c69e4] text-xl">◉</span>
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
                  One integrated adversarial testing practice. We go beyond automated scanners.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── METHODOLOGY ──────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Our Engagement <span className="text-[#4c69e4]">Process</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  A structured, repeatable, and legally governed process — from kick-off to
                  remediation validation.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {methodologySteps.map((step, i) => (
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
                  Actionable intelligence at the conclusion of every ZecurX offensive security
                  engagement.
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
                  Proven adversarial <span className="text-[#4c69e4]">testing outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our offensive security engagements uncovered critical vulnerabilities before
                  attackers did.
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
                        {/* ── Content ── */}
                        <div className="p-8 md:p-10 flex flex-col gap-6">
                          {/* Icon + Heading */}
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#4c69e4]/10 border border-[#4c69e4]/20 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#4c69e4]" />
                            </div>
                            <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl leading-snug">
                              {study.heading}
                            </h3>
                          </div>

                          {/* Quote */}
                          <blockquote className="relative pl-5 border-l-2 border-[#4c69e4]/30">
                            <p className="text-slate-600 font-inter text-[15px] leading-relaxed italic">
                              "{study.quote}"
                            </p>
                            <footer className="mt-3 text-sm font-inter">
                              <span className="font-semibold text-[#0c1a2e]">{study.name}</span>
                              <span className="text-slate-400 ml-2">— {study.role}</span>
                            </footer>
                          </blockquote>

                          {/* Metrics */}
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

                        {/* ── Visual panel ── */}
                        <div className="hidden md:flex items-center justify-center w-[280px] bg-slate-50 border-l border-slate-100 p-8">
                          {/* Lottie renders here via your existing Lottie component; 
                              swap the div below for <Lottie src={study.lottie} /> if available */}
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

        {/* ── FRAMEWORKS & COMPLIANCE ──────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Standards & Compliance
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Framework <span className="text-[#4c69e4]">Alignment</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Every engagement is anchored to recognised industry frameworks and regulatory
                  requirements.
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
                      International Methodologies & Standards
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
                  <span className="text-[#4c69e4]">Risk Appetite</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Designed to match your compliance timeline, risk appetite, and internal
                  capability.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "📋",
                  title: "Point-in-Time Assessment",
                  desc: "Fixed-scope engagement for a specific application, network segment, or source codebase. Ideal for compliance-driven testing cycles, pre-release security validation, and regulatory audit preparation. Deliverables within 5 business days of engagement close.",
                },
                {
                  icon: "🔄",
                  title: "Continuous Penetration Testing",
                  desc: "Monthly or quarterly retainer-based testing aligned to your release cycle. New features and infrastructure changes are tested as they ship — not 12 months later. Includes a dedicated tester familiar with your environment and codebase.",
                },
                {
                  icon: "🎯",
                  title: "Red Team Retainer",
                  desc: "Annual adversary simulation with quarterly assumed-breach exercises and purple team sessions. Continuously validates your detection and response capability as your environment and the threat landscape evolve. Includes tabletop exercise facilitation.",
                },
                {
                  icon: "🏗️",
                  title: "DevSecOps Integration",
                  desc: "Embedding ZecurX security engineers into your development sprints — security review at the design stage, code review in pull request workflows, and automated SAST/SCA tooling configuration. Security built in, not bolted on.",
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
                <div className="relative z-7">
                  <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-4">
                    Find your vulnerabilities{" "}
                    <span className="text-[#4c69e4]">before your adversaries do.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-4 max-w-xl mx-auto text-lg leading-relaxed">
                    Request a complimentary Attack Surface Assessment — a 30-minute consultation
                    with a ZecurX senior penetration tester, at no cost or obligation.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-500 font-inter mb-10">
                    {/* <span>📧 redteam@zecurx.com</span>
                    <span>📞 +91 80 XXXX XXXX</span>
                    <span>🌐 www.zecurx.com/pentest</span> */}
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Request Assessment
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