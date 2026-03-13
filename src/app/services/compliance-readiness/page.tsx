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

const frameworks = [
  {
    title: "ISO 27001",
    desc: "We guide you through the entire ISMS implementation process. From defining your scope and conducting risk assessments to developing policies and preparing for the stage 1 and stage 2 audits. We help you build a security culture, not just pass a checklist.",
    badge: "ISMS",
    icon: "Shield",
    span: 3,
  },
  {
    title: "SOC 2 (Type I & II)",
    desc: "We help SaaS companies prepare for SOC 2 audits. We assist with defining your trust service criteria (Security, Availability, Confidentiality, etc.), mapping controls to your existing processes, and collecting evidence to prove operational effectiveness over time.",
    badge: "AICPA",
    icon: "FileCheck",
    span: 3,
  },
  {
    title: "India DPDP Act",
    desc: "We help businesses align with India's Digital Personal Data Protection Act. We assist with data mapping, consent management architectures, grievance redressal mechanisms, and implementing technical safeguards for personal data.",
    badge: "INDIA",
    icon: "Scale",
    span: 3,
  },
  {
    title: "HIPAA Security Rule",
    desc: "For healthcare-related applications, we ensure you meet the physical, technical, and administrative safeguards required to protect ePHI. We help with risk analysis, business associate agreements, and access control implementations.",
    badge: "HEALTH",
    icon: "Heart",
    span: 3,
  },
];

const scope = [
  {
    title: "Gap Assessment",
    desc: "We perform a detailed analysis of your current security posture against the target framework's controls. You get a clear roadmap of exactly what is missing and how to fix it.",
    icon: "Search",
    span: 6,
    variant: "highlight",
  },
  {
    title: "Policy & Control Documentation",
    desc: "We don't give you templates to fill out. We work with you to write custom Information Security Policies, Incident Response Plans, and SOPs that actually reflect how your startup operates.",
    icon: "FileText",
    span: 3,
  },
  {
    title: "Technical Control Implementation",
    desc: "We don't just write docs. We help you configure your cloud, endpoints, and tools to meet the technical requirements of the standard (e.g., setting up MDM, configuring AWS GuardDuty).",
    icon: "Settings",
    span: 3,
  },
  {
    title: "Internal Audit Support",
    desc: "We conduct a mock audit before the real external auditor arrives. We interview your team, check your evidence, and identify any last-minute gaps to ensure you pass with zero non-conformities.",
    icon: "ClipboardCheck",
    span: 6,
    variant: "stat",
    statValue: "100%",
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
  {
    id: 3,
    heading: "DPDP Act Compliance Achieved",
    quote:
      "With India\'s DPDP Act, we needed help fast. ZecurX mapped all our data flows, built consent architectures, and set up grievance redressal—all without disrupting our product roadmap.",
    name: "Ravi Shankar",
    role: "DPO, Consumer FinTech",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=800&fit=crop",
    icon: "Scale",
    metrics: [
      { value: "100%", label: "Data Mapped", sub: "All PII flows documented" },
      {
        value: "30",
        label: "Days to Comply",
        sub: "Ahead of regulatory deadline",
      },
    ],
  },
];

export default function ComplianceReadinessPage() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <FadeUp delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
                    <HeroWords>Supporting Service</HeroWords>
                  </span>
                </div>
              </FadeUp>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                <HeroWords delay={heroEnd(2)}>Compliance </HeroWords>
                <HeroWords delay={heroEnd(3)}>
                  <span className="text-muted-foreground">Readiness</span>
                </HeroWords>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                <HeroWords delay={heroEnd(4)}>
                  Prepare for security compliance without slowing down your
                  product development. We help you navigate frameworks with
                  confidence.
                </HeroWords>
              </p>

              <div
                className="flex flex-wrap gap-4 opacity-0"
                style={{
                  animation: "word-appear 0.5s ease-out forwards",
                  animationDelay: `${heroEnd(20)}ms`,
                }}
              >
                <Link
                  href="/contact"
                  className="group px-7 py-3.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  Start Compliance Journey
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
                    src={`${process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com"}/images/services/compliance-readiness.png`}
                    alt="Compliance Readiness illustration"
                    width={400}
                    height={400}
                    className="w-56 h-56 md:w-72 md:h-72 relative z-10 dark:invert dark:hue-rotate-180 drop-shadow-lg"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEvUExURX+Rw32Pv32OvH+PuoWUvI2cwZekx6Ctzqez1Ky42IaYyoWWxoSVw4aWwYuawpKhx5upzaOx06q32K67246fz42dzIucyYycx5CfyJelzJ6s0aWz1qu426+83pim0pWkz5OizJOhy5Wjy5qoz6Cu1Ka02Kq43K6836Gs05+q0ZyozpqmzZqnzpyq0aCu1aSz2ai33au636yy0qmw0KWtzqKrzZ+qzp6r0aCu1aKx2aW03Ki33re40bO1z6+yzqqvzaWtzqGs0J+t1KCv2KKy26S03cG9z726zbi3zLKzzKqwzaSt0KCt0p6t15+v2qCx3MnBzcW+zMC7y7m3y7CyzKewzqGt0p6s1p2t2Z2u29DEzMzCy8a+yr+6yrW1y6uwzqOt0Z6s1Zys2Jyt2v///53NSWcAAABkdFJOUwECAwMEBAQDAgECBAUHCAgIBgQDBAcKDA4ODQsIBQYKDhIUFRQQDAcIDRIWGRoYFA8JCA4UGBsbGhYPCQgNEhYZGRcTDggGCg8SExMSDwoGBAcKDA0NDAkGBAIEBgcHBwYFAwKPXztGAAAAAWJLR0Rkwtq4CQAAAHZJREFUCB1jYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FRAMEWORKS WE SUPPORT (BENTO GRID) ───────────────── */}
      <ServiceBentoFeatures
        label="Frameworks"
        title="Frameworks We"
        titleAccent="Support"
        subtitle="Whether you are targeting enterprise deals or regulatory alignment, we have you covered."
        items={frameworks as any}
      />

      {/* ── HOW WE HELP (BENTO GRID) ─────────────────────────── */}
      <div className="border-y border-border/30 bg-muted/5 relative">
        <ServiceBentoFeatures
          label="Process"
          title="How We"
          titleAccent="Help"
          subtitle="We are not auditors. We are your partners in preparing for the audit, doing the heavy lifting on documentation and tech."
          items={scope as any}
        />
      </div>

      {/* ── CASE STUDIES ─────────────────────────────────────── */}
      <CaseStudies
        title="Compliance success stories"
        subtitle="How we helped teams achieve security certifications without slowing down product development."
        studies={complianceCaseStudies}
      />

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <ScaleInScroll>
            <div className="relative p-8 md:p-14 rounded-3xl border border-border/40 bg-card/20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Need to get compliant?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                  We help startups and SMEs navigate compliance without the
                  enterprise overhead.
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
