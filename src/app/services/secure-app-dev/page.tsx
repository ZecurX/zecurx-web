import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Code2, Shield, Smartphone, Plug, Bot, Layers } from "lucide-react";
import { SecureAppDevHero } from "./secure-app-dev-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Secure Application Development | ZecurX",
  description:
    "Full-stack secure application development — web, mobile, API, AI products, legacy modernisation, and security architecture design. OWASP ASVS-aligned engineering with security baked in from line one, not patched in after a penetration test.",
  keywords: [
    "secure application development",
    "OWASP ASVS",
    "secure mobile development",
    "API security",
    "AI product development",
    "legacy modernisation",
    "security architecture",
    "OWASP MASVS",
    "secure SDLC",
    "threat modelling",
  ],
  openGraph: {
    title: "Secure Application Development | ZecurX",
    description:
      "Full-stack secure application development — OWASP ASVS-aligned engineering with security baked in from line one.",
    type: "website",
    url: "https://zecurx.com/services/secure-appdev",
  },
  alternates: {
    canonical: "https://zecurx.com/services/secure-appdev",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "Secure Web Application Development",
    desc: "React, Next.js, and Node.js applications built with OWASP ASVS Level 2 as the development baseline — authentication, authorisation, session management, input validation, and CSP hardening defined as engineering requirements before Sprint 1. Security documentation delivered at handover: threat model, DFDs, ASVS coverage matrix, and ADRs.",
    icon: "Code2",
  },
  {
    title: "Secure Mobile Development",
    desc: "iOS and Android applications built to OWASP MASVS L1 and L2 standards — Keychain/Keystore-based credential storage, certificate pinning, biometric authentication, anti-tampering controls, and cleartext elimination. Built to satisfy RBI mobile banking controls and CERT-In audit requirements.",
    icon: "Smartphone",
  },
  {
    title: "API Design & Development",
    desc: "REST and GraphQL APIs designed spec-first with authentication, BOLA/IDOR prevention, rate limiting, granular authorisation, and structured audit logging as core architectural features. OWASP API Security Top 10 addressed at design phase — not discovered in penetration testing.",
    icon: "Plug",
  },
  {
    title: "AI Product Development",
    desc: "LLM-powered applications and autonomous agents built with prompt injection-resistant architecture, integrated safety guardrails, RAG security controls, output monitoring, and EU AI Act compliance documentation. Safety and guardrails as first-class product features — not post-launch additions.",
    icon: "Bot",
  },
  {
    title: "Legacy System Modernisation",
    desc: "Secure migration from monolithic architectures to microservices — pre-migration security audit, security-aligned decomposition, authentication and authorisation model migration, mTLS service mesh, and post-migration OWASP ASVS validation. Zero security regression guaranteed across every migration phase.",
    icon: "Layers",
  },
  {
    title: "Security Architecture Design",
    desc: "STRIDE + PASTA threat modelling, zero-trust architecture design, trust boundary mapping, cryptographic architecture review, and security ADRs for new products before development begins. The highest-ROI security investment in the development lifecycle — changes cost a whiteboard session, not a refactor.",
    icon: "Shield",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "Security Architecture Document",
    desc: "Formal threat model (STRIDE + PASTA), data flow diagrams, trust boundary map, security requirements traceability matrix, and Architecture Decision Records with explicit security rationale — suitable for engineering briefing, compliance audit, and investor due diligence.",
    icon: "FileText",
  },
  {
    title: "OWASP ASVS Coverage Matrix",
    desc: "Complete mapping of the delivered application against OWASP ASVS Level 2 requirements — documenting how each security control is implemented, with evidence references. Ready for penetration test briefing, SOC 2 audit, and enterprise security questionnaire response.",
    icon: "BarChart",
  },
  {
    title: "Security Documentation Package",
    desc: "Data flow diagrams, authentication model specification, API security schema, encryption design document, and dependency SCA report — the complete security documentation set that answers every enterprise customer security questionnaire and satisfies auditor evidence requests.",
    icon: "GitBranch",
  },
  {
    title: "Regulatory Compliance Mapping",
    desc: "Application security controls mapped to CERT-In, RBI, IRDAI, PCI-DSS v4.0 Requirements 6 and 11, DPDPA 2023, and EU AI Act (for AI product engagements) — delivered as a compliance evidence document ready for regulatory audit.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "30x",
    label: "Cost to fix a security flaw in production vs. during design",
    sub: "NIST research",
  },
  {
    value: "6 Services",
    label: "Full-stack secure development — web, mobile, API, AI, legacy, and architecture",
    sub: "One integrated practice",
  },
  {
    value: "OWASP-First",
    label: "Every application built against OWASP Top 10, API Security Top 10, and ASVS",
    sub: "By default, not by checklist",
  },
  {
    value: "Day Zero",
    label: "Security requirements defined before the first line of code is written",
    sub: "Not retrofitted after launch",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "Zero Critical Findings on Initial Pentest — All 40 Hospital Security Questionnaires Completed in 3 Days",
    quote:
      "ZecurX built the application from the ground up against OWASP ASVS Level 2, with field-level encryption for all PHI, WebAuthn authentication for medical staff, and a complete security documentation package. When the mandatory penetration test was conducted by the hospital group's appointed testing firm, zero critical or high-severity findings were identified — the first time this hospital group had seen a zero-high result on an initial assessment of any new vendor application. All 40 hospital security questionnaires were completed in 3 days using the security documentation ZecurX delivered at handover.",
    name: "CTO",
    role: "Series A Healthtech Company (PHI portal for 40 hospital clients)",
    icon: Code2,
    lottie: getCdnUrl("lottie/web_appdev.json"),
    metrics: [
      { value: "0", label: "Critical/High Findings", sub: "On initial penetration test" },
      { value: "3 days", label: "Security Questionnaires", sub: "All 40 hospitals completed" },
    ],
  },
  {
    id: 2,
    heading: "Zero Critical Findings on CERT-In Audit — ₹12 Crore Disbursed in First 90 Days",
    quote:
      "ZecurX built both iOS and Android applications from the ground up against OWASP MASVS L2, with full certificate pinning, Keychain/Keystore-based credential storage, biometric authentication, and anti-tampering controls. The CERT-In audit identified zero critical or high-severity findings. The applications launched on schedule and processed ₹12 Crore in loan disbursements in the first 90 days without a single security incident. The startup's NBFC licence renewal specifically cited the CERT-In clean audit as evidence of adequate cybersecurity controls.",
    name: "Co-Founder & CEO",
    role: "Digital Lending Startup (Aadhaar KYC, iOS + Android, RBI-regulated)",
    icon: Smartphone,
    lottie: getCdnUrl("lottie/mobile_appdev.json"),
    metrics: [
      { value: "0", label: "Critical/High Findings", sub: "CERT-In audit" },
      { value: "₹12 Cr", label: "Disbursed in 90 Days", sub: "Zero security incidents" },
    ],
  },
  {
    id: 3,
    heading: "14 High-Severity API Findings Eliminated — ISO 27001 Regained, 3 Enterprise Clients Reinstated",
    quote:
      "A B2B payments platform needed to rebuild their core API layer after a penetration test identified 14 high-severity findings — including a critical BOLA vulnerability allowing one enterprise client to query another's transaction history by incrementing a numeric ID, and an absent rate limiting implementation that had allowed a competitor's automated tool to enumerate 340,000 account records. ZecurX redesigned and rebuilt the API layer from the ground up — UUID-based resource identification, object-level authorisation on every endpoint, per-client rate limiting with burst allowances, and comprehensive structured audit logging. A follow-up penetration test 3 months after the rebuild found zero critical or high-severity findings.",
    name: "VP Engineering",
    role: "B2B Payments Platform (180 enterprise clients, API-based disbursement)",
    icon: Plug,
    lottie: getCdnUrl("lottie/api_appdev.json"),
    metrics: [
      { value: "14 → 0", label: "High-Severity Findings", sub: "Pre vs. post rebuild" },
      { value: "3", label: "Enterprise Clients Reinstated", sub: "After ISO 27001 regained" },
    ],
  },
  {
    id: 4,
    heading: "Critical Authorisation Regression Caught Before Go-Live — IRDAI Audit Passed, Zero Compliance Gaps",
    quote:
      "During migration of a 15-year-old policy management monolith handling 2.3 million active policy records, ZecurX identified a critical authorisation regression in the claims processing microservice — a decomposition decision had inadvertently made claims approval accessible to policy administrators who lacked that permission in the monolith. The regression was identified in ZecurX's parallel security testing before the service went live. Post-migration OWASP ASVS assessment confirmed zero security regression against the baseline. The IRDAI regulatory audit of the migrated system found no compliance gaps.",
    name: "Head of Engineering",
    role: "National Insurance Company (2.3M policy records, ₹800 Cr annual premium)",
    icon: Layers,
    lottie: getCdnUrl("lottie/legacy_appdev.json"),
    metrics: [
      { value: "1", label: "Critical Regression Caught", sub: "Before go-live" },
      { value: "0", label: "IRDAI Compliance Gaps", sub: "Post-migration audit" },
    ],
  },
];

