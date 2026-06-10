import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Building2, Shield, Globe, CreditCard, FileText, LayoutGrid } from "lucide-react";
import { ComplianceGovernanceHero } from "./compliance-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Compliance & Governance | ZecurX",
  description:
    "Streamlined pathways to certification and regulatory readiness — SOC 2, ISO 27001, DPDPA, GDPR, PCI-DSS, and GRC programme design. Continuous compliance programmes that turn certification into a commercial advantage, not a periodic scramble.",
  keywords: [
    "SOC 2 certification",
    "ISO 27001 certification",
    "DPDPA compliance",
    "GDPR compliance",
    "PCI-DSS assessment",
    "GRC programme design",
    "compliance governance",
    "ISMS design",
    "vCISO",
    "continuous compliance",
  ],
  openGraph: {
    title: "Compliance & Governance | ZecurX",
    description:
      "Streamlined pathways to certification and regulatory readiness — SOC 2, ISO 27001, DPDPA, GDPR, PCI-DSS, and GRC programme design.",
    type: "website",
    url: "https://zecurx.com/services/compliance-governance",
  },
  alternates: {
    canonical: "https://zecurx.com/services/compliance-governance",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "SOC 2 Type I & II Readiness",
    desc: "Gap analysis, control implementation, evidence collection automation, and auditor liaison — from first assessment to Type II report in hand, without derailing your engineering team. Vanta, Drata, or Secureframe integration for automated evidence collection from 100+ system integrations including AWS, GCP, Azure, GitHub, and Okta.",
    icon: "Building2",
  },
  {
    title: "ISO 27001 Certification",
    desc: "ISMS design, risk treatment plan, internal audit preparation, and certification body liaison — the internationally recognised gold standard for information security management. Full ISO 27001:2022 alignment with all 93 Annex A controls including 11 new additions covering cloud security, threat intelligence, and ICT continuity.",
    icon: "Shield",
  },
  {
    title: "DPDP Act Compliance (India)",
    desc: "India's Digital Personal Data Protection Act 2023 readiness — data mapping, consent architecture, grievance mechanisms, and cross-border transfer controls built for Indian enterprises. Covers Significant Data Fiduciary obligations, Data Principal rights implementation, and breach notification procedures.",
    icon: "FileText",
  },
  {
    title: "GDPR & Privacy Programs",
    desc: "Data mapping, DPIAs, consent management architecture, data processor agreements, and supervisory authority liaison — for Indian enterprises processing European personal data. Includes RoPA, legal basis assessment, Transfer Impact Assessments, and Virtual DPO service under Articles 37–39.",
    icon: "Globe",
  },
  {
    title: "PCI-DSS Assessment",
    desc: "Cardholder data environment scoping, gap analysis, compensating control design, technical remediation, and QSA preparation — for organisations that handle payment card data. PCI-DSS v4.0 aligned with support for all SAQ variants, customised approach, and Requirement 11.4 penetration testing.",
    icon: "CreditCard",
  },
  {
    title: "GRC Program Design",
    desc: "Policy framework creation, risk registers, third-party risk management, and board-level security reporting — building the governance infrastructure that ties every compliance obligation together. Unified control framework mapping overlapping SOC 2, ISO 27001, PCI-DSS, and DPDPA requirements to a single control set.",
    icon: "LayoutGrid",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "Gap Analysis & Remediation Roadmap",
    desc: "Prioritised remediation plan against your target framework — with effort estimates, timeline projections, and ownership mapping. Covers all applicable control domains with clear engineering-task formatting so your team knows exactly what to build, not just what is missing.",
    icon: "FileText",
  },
  {
    title: "Policy & Procedure Library",
    desc: "Complete suite of framework-required information security policies, standards, guidelines, and procedures — drafted, reviewed, and formatted for immediate adoption. Practical for employees, defensible for auditors, and appropriate for board review without additional legal redrafting.",
    icon: "BarChart",
  },
  {
    title: "Automated Evidence Collection Programme",
    desc: "GRC tooling deployment (Vanta, Drata, Secureframe, or custom pipelines) that automatically collects and organises evidence from your tech stack — eliminating the manual evidence scramble at audit time. Security questionnaire answer library built from certification programme for sales acceleration.",
    icon: "GitBranch",
  },
  {
    title: "Certification & Regulatory Compliance Report",
    desc: "Audit-ready compliance documentation — SOC 2 report, ISO 27001 certificate, DPDPA attestation, PCI-DSS RoC, or GDPR programme evidence package — delivered with management responses and auditor liaison complete. Ready for enterprise customer security questionnaires and investor due diligence.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "₹250 Cr",
    label: "Maximum DPDPA penalty per violation — India's new data protection law",
    sub: "Per contravention",
  },
  {
    value: "6 Frameworks",
    label: "SOC 2, ISO 27001, DPDPA, GDPR, PCI-DSS, and GRC program design",
    sub: "One integrated practice",
  },
  {
    value: "40%",
    label: "Average reduction in audit preparation time with ZecurX continuous compliance",
    sub: "vs. periodic approach",
  },
  {
    value: "Day 1",
    label: "Evidence collection begins immediately — no audit scramble, no last-minute remediation",
    sub: "Continuous by design",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "34 Control Gaps Closed — SOC 2 Type II Received, ₹4.2 Cr Enterprise Deal Unblocked",
    quote:
      "ZecurX conducted a gap analysis revealing 34 control gaps, implemented remediation across 16 weeks, deployed Vanta for automated evidence collection, and coordinated the Type I audit followed by a 6-month observation period and Type II examination. The company received their Type II report, provided it to the blocked prospect, and closed a ₹4.2 Cr annual contract within 3 weeks of report delivery. The SOC 2 programme paid for itself 8 times over on the first closed deal.",
    name: "CTO",
    role: "Series B SaaS Company (workforce management software, enterprise HR market)",
    icon: Building2,
    lottie: getCdnUrl("lottie/soc2.json"),
    metrics: [
      { value: "34 → 0", label: "Control Gaps Closed", sub: "Over 16-week remediation" },
      { value: "₹4.2 Cr", label: "Enterprise Deal Unblocked", sub: "Within 3 weeks of Type II report" },
    ],
  },
  {
    id: 2,
    heading: "ISO 27001 Certified in 22 Weeks — ₹6 Crore in New Contracts at 3 Banks",
    quote:
      "ZecurX designed their ISMS from scratch, conducted the risk assessment and gap analysis, developed all 27 required policies, prepared and conducted the internal audit, and coordinated the certification body examination with BSI. The company achieved certification in 22 weeks from engagement start. Within 6 months of certification, they had qualified as an approved vendor at all three banks and progressed two of the blocked deals to signed contracts. The combined annual contract value of those two deals exceeded ₹6 Crore.",
    name: "Head of Compliance",
    role: "220-Person IT Services Company (cloud managed services, banking and insurance clients)",
    icon: Shield,
    lottie: getCdnUrl("lottie/iso27001.json"),
    metrics: [
      { value: "22 weeks", label: "To ISO 27001 Certification", sub: "From engagement start" },
      { value: "₹6 Cr+", label: "New Contract Value", sub: "At 3 banks within 6 months" },
    ],
  },
  {
    id: 3,
    heading: "DPDPA Compliance Achieved — 2.8M Borrower Platform Ready Before Enforcement",
    quote:
      "ZecurX conducted a full DPDPA readiness assessment, mapped all personal data flows, drafted DPDPA-compliant processor agreements for all 14 vendors, designed the consent management architecture for the mobile application (implemented in 6 weeks), and established the Grievance Officer function with documented intake and resolution workflows. The platform achieved demonstrable DPDPA compliance ahead of the enforcement notification — positioning itself competitively against fintech peers that had not yet begun their compliance programmes.",
    name: "Chief Compliance Officer",
    role: "Consumer Lending Platform (2.8 million registered borrowers, 14 data processors)",
    icon: FileText,
    lottie: getCdnUrl("lottie/dpdpa.json"),
    metrics: [
      { value: "14", label: "Processor Agreements Remediated", sub: "DPDPA-compliant in 6 weeks" },
      { value: "Pre-enforcement", label: "Compliance Achieved", sub: "Before regulatory deadline" },
    ],
  },
  {
    id: 4,
    heading: "German DPA Inquiry Resolved — GDPR Programme Implemented, Now a Sales Differentiator",
    quote:
      "ZecurX was engaged to conduct a rapid GDPR gap assessment, draft Transfer Impact Assessments for the India-based processing, update all client data processing agreements to include Article 28 mandatory provisions, and draft the response to the supervisory authority inquiry. The authority accepted the response without further action. The firm subsequently implemented ZecurX's GDPR programme framework — RoPA, legal basis register, and DSR workflow — and now cites GDPR compliance documentation as a differentiator in European client proposals.",
    name: "Legal & Compliance Director",
    role: "340-Person Indian IT Services Firm (data analytics, UK and German retail clients)",
    icon: Globe,
    lottie: getCdnUrl("lottie/gdpr.json"),
    metrics: [
      { value: "Resolved", label: "German DPA Inquiry", sub: "No further action taken" },
      { value: "Sales Tool", label: "GDPR Programme", sub: "Cited in European proposals" },
    ],
  },
  {
    id: 5,
    heading: "23 PCI-DSS Gaps Remediated — Clean RoC Issued, Acquiring Bank Relationship Preserved",
    quote:
      "ZecurX conducted a PCI-DSS v4.0 gap assessment, identified 23 remediation items including critical gaps in log management, multi-factor authentication for all non-console CDE access, and an inadequately segmented network that placed 40+ out-of-scope servers effectively inside the CDE. ZecurX implemented all remediations in 14 weeks, redesigned the network segmentation architecture, and prepared the client for a formal QSA assessment. The QSA issued the Report on Compliance (RoC) with no exceptions. The acquiring bank relationship was preserved and the client subsequently won a new acquirer relationship specifically citing their clean RoC.",
    name: "VP Technology",
    role: "Payment Gateway (₹180 Crore annual card transactions, Level 2 merchant)",
    icon: CreditCard,
    lottie: getCdnUrl("lottie/pcidss.json"),
    metrics: [
      { value: "23 → 0", label: "PCI-DSS Gap Items", sub: "Remediated in 14 weeks" },
      { value: "Clean RoC", label: "QSA Report on Compliance", sub: "Zero exceptions issued" },
    ],
  },
  {
    id: 6,
    heading: "GRC Programme Built in 10 Weeks — Series C Closed 18% Above Initial Term Sheet",
    quote:
      "ZecurX designed and implemented a complete GRC programme in 10 weeks: risk register with 47 identified and treated risks, TPRM programme with vendor tiering and quarterly assessment cadence, board security report template reviewed and approved by the CFO, and a unified control framework mapping their SOC 2 and ISO 27001 obligations to a single set of controls. The investor's due diligence team cited the GRC programme as evidence of institutional security maturity in their investment committee recommendation. The Series C closed at a valuation 18% higher than the initial term sheet.",
    name: "CFO",
    role: "600-Person Healthtech Company (Series C fundraise, PE investor due diligence)",
    icon: LayoutGrid,
    lottie: getCdnUrl("lottie/grc.json"),
    metrics: [
      { value: "10 weeks", label: "Full GRC Programme Built", sub: "47 risks identified and treated" },
      { value: "+18%", label: "Valuation vs Term Sheet", sub: "Series C close" },
    ],
  },
];

