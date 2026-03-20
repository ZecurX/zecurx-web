import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import CaseStudies, { CaseStudy } from "@/components/ui/case-studies";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import { SecureAiHero } from "./secure-ai-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";

export const metadata: Metadata = {
  title: "Secure AI Application Development | ZecurX",
  description:
    "We build AI-powered applications with security embedded from architecture to deployment. Secure MVPs, LLM integration, and AI threat modeling.",
  keywords: [
    "AI security",
    "LLM security",
    "secure AI development",
    "AI application security",
    "prompt injection",
    "AI threat modeling",
    "AI red teaming",
  ],
  openGraph: {
    title: "Secure AI Application Development | ZecurX",
    description:
      "We build AI-powered applications with security embedded from architecture to deployment.",
    type: "website",
    url: "https://zecurx.com/services/secure-ai-development",
  },
  alternates: {
    canonical: "https://zecurx.com/services/secure-ai-development",
  },
};

const capabilities = [
  {
    title: "AI Red Teaming",
    desc: "We conduct adversarial simulation to stress-test your models against real-world attacks. Our team attempts advanced prompt injections, jailbreaks, and extraction attacks to find weaknesses before you deploy.",
    icon: "Target",
  },
  {
    title: "Secure RAG Architecture",
    desc: "We design and review Retrieval-Augmented Generation systems to prevent unauthorized data access. We ensure your vector databases and retrieval logic implement strict access controls (RBAC) so users only retrieve documents they are authorized to see.",
    icon: "Building",
  },
  {
    title: "LLM Guardrails Implementation",
    desc: "We develop robust input/output filtering layers to sanitize interactions. Using frameworks like NeMo Guardrails or custom classifiers, we block malicious prompts before they reach your model and filter out toxic or unsafe responses.",
    icon: "ShieldCheck",
  },
  {
    title: "Agentic AI Security",
    desc: "Autonomous agents with tool access pose high risks. We secure your agent execution environments by implementing strict permission boundaries, human-in-the-loop verification for critical actions, and sandboxing.",
    icon: "Bot",
  },
  {
    title: "Model Supply Chain Review",
    desc: "We perform deep vulnerability scanning for your AI artifacts. This includes scanning model files for malicious code, analyzing dependencies for known vulnerabilities, and verifying the integrity of your training datasets.",
    icon: "BarChart3",
  },
  {
    title: "Compliance & Governance",
    desc: "We help you align with emerging global AI standards. We prepare your systems for the EU AI Act, NIST AI Risk Management Framework (AI RMF), and ISO 42001, ensuring you meet regulatory requirements.",
    icon: "FileText",
  },
];

const deliverables = [
  {
    title: "Threat Modeling",
    desc: "We analyze your specific AI use case to identify unique attack surfaces, from data ingestion to model output.",
    icon: "Search",
  },
  {
    title: "Architecture Review",
    desc: "We assess your RAG pipelines, vector stores, and API integrations for design flaws and access control issues.",
    icon: "FileCode",
  },
  {
    title: "Adversarial Testing",
    desc: "Our red team executes targeted campaigns using automated fuzzing and manual expertise to bypass your guardrails.",
    icon: "Bug",
  },
  {
    title: "Remediation & Hardening",
    desc: "We provide code-level fixes, prompt engineering adjustments, and architectural changes to close security gaps.",
    icon: "GitBranch",
  },
];

const aiCaseStudies: CaseStudy[] = [
  {
    id: 1,
    heading: "Prompt Injection Attack Prevented",
    quote:
      "ZecurX\'s red team bypassed our chatbot\'s safety filters using multi-step DAN attacks. They then helped us implement NeMo Guardrails that blocked 99.7% of adversarial inputs.",
    name: "Meera Iyer",
    role: "AI Product Manager, EdTech",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop",
    icon: "Brain",
    metrics: [
      {
        value: "99.7%",
        label: "Attacks Blocked",
        sub: "Post-guardrails implementation",
      },
      {
        value: "15",
        label: "Jailbreaks Found",
        sub: "During red team exercise",
      },
    ],
  },
  {
    id: 2,
    heading: "RAG Data Isolation Enforced",
    quote:
      "Our RAG pipeline was leaking documents across tenant boundaries. ZecurX redesigned our vector DB access layer with proper RBAC, preventing cross-tenant data exposure.",
    name: "Karthik Rajan",
    role: "CTO, Legal AI Startup",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=800&fit=crop",
    icon: "ShieldAlert",
    metrics: [
      { value: "0", label: "Data Leaks", sub: "Post-remediation" },
      {
        value: "3x",
        label: "Faster Compliance",
        sub: "For enterprise onboarding",
      },
    ],
  },
];

const stats = [
  {
    value: "10k+",
    label: "Prompts Tested",
  },
  {
    value: "0",
    label: "Data Leaks",
  },
  {
    value: "24/7",
    label: "Agent Monitoring",
  },
];

export default function SecureAIDevelopmentPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <SecureAiHero />

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
                How We <span className="text-[#4a6ffa]">Secure</span> AI
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Comprehensive coverage across your AI applications from dataset generation to agentic pipelines.
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
                Methodology
              </span>
              <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                How We <span className="text-[#4a6ffa]">Test</span>
              </h2>
              <p className="text-slate-600 font-inter text-lg">
                Our approach to adversarial simulation and remediation for LLMs.
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
            subtitle="See how our AI security assessments have helped teams ship secure code faster."
            studies={aiCaseStudies}
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
                  Ready to secure your <span className="text-[#4a6ffa]">AI Models</span>?
                </h2>
                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                  Get a security assessment tailored to your tech stack. Fast
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