// ── SDLC STEPS ────────────────────────────────────────────────────────────────

const sdlcSteps = [
  {
    title: "Design",
    desc: "Threat modelling, security architecture review, trust boundary mapping, security ADRs.",
  },
  {
    title: "Requirements",
    desc: "OWASP ASVS/MASVS security requirements as engineering stories — defined before Sprint 1.",
  },
  {
    title: "Develop",
    desc: "Secure coding standards, security-literate code review, SAST on every PR.",
  },
  {
    title: "Build",
    desc: "SCA, secrets scanning, SBOM generation, dependency lock, and artifact signing.",
  },
  {
    title: "Test",
    desc: "DAST, security regression testing, penetration testing on staging.",
  },
  {
    title: "Deploy & Operate",
    desc: "Security configuration validation, runtime monitoring, and continuous OWASP ASVS compliance.",
  },
];

// ── TOOLING COVERAGE ──────────────────────────────────────────────────────────

const toolingGroups = [
  {
    icon: "⬡",
    title: "Frontend & Mobile",
    items: [
      "React, Next.js, Vue.js, Angular (SPA/SSR)",
      "iOS (Swift, Objective-C, SwiftUI)",
      "Android (Kotlin, Java, Jetpack Compose)",
      "React Native and Flutter (cross-platform)",
      "Progressive Web Applications (PWA)",
      "Electron desktop application security",
    ],
  },
  {
    icon: "⚙",
    title: "Backend & API",
    items: [
      "Node.js / TypeScript, Python (FastAPI, Django)",
      "Go, Java (Spring Boot), Ruby on Rails",
      "GraphQL (Apollo, Hasura), REST, gRPC",
      "PostgreSQL, MySQL, MongoDB, Redis",
      "Microservices and serverless architectures",
      "AWS, GCP, Azure native services",
    ],
  },
  {
    icon: "🤖",
    title: "AI & Security Tooling",
    items: [
      "LangChain, LlamaIndex, AutoGen (agent frameworks)",
      "OpenAI, Anthropic, Google Gemini APIs",
      "Vector databases (Pinecone, ChromaDB, pgvector)",
      "SAST: Semgrep, SonarQube, CodeQL",
      "DAST: OWASP ZAP, Burp Suite integration",
      "SCA: Snyk, Dependabot, OWASP Dependency-Check",
    ],
  },
];