// ── JOURNEY STEPS ─────────────────────────────────────────────────────────────

const journeySteps = [
  {
    title: "Assess",
    desc: "Gap analysis, scope definition, risk assessment, and prioritised remediation roadmap.",
  },
  {
    title: "Design",
    desc: "Control architecture, policy framework, evidence collection structure, and tooling selection.",
  },
  {
    title: "Implement",
    desc: "Control deployment, policy adoption, GRC tooling configuration, and staff training.",
  },
  {
    title: "Evidence",
    desc: "Automated evidence collection, control testing, and internal audit preparation.",
  },
  {
    title: "Certify",
    desc: "Auditor coordination, management responses, fieldwork support, and report delivery.",
  },
  {
    title: "Maintain",
    desc: "Continuous monitoring, annual programme refresh, surveillance audit support, and regulatory updates.",
  },
];

// ── CONTROL OVERLAP TABLE ─────────────────────────────────────────────────────

const controlDomains = [
  { domain: "Access Control & IAM",    soc2: true,  iso: true,  pci: true,  dpdpa: true,  gdpr: true,  grc: true  },
  { domain: "Encryption & Key Mgmt",   soc2: true,  iso: true,  pci: true,  dpdpa: false, gdpr: true,  grc: true  },
  { domain: "Incident Response",       soc2: true,  iso: true,  pci: true,  dpdpa: true,  gdpr: true,  grc: true  },
  { domain: "Vulnerability Management",soc2: true,  iso: true,  pci: true,  dpdpa: false, gdpr: false, grc: true  },
  { domain: "Logging & Monitoring",    soc2: true,  iso: true,  pci: true,  dpdpa: false, gdpr: true,  grc: true  },
  { domain: "Data Classification",     soc2: true,  iso: true,  pci: true,  dpdpa: true,  gdpr: true,  grc: true  },
  { domain: "Third-Party Risk",        soc2: true,  iso: true,  pci: true,  dpdpa: true,  gdpr: true,  grc: true  },
  { domain: "Privacy & Consent",       soc2: false, iso: "partial", pci: false, dpdpa: true, gdpr: true, grc: true },
  { domain: "Business Continuity",     soc2: true,  iso: true,  pci: true,  dpdpa: false, gdpr: false, grc: true  },
  { domain: "Security Awareness",      soc2: true,  iso: true,  pci: true,  dpdpa: false, gdpr: false, grc: true  },
];

