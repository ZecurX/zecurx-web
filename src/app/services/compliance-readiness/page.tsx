import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { ComplianceHero } from "./compliance-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Compliance Readiness | ZecurX",
  description:
    "Prepare for security compliance without slowing down your product development. ISO 27001, SOC 2, and India DPDP Act readiness support.",
  keywords: [
    "compliance readiness",
    "ISO 27001",
    "SOC 2",
    "DPDP Act",
    "security compliance",
    "audit preparation",
  ],
  openGraph: {
    title: "Compliance Readiness | ZecurX",
    description:
      "Prepare for security compliance without slowing down your product development.",
    type: "website",
    url: "https://zecurx.com/services/compliance-readiness",
  },
  alternates: {
    canonical: "https://zecurx.com/services/compliance-readiness",
  },
};

const capabilities = [
  {
    title: "ISO 27001",
    desc: "We guide you through the entire ISMS implementation process. From defining your scope and conducting risk assessments to developing policies and preparing for the stage 1 and stage 2 audits. We help you build a security culture, not just pass a checklist.",
    icon: "Shield",
  },
  {
    title: "SOC 2 (Type I & II)",
    desc: "We help SaaS companies prepare for SOC 2 audits. We assist with defining your trust service criteria (Security, Availability, Confidentiality, etc.), mapping controls to your existing processes, and collecting evidence to prove operational effectiveness over time.",
    icon: "FileCheck",
  },
  {
    title: "India DPDP Act",
    desc: "We help businesses align with India's Digital Personal Data Protection Act. We assist with data mapping, consent management architectures, grievance redressal mechanisms, and implementing technical safeguards for personal data.",
    icon: "Scale",
  },
  {
    title: "HIPAA Security Rule",
    desc: "For healthcare-related applications, we ensure you meet the physical, technical, and administrative safeguards required to protect ePHI. We help with risk analysis, business associate agreements, and access control implementations.",
    icon: "Heart",
  },
];

const deliverables = [
  {
    title: "Gap Assessment",
    desc: "We perform a detailed analysis of your current security posture against the target framework's controls. You get a clear roadmap of exactly what is missing and how to fix it.",
    icon: "Search",
  },
  {
    title: "Policy & Control Documentation",
    desc: "We don't give you templates to fill out. We work with you to write custom Information Security Policies, Incident Response Plans, and SOPs that actually reflect how your startup operates.",
    icon: "FileText",
  },
  {
    title: "Technical Control Implementation",
    desc: "We don't just write docs. We help you configure your cloud, endpoints, and tools to meet the technical requirements of the standard (e.g., setting up MDM, configuring AWS GuardDuty).",
    icon: "Settings",
  },
  {
    title: "Internal Audit Support",
    desc: "We conduct a mock audit before the real external auditor arrives. We interview your team, check your evidence, and identify any last-minute gaps to ensure you pass with zero non-conformities.",
    icon: "ClipboardCheck",
  },
];

const complianceCaseStudies: CaseStudy[] = [
  {
    id: 1,
    heading: "ISO 27001 Certified in 10 Weeks",
    quote:
      "ZecurX took us from zero to ISO 27001 certified in just 10 weeks. They wrote our ISMS policies, configured our tools, and prepped us for the stage 2 audit. We passed with zero non-conformities.",
    name: "Deepak Kumar",
    role: "CEO, B2B SaaS Platform",
    lottie: getCdnUrl("lottie/iso.json"),
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=800&fit=crop",
    icon: "Award",
    metrics: [
      { value: "10", label: "Weeks to Certify", sub: "From zero to ISO 27001" },
      { value: "0", label: "Non-Conformities", sub: "Passed on first attempt" },
    ],
  },
  {
    id: 2,
    heading: "SOC 2 Type II Audit-Ready",
    quote:
      "We lost a $2M deal because we didn\'t have SOC 2. ZecurX helped us prepare in 8 weeks. Our next enterprise prospect signed within a month of receiving our report.",
    name: "Sanya Malhotra",
    role: "VP Sales, Cloud Analytics",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=800&fit=crop",
    icon: "FileCheck",
    metrics: [
      { value: "8", label: "Weeks to SOC 2", sub: "Readiness preparation" },
      {
        value: "$2M",
        label: "Deal Unlocked",
        sub: "Enterprise contract signed",
      },
    ],
  },
];

const stats = [
  {
    value: "100%",
    label: "Audit Pass Rate",
  },
  {
    value: "10w",
    label: "Avg. Readiness Time",
  },
  {
    value: "50+",
    label: "Companies Prepared",
  },
];

export default function ComplianceReadinessPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <ComplianceHero />

        {/* ── STATS SECTION ───────────────────────── */}
        <section className="py-12 border-y border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-4 md:py-8 group">
                  <span className="text-4xl md:text-5xl font-bold text-[#0c1a2e] mb-2 font-manrope transition-colors duration-300 group-hover:text-[#4c69e4]">
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
                Frameworks
              </span>
              <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                What We <span className="text-[#4c69e4]">Support</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                We help you navigate complex regulatory landscapes without slowing down your team.
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
                Scope
              </span>
              <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                How We <span className="text-[#4c69e4]">Work</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Our proven methodology takes you from gap assessment to audit success.
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
            title="Proven compliance outcomes"
            subtitle="See how we have helped organizations achieve compliance at scale."
            studies={complianceCaseStudies}
          />
      </div>

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <div className="max-w-[1000px] mx-auto">
          <BlurFade delay={0.2}>
            <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4c69e4]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4c69e410_1px,transparent_1px),linear-gradient(to_bottom,#4c69e410_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                  Ready to start your <span className="text-[#4c69e4]">compliance</span> journey?
                </h2>
                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                  Get expert guidance tailored to your startup's needs. Fast
                  turnaround, audit-ready deliverables.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
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