// ── FRAMEWORKS ────────────────────────────────────────────────────────────────

const appSecStandards = [
  "OWASP Application Security Verification Standard (ASVS) 4.0 — full Level 1/2/3 coverage",
  "OWASP API Security Top 10 (2023) — all 10 vulnerability classes addressed in API design",
  "OWASP Mobile Application Security Verification Standard (MASVS) — L1 and L2 for iOS/Android",
  "OWASP Top 10 (2021) — eliminated by design, not patched after discovery",
  "OWASP LLM Application Security Top 10 — for AI product development engagements",
  "NIST Secure Software Development Framework (SSDF) — SP 800-218 aligned development practices",
];

const regulatoryFrameworks = [
  "CERT-In Security Audit compliance — applications built to satisfy empanelled auditor requirements",
  "RBI Digital Banking Security Controls — mobile banking and payment application standards",
  "IRDAI IT and cybersecurity guidelines — insurance sector application security requirements",
  "PCI-DSS v4.0 Requirements 6 (secure development) and 11 (security testing)",
  "DPDPA 2023 — personal data handling, consent collection, and data subject rights implementation",
  "EU AI Act — high-risk AI system requirements for AI product development engagements",
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function SecureAppDevPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <SecureAppDevHero />

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
                  Engineers who break applications for a living —{" "}
                  <span className="text-[#4c69e4]">now building yours to be unbreakable</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "⬡",
                  title: "The Attacker's Perspective In Every Sprint",
                  desc: "ZecurX developers are trained by the same team that conducts our penetration testing engagements. Every developer understands how applications are broken — not just how they are built. The result is code that anticipates adversarial inputs,and treats every external interface as a potential attack surface.",
                },
                {
                  icon: "📋",
                  title: "Security Requirements Before Sprint 1",
                  desc: "Every engagement begins with threat modelling and security requirement definition — before the first user story is written. Authentication models, authorisation boundaries, data classification, encryption requirements, and input validation rules are defined as engineering constraints, not retrospective audits.",
                },
                {
                  icon: "🔬",
                  title: "OWASP-Aligned by Default",
                  desc: "Every web application is built against the OWASP Application Security Verification Standard (ASVS). Every API is designed against the OWASP API Security Top 10. These are not external checklists applied at the end — they are the engineering standards we code to from day one.",
                },
                {
                  icon: "✅",
                  title: "Built to Be Tested and Certified",
                  desc: "Applications built by ZecurX are designed to pass penetration testing — including our own Layer 01 red team. We deliver applications with security documentation, data flow diagrams, threat models, and test evidence that satisfy SOC 2, ISO 27001, PCI-DSS, and regulatory audit requirements without additional remediation effort.",
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
                  Six Specialised <span className="text-[#4c69e4]">Secure Development Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From architecture blueprints to production-ready, audit-certified applications — one integrated secure development practice.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── SECURE SDLC ─────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">Secure SDLC Framework</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Security integrated at every stage of the software development lifecycle — from concept to production and beyond.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {sdlcSteps.map((step, i) => (
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
                  Audit-ready documentation delivered at handover — not after a separate remediation engagement.
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
                  Proven secure development <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our secure application development engagements have delivered clean audits,
                  zero regressions, and applications that pass penetration testing on first attempt.
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Technology Coverage
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Native Expertise Across the{" "}
                  <span className="text-[#4c69e4]">Full Stack</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Development expertise across every major platform, framework, and deployment environment.
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Standards & Compliance
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Regulatory <span className="text-[#4c69e4]">Alignment</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Every application built by ZecurX is designed to satisfy the security requirements of your regulators, auditors, and enterprise customers.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlurFade delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">📋</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      Application Security Standards
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {appSecStandards.map((item, i) => (
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
                    <span className="text-2xl">⚖</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      Regulatory & Compliance Alignment
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {regulatoryFrameworks.map((item, i) => (
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
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Engagement Models
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Development Methodology</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Commercial structures designed to match your team structure, methodology, and delivery timeline.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🏗",
                  title: "Full Product Build",
                  desc: "End-to-end secure application development — ZecurX designs, builds, and delivers the complete application with security embedded throughout. Fixed scope and timeline with milestone-based delivery. Includes security architecture, full SDLC security integration, security documentation package, and post-delivery penetration test. Ideal for greenfield products where security is a differentiator.",
                },
                {
                  icon: "🤝",
                  title: "Embedded Security Engineering",
                  desc: "ZecurX security engineers embedded in your existing development team — participating in sprint planning, conducting security code review in pull requests, owning the security backlog, and mentoring your developers in secure coding practices. Retainer-based monthly engagement. Ideal for product companies with strong engineering teams that need security expertise added to each sprint.",
                },
                {
                  icon: "📐",
                  title: "Architecture Review & Design",
                  desc: "Focused security architecture engagement — threat modelling, security architecture review, and security requirements definition for a new product or major feature. 2–4 week fixed-scope engagement. Deliverable: formal security architecture document with threat model, DFDs, trust boundary map, and security requirements specification. Ideal for products at the design stage before Sprint 1.",
                },
                {
                  icon: "🔄",
                  title: "Security Modernisation Sprint",
                  desc: "Targeted security improvement for existing applications — addressing a penetration test remediation backlog, implementing a missing security control layer, or conducting a focused OWASP ASVS gap remediation. Fixed scope and timeline. Ideal for applications with identified security debt that needs structured remediation before a compliance audit or enterprise customer requirement.",
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
                    Build software that your penetration tester{" "}
                    <span className="text-[#4c69e4]">cannot break.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-6 max-w-lg mx-auto text-base leading-relaxed">
                    Request a complimentary Secure Architecture Assessment — a 45-minute session with a ZecurX
                    senior security engineer who will review your current application architecture, identify
                    the highest-risk security gaps, and outline what a security-first build or hardening
                    programme would deliver.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-500 font-inter mb-6">
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 py-3 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-1px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Get Secure Architecture Assessment
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-7 py-3 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                    >
                      All Services
                    </Link>
                  </div>
                  <p className="mt-6 text-xs text-slate-400 font-inter">
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