// ── GRC TOOLING ───────────────────────────────────────────────────────────────

const toolingGroups = [
  {
    icon: "⚙",
    title: "Compliance Automation",
    items: [
      "Vanta — SOC 2, ISO 27001, HIPAA, PCI evidence",
      "Drata — continuous compliance automation",
      "Secureframe — audit-ready evidence collection",
      "Tugboat Logic — policy and evidence management",
      "Sprinto — India-focused compliance automation",
      "Wiz + Orca — cloud compliance evidence collection",
    ],
  },
  {
    icon: "🗂",
    title: "GRC Platforms",
    items: [
      "ServiceNow GRC — enterprise risk and compliance",
      "OneTrust — privacy, GRC, and third-party risk",
      "LogicGate — risk management workflows",
      "Archer (RSA) — enterprise GRC platform",
      "MetricStream — integrated GRC suite",
      "Jira + Confluence — lightweight GRC for growing teams",
    ],
  },
  {
    icon: "🔍",
    title: "Privacy & Data Mapping",
    items: [
      "OneTrust Data Mapping — RoPA and DPIA automation",
      "Privacera — data governance and classification",
      "BigID — personal data discovery and classification",
      "TrustArc — consent management platform",
      "Didomi — granular consent and preference management",
      "DataGrail — DSR request management automation",
    ],
  },
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function ComplianceGovernancePage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <ComplianceGovernanceHero />

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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Why ZecurX
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Compliance as a competitive advantage —{" "}
                  <span className="text-[#4c69e4]">not a regulatory burden</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🔬",
                  title: "Security-First, Not Checkbox-First",
                  desc: "ZecurX helps you implement controls that actually work — and then produce the documentation. Our compliance programmes are grounded in the same technical security expertise that powers our penetration testing, SOC, and cloud security practices. The result is a compliance posture that withstands both auditor scrutiny.",
                },
                {
                  icon: "🇮🇳",
                  title: "India-Native Regulatory Expertise",
                  desc: "Deep, current knowledge of India's regulatory environment — DPDPA 2023, CERT-In, RBI, SEBI, IRDAI, and MeitY frameworks — combined with international certification expertise in SOC 2, ISO 27001, GDPR, and PCI-DSS. We speak fluently in both languages, for both Indian regulators and global enterprise customers.",
                },
                {
                  icon: "🔄",
                  title: "Continuous, Not Periodic",
                  desc: "We design compliance programmes that generate evidence continuously — not in a 6-week scramble before the auditor arrives. Automated evidence collection and integrated GRC tooling mean your compliance posture is always audit-ready. Our clients typically reduce audit preparation effort by 40% or more.",
                },
                {
                  icon: "✅",
                  title: "Commercial Outcome Oriented",
                  desc: "Every compliance engagement is structured around your business outcomes — closing a specific enterprise customer, satisfying a specific investor due diligence requirement, meeting a specific regulatory deadline. We understand that the SOC 2 report is not the end goal. The enterprise contract it unlocks is. We align our delivery accordingly.",
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Service Portfolio
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Six Specialised{" "}
                  <span className="text-[#4c69e4]">Compliance & Governance Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From gap analysis to certification in hand to ongoing programme management — one integrated compliance practice.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── COMPLIANCE JOURNEY ──────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">Compliance Journey Framework</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  A structured, continuous approach — from initial assessment to certification in hand to ongoing compliance-as-code.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {journeySteps.map((step, i) => (
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Deliverables
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  What You <span className="text-[#4c69e4]">Receive</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Audit-ready documentation and certification delivered at programme completion — not after a separate remediation exercise.
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Success Stories
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Proven compliance programme <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our compliance and governance engagements have delivered certifications, unlocked enterprise deals, and satisfied regulators.
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

        {/* ── CONTROL OVERLAP TABLE ─────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Unified Framework
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  One Control Set.{" "}
                  <span className="text-[#4c69e4]">Every Framework.</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  For organisations with multiple simultaneous obligations, ZecurX designs a single control set that satisfies all frameworks — eliminating redundant audit effort.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm font-inter">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-6 py-4 font-manrope font-bold text-[#0c1a2e] text-sm">Control Domain</th>
                      {["SOC 2", "ISO 27001", "PCI-DSS", "DPDPA", "GDPR", "GRC"].map((h) => (
                        <th key={h} className="px-4 py-4 font-manrope font-bold text-[#0c1a2e] text-sm text-center">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {controlDomains.map((row, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                        <td className="px-6 py-3.5 font-medium text-[#0c1a2e]">{row.domain}</td>
                        {[row.soc2, row.iso, row.pci, row.dpdpa, row.gdpr, row.grc].map((val, j) => (
                          <td key={j} className="px-4 py-3.5 text-center">
                            {val === true && <span className="text-emerald-500 font-bold">✅</span>}
                            {val === false && <span className="text-slate-300">—</span>}
                            {val === "partial" && <span className="text-amber-400 font-bold">⚠</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-6 py-3 text-xs text-slate-400 font-inter border-t border-slate-100">
                  ✅ Required &nbsp;&nbsp; ⚠ Partially applicable &nbsp;&nbsp; — Not required
                </p>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── GRC TOOLING ──────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Technology Coverage
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">GRC Tooling Ecosystem</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  The platforms ZecurX deploys and operates for continuous compliance programme management.
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

        {/* ── ENGAGEMENT MODELS ────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Engagement Models
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Compliance Timeline</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Commercial structures designed for the compliance timelines that matter — customer deadlines, regulatory notices, and investment rounds.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Certification Sprint",
                  desc: "Fixed-scope, timeline-driven engagement targeting a specific certification — SOC 2 Type I, ISO 27001 initial certification, PCI-DSS SAQ completion, or DPDPA readiness attestation. Defined milestones, weekly progress reporting, and a contractual target completion date. Ideal when a customer deadline or regulatory date drives the timeline.",
                },
                {
                  icon: "🔄",
                  title: "Continuous Compliance Programme",
                  desc: "Ongoing managed compliance programme — ZecurX operates your evidence collection, control monitoring, and programme maintenance as a managed service. Monthly compliance health reports, quarterly control reviews, and annual certification cycle management. Priced on a monthly retainer basis. Ideal for organisations with multiple active frameworks and no internal compliance team.",
                },
                {
                  icon: "🏗",
                  title: "GRC Programme Build",
                  desc: "Comprehensive GRC programme design and implementation — policy framework, risk register, TPRM programme, unified control framework, and GRC platform deployment. Delivered over 12–16 weeks. Designed for organisations scaling beyond individual certifications and establishing enterprise-grade governance infrastructure for PE, IPO, or major enterprise customer readiness.",
                },
                {
                  icon: "👤",
                  title: "Virtual CISO (vCISO)",
                  desc: "A named ZecurX senior security and compliance leader acting as your virtual CISO — owning the security and compliance programme, reporting to the board and executive team, managing relationships with auditors and regulators, and providing strategic security advisory. Monthly engagement. Includes all Layer 06 services as required. Ideal for Series B+ companies preparing for enterprise sales and institutional investment.",
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
        <section className="py-16 md:py-20 px-6 relative z-10">
          <div className="max-w-[800px] mx-auto">
            <BlurFade delay={0.2}>
              <div className="relative p-8 md:p-12 rounded-[2rem] border border-[#4c69e4]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(76,105,228,0.08)] overflow-hidden text-center">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4c69e410_1px,transparent_1px),linear-gradient(to_bottom,#4c69e410_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-manrope font-bold text-[#0c1a2e] mb-3">
                    Turn compliance from a cost centre into a{" "}
                    <span className="text-[#4c69e4]">competitive advantage.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-6 max-w-lg mx-auto text-base leading-relaxed">
                    Request a complimentary Compliance Readiness Snapshot — a 45-minute session with a ZecurX
                    senior compliance architect who will assess your current certification and regulatory posture,
                    identify the highest-priority gaps, and outline the fastest path to the compliance outcome
                    your business needs.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 py-3 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-1px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Get Compliance Readiness Snapshot
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-7 py-3 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
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