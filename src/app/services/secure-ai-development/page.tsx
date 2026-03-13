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

const challenges = [
  {
    title: "Prompt Injection & Jailbreaks",
    desc: "LLMs are susceptible to adversarial inputs that can bypass safety filters and hijack model behavior. Attackers can use techniques like 'DAN' (Do Anything Now), role-playing attacks, or foreign language encoding to force the model to generate harmful content, execute unauthorized commands, or reveal its system instructions.",
    icon: "AlertTriangle",
    span: 3,
  },
  {
    title: "Data Leakage & Privacy",
    desc: "Generative AI models can inadvertently memorize and regurgitate sensitive information found in their training data or context window. This creates a significant risk of PII exposure, leakage of trade secrets, or accidental disclosure of proprietary codebases.",
    icon: "Unlock",
    span: 3,
  },
  {
    title: "Supply Chain Vulnerabilities",
    desc: "Modern AI stacks rely heavily on open-source models (Hugging Face), vector databases, and orchestration frameworks (LangChain). Malicious actors can poison these dependencies, inject backdoors into model weights, or exploit vulnerabilities in third-party plugins.",
    icon: "Link",
    span: 3,
  },
  {
    title: "Non-Deterministic Output & Hallucinations",
    desc: "Unlike traditional deterministic software, AI behavior is probabilistic. Models can confidently generate false information (hallucinations) or behave inconsistently under load. Ensuring consistent, safe, and reliable outputs requires a new paradigm of testing.",
    icon: "Dice5",
    span: 3,
  },
];

const capabilities = [
  {
    title: "AI Red Teaming",
    desc: "We conduct adversarial simulation to stress-test your models against real-world attacks. Our team attempts advanced prompt injections, jailbreaks, and extraction attacks to find weaknesses before you deploy.",
    icon: "Target",
    span: 6,
    variant: "highlight",
  },
  {
    title: "Secure RAG Architecture",
    desc: "We design and review Retrieval-Augmented Generation systems to prevent unauthorized data access. We ensure your vector databases and retrieval logic implement strict access controls (RBAC) so users only retrieve documents they are authorized to see.",
    icon: "Building",
    span: 3,
  },
  {
    title: "LLM Guardrails Implementation",
    desc: "We develop robust input/output filtering layers to sanitize interactions. Using frameworks like NeMo Guardrails or custom classifiers, we block malicious prompts before they reach your model and filter out toxic or unsafe responses.",
    icon: "ShieldCheck",
    span: 3,
  },
  {
    title: "Agentic AI Security",
    desc: "Autonomous agents with tool access pose high risks. We secure your agent execution environments by implementing strict permission boundaries, human-in-the-loop verification for critical actions, and sandboxing.",
    icon: "Bot",
    span: 2,
  },
  {
    title: "Model Supply Chain Review",
    desc: "We perform deep vulnerability scanning for your AI artifacts. This includes scanning model files for malicious code, analyzing dependencies for known vulnerabilities, and verifying the integrity of your training datasets.",
    icon: "BarChart3",
    span: 2,
  },
  {
    title: "Compliance & Governance",
    desc: "We help you align with emerging global AI standards. We prepare your systems for the EU AI Act, NIST AI Risk Management Framework (AI RMF), and ISO 42001, ensuring you meet regulatory requirements.",
    icon: "FileText",
    span: 2,
  },
];

const methodology = [
  {
    step: "01",
    title: "Threat Modeling",
    desc: "We analyze your specific AI use case to identify unique attack surfaces, from data ingestion to model output.",
  },
  {
    step: "02",
    title: "Architecture Review",
    desc: "We assess your RAG pipelines, vector stores, and API integrations for design flaws and access control issues.",
  },
  {
    step: "03",
    title: "Adversarial Testing",
    desc: "Our red team executes targeted campaigns using automated fuzzing and manual expertise to bypass your guardrails.",
  },
  {
    step: "04",
    title: "Remediation & Hardening",
    desc: "We provide code-level fixes, prompt engineering adjustments, and architectural changes to close security gaps.",
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
  {
    id: 3,
    heading: "AI Agent Safety Boundaries Set",
    quote:
      "Our autonomous agent had unrestricted tool access. ZecurX implemented sandboxing and human-in-the-loop verification that prevented the agent from executing destructive operations.",
    name: "Neha Kulkarni",
    role: "Head of Engineering, Automation Co.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=800&fit=crop",
    icon: "Bot",
    metrics: [
      {
        value: "100%",
        label: "Critical Actions Gated",
        sub: "Human-in-the-loop",
      },
      {
        value: "5",
        label: "Escape Paths Closed",
        sub: "Agent sandbox hardened",
      },
    ],
  },
];

export default function SecureAIDevelopmentPage() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />
        <div className="absolute top-10 right-1/3 w-[500px] h-[500px] bg-foreground/[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <FadeUp delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
                    <HeroWords>Build & Secure</HeroWords>
                  </span>
                </div>
              </FadeUp>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                <HeroWords delay={heroEnd(2)}>Secure AI </HeroWords>
                <HeroWords delay={heroEnd(4)}>
                  <span className="text-muted-foreground">Development</span>
                </HeroWords>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                <HeroWords delay={heroEnd(5)}>
                  Ship AI with confidence. We help you build, test, and deploy
                  secure LLM applications, protecting against prompt injection,
                  data leakage, and model theft.
                </HeroWords>
              </p>

              <div
                className="flex flex-wrap gap-4 opacity-0"
                style={{
                  animation: "word-appear 0.5s ease-out forwards",
                  animationDelay: `${heroEnd(30)}ms`,
                }}
              >
                <Link
                  href="/contact"
                  className="group px-7 py-3.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  Build With Us
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
                    src={`${process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com"}/images/services/secure-ai-development.png`}
                    alt="Secure AI Development illustration"
                    width={400}
                    height={400}
                    className="w-56 h-56 md:w-72 md:h-72 relative z-10 dark:invert dark:hue-rotate-180 drop-shadow-lg"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEjUExURarB6qnA6qi/6aa96KS756K65p+35Z215Juz45yz4azD66vC66rB6qi/6aa96KO756G55p635py15Zqz467E7K3D66vC66nA6qe/6aW96KO76KC555y15q7F7K3E7KzD66rB6qjA6qa+6aS86aK76KC56J64567F7K7E7K3D66vC66nA6qe/6qW96qO86aK76aC66a3E663E66zD66e/6qa+6qS96qO86qK86qvC6qvC6qvC6qrB6qjA6qe/6qa+6qW+6qS966O966O65qS856W86KW96KW96aS96aS96qO96qO86qO865215J+35aG55qK65qK656K76KK76aK76qG76v////weOJ4AAABgdFJOUwECBAUGBgUDAgEDBQgLDQwKBwQCBQkPFBYVEQsDBw0VHB8dFxAJBAgQGSElIxwTCwUIEBkiGxIKBQcNFRseHRcPCQQJDhMVFBALBgMCBQgLDAwJBgMCAQIEBQYGBQMCASNkQKEAAAABYktHRGDFt3wQAAAAB3RJTUUH6gIWCxcb9wpr/AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wMi0yMlQxMToyMzoxOCswMDowMFXC++8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDItMjJUMTE6MjM6MTgrMDA6MDAkn0NTAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTAyLTIyVDExOjIzOjI3KzAwOjAwC00VhgAAAHZJREFUCNdjYGBkYmZhZWPn4GTg4ubh5eMXEBQSZhARFROXkJSSlpFlkJNXUFRSVlFVU2fQ0NTS1tHV0zcwZDAyNjE1M7ewtLJmsLG1s3dwdHJ2cWVwc/fw9PL28fXzZwgIDAoOCQ0Lj4hkiIqOiY2LT0hMSgYAwk8TV/GBfx8AAAAASUVORK5CYII="
                  />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHY AI SECURITY IS DIFFERENT ─────────────────────── */}
      <div className="border-y border-border/30 bg-muted/5 relative">
        <ServiceBentoFeatures
          label="The Challenge"
          title="Why AI Security"
          titleAccent="Is Different"
          subtitle="Traditional application security isn't enough. Generative AI introduces probabilistic risks that standard firewalls and scanners miss."
          items={challenges as any}
        />
      </div>

      {/* ── OUR CAPABILITIES ─────────────────────────────────── */}
      {/* ── OUR CAPABILITIES (BENTO GRID) ────────────────────── */}
      <ServiceBentoFeatures
        label="Capabilities"
        title="Our AI Security"
        titleAccent="Capabilities"
        subtitle="From red teaming foundation models to securing RAG pipelines, we cover the entire AI lifecycle."
        items={capabilities as any}
      />

      {/* ── METHODOLOGY / HOW WE SECURE YOUR AI ──────────────── */}
      <section className="py-20 md:py-32 px-6 bg-muted/5 border-y border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <FadeUpScroll>
                <div className="lg:sticky lg:top-32">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">
                    Methodology
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                    How We Secure{" "}
                    <span className="text-muted-foreground">Your AI</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    A structured, risk-based approach to AI adoption. We move
                    from threat modeling to continuous monitoring.
                  </p>
                  <div className="hidden lg:block w-12 h-0.5 bg-foreground/20" />
                </div>
              </FadeUpScroll>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-5">
                {methodology.map((item, i) => (
                  <FadeUpScroll key={i} delay={i * 0.08}>
                    <div className="group relative p-6 md:p-8 rounded-2xl border border-border/50 bg-background hover:border-foreground/20 transition-all duration-300">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                          <span className="text-sm font-bold font-mono text-foreground/60">
                            {item.step}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-[15px]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
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
        title="AI security wins"
        subtitle="How we helped teams ship secure LLM applications with confidence."
        studies={aiCaseStudies}
      />

      {/* ── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <ScaleInScroll>
            <div className="relative p-8 md:p-14 rounded-3xl border border-border/40 bg-card/20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  Building with LLMs?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                  Don&apos;t let security block your innovation. Let us help you
                  ship secure AI applications faster.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Start Your AI Assessment
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
