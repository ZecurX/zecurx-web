import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { AppSecHero } from "./app-sec-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Application Security Services | ZecurX",
  description:
    "We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them. Web, API, and source code security testing.",
  keywords: [
    "application security",
    "penetration testing",
    "API security",
    "OWASP",
    "secure code review",
    "web security",
  ],
  openGraph: {
    title: "Application Security Services | ZecurX",
    description:
      "We identify and fix real-world vulnerabilities in your applications, APIs, and codebases before attackers exploit them.",
    type: "website",
    url: "https://zecurx.com/services/application-security",
  },
  alternates: {
    canonical: "https://zecurx.com/services/application-security",
  },
};

const capabilities = [
  {
    title: "Web Application Penetration Testing",
    desc: "We perform deep-dive manual testing combined with automated scanning to identify complex vulnerabilities like logic flaws, race conditions, and access control bypasses (IDOR) that standard scanners miss. We align our testing with OWASP Top 10 and WASC standards.",
    icon: "Search",
  },
  {
    title: "API Security Testing",
    desc: "Modern apps run on APIs. We test your REST, GraphQL, and gRPC endpoints for broken object level authorization (BOLA), mass assignment, and injection flaws. We verify that your backend validates every request, not just the ones from your UI.",
    icon: "Code",
  },
  {
    title: "Business Logic Assessment",
    desc: "We analyze your specific application workflows to find flaws that technical scanners can't see—like coupon fraud, pricing manipulation, or privilege escalation through legitimate features. This requires understanding your business context, not just your code.",
    icon: "FileCode",
  },
  {
    title: "Secure Code Review",
    desc: "We review your source code (manual + SAST) to catch security issues at the root. We identify hardcoded secrets, insecure cryptographic implementations, and vulnerable dependencies in your codebase before they reach production.",
    icon: "FileCheck",
  },
  {
    title: "Authentication & Authorization",
    desc: "We rigorously test your IAM implementation. This includes testing for session fixation, JWT weaknesses, OAuth/OIDC misconfigurations, and ensuring that multi-tenant data isolation is strictly enforced.",
    icon: "KeyRound",
  },
  {
    title: "Retesting & Fix Validation",
    desc: "We don't just hand you a report and leave. We retest every fixed vulnerability to ensure the remediation is effective and hasn't introduced new regressions. You get a clean bill of health report for your auditors.",
    icon: "CheckCircle",
  },
];

const deliverables = [
  {
    title: "Executive Summary",
    desc: "A high-level risk overview designed for stakeholders and non-technical leadership, highlighting business impact and ROI of remediation.",
    icon: "ShieldCheck",
  },
  {
    title: "Technical Vulnerability Report",
    desc: "Detailed findings with CVSS scores, proof-of-concept (PoC) exploits, and step-by-step reproduction instructions for your engineering team.",
    icon: "Bug",
  },
  {
    title: "Remediation Roadmap",
    desc: "Prioritized fix recommendations tailored to your tech stack (e.g., 'Use this specific React hook' instead of generic advice), helping you fix critical issues fast.",
    icon: "GitBranch",
  },
  {
    title: "Compliance Artifacts",
    desc: "Formal testing attestations and reports that satisfy requirements for SOC 2, ISO 27001, HIPAA, and vendor security questionnaires.",
    icon: "Award",
  },
];

const appSecCaseStudies: CaseStudy[] = [
  {
    id: 1,
    heading: "Critical IDOR Vulnerability Eliminated",
    quote: "\"ZecurX found a critical IDOR flaw in our multi-tenant SaaS that could have exposed all customer data. Their team didn't just report it — they helped us redesign the authorization layer.\"",
    name: "Rahul Sharma",
    role: "CTO, FinTech Startup",
    icon: "ShieldCheck",
    image: "/images/case-studies/idor.webp",
    lottie: getCdnUrl("lottie/idor_vuln.json"),
    metrics: [
      { value: "23", label: "Critical Vulns Found", sub: "In first assessment" },
      { value: "100%", label: "Fix Rate", sub: "Within 30 days" },
    ]
  },
  {
    id: 2,
    heading: "SOC 2 Pentest Passed First Try",
    quote: "\"We needed a penetration test for SOC 2 Type II. ZecurX provided a thorough assessment with compliance-ready artifacts that our auditor accepted without any questions.\"",
    name: "Ankit Verma",
    role: "VP Engineering, SaaS Platform",
    icon: "Award",
    image: "/images/case-studies/soc2.webp",
    lottie: getCdnUrl("lottie/soc_pentest.json"),
    metrics: [
      { value: "48h", label: "Report Delivery", sub: "After testing completed" },
      { value: "0", label: "Audit Findings", sub: "Zero non-conformities" },
    ]
  }
];

const stats = [
  {
    value: "500+",
    label: "Vulnerabilities Found",
  },
  {
    value: "98%",
    label: "Fix Rate",
  },
  {
    value: "48h",
    label: "Avg. Turnaround",
  },
];

export default function ApplicationSecurityPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <AppSecHero />

        {/* ── STATS SECTION ───────────────────────── */}
        <section className="py-12 border-y border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-4 md:py-8 group">
                  <span className="text-4xl md:text-5xl font-bold text-[#0c1a2e] mb-2 font-manrope transition-colors duration-300 group-hover:text-[#4a69e6]">
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
                What We <span className="text-[#4a69e6]">Test</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Comprehensive coverage across your application attack surface. We go beyond automated scanners.
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
                What You <span className="text-[#4a69e6]">Get</span>
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
            subtitle="See how our application security assessments have helped teams ship secure code faster."
            studies={appSecCaseStudies}
          />
      </div>

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <div className="max-w-[1000px] mx-auto">
          <BlurFade delay={0.2}>
            <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4a69e6]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4a69e610_1px,transparent_1px),linear-gradient(to_bottom,#4a69e610_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                  Ready to secure your <span className="text-[#4a69e6]">application</span>?
                </h2>
                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                  Get a security assessment tailored to your tech stack. Fast
                  turnaround, developer-friendly reports.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="relative inline-flex items-center justify-center gap-2 bg-[#4a69e6] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
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