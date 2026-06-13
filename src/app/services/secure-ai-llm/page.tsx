import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Brain, Shield, Database, Eye, Lock, Activity } from "lucide-react";
import { SecureAILLMHero } from "./secure-ai-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Secure AI & LLM Security | ZecurX",
  description:
    "India's most comprehensive enterprise AI security practice — combining deep machine learning expertise with adversarial security research to protect the models, agents, pipelines, and data that power your AI-enabled business.",
  keywords: [
    "LLM security",
    "AI security",
    "prompt injection",
    "AI red team",
    "OWASP LLM Top 10",
    "MITRE ATLAS",
    "AI agent security",
    "RAG security",
    "data poisoning",
    "AI threat modelling",
  ],
  openGraph: {
    title: "Secure AI & LLM Security | ZecurX",
    description:
      "India's most comprehensive enterprise AI security practice — adversarial testing for models, agents, pipelines, and data.",
    type: "website",
    url: "https://zecurx.com/services/secure-ai-llm",
  },
  alternates: {
    canonical: "https://zecurx.com/services/secure-ai-llm",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "LLM Penetration Testing",
    desc: "Adversarial testing of large language models and GenAI applications — prompt injection, jailbreak campaigns, model extraction, and output manipulation, executed by AI security researchers. Full OWASP LLM Top 10 coverage with MITRE ATLAS technique attribution and CVSS-equivalent severity scoring.",
    icon: "Brain",
  },
  {
    title: "Data Poisoning Defense",
    desc: "Training pipeline integrity validation, RAG data source auditing, and embedding attack detection. Covers vector database security for ChromaDB, Pinecone, Weaviate, Qdrant, and pgvector — protecting the data that shapes how your AI thinks.",
    icon: "Database",
  },
  {
    title: "AI Agent Security Audit",
    desc: "Autonomous agent threat modelling, tool-use sandboxing, privilege escalation testing, and human-in-the-loop bypass assessment. Full attack surface mapping for every tool, API, data source, and external system reachable by your agent.",
    icon: "Activity",
  },
  {
    title: "Model Access Control",
    desc: "Authorisation layer design, rate limiting, abuse prevention, and anomaly detection for AI APIs. Multi-tenant isolation review, cost abuse prevention, API key management, and audit logging — the infrastructure security layer between your model and the world.",
    icon: "Lock",
  },
  {
    title: "AI Threat Modelling",
    desc: "STRIDE and MITRE ATLAS framework application for GenAI products and intelligent systems. Attack tree construction, RAG and agentic architecture threat modelling, regulatory risk mapping, and security requirement derivation — before a line of AI code reaches production.",
    icon: "Eye",
  },
  {
    title: "AI Output Monitoring",
    desc: "Real-time detection of abuse, policy violations, prompt injection, and behavioural drift in deployed AI model outputs. PII leakage detection, hallucination monitoring, abuse pattern analytics, and SOC integration — continuous assurance that your AI is doing what it is supposed to do.",
    icon: "Shield",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "OWASP LLM Top 10 Findings Report",
    desc: "CVSS-equivalent scored findings mapped to OWASP LLM Application Security Top 10 vulnerability classes, with MITRE ATLAS technique attribution, proof-of-concept evidence, and remediation guidance specific to LLM architectures — not generic security recommendations.",
    icon: "FileText",
  },
  {
    title: "Executive AI Risk Dashboard",
    desc: "Board-ready AI risk summary with attack surface overview, severity distribution, benchmark comparison against OWASP LLM Top 10, and SLA-linked remediation timelines — for CISO reporting, investor due diligence, and AI governance review.",
    icon: "BarChart",
  },
  {
    title: "AI Threat Model Document",
    desc: "Living STRIDE + ATLAS threat model in structured format — suitable for regulatory inspection, investor due diligence, ISO 42001 certification preparation, and engineering team security reference throughout the AI product lifecycle.",
    icon: "GitBranch",
  },
  {
    title: "Regulatory Compliance Mapping",
    desc: "Findings mapped to EU AI Act risk classifications, NIST AI RMF, ISO 42001, OWASP LLM Top 10, DPDPA 2023, SEBI/RBI AI guidance, and IRDAI AI circular — ready for regulators, auditors, and enterprise procurement reviews.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "72%",
    label: "Of enterprises now deploy GenAI in at least one business function",
    sub: "McKinsey 2024",
  },
  {
    value: "100%",
    label: "Of OWASP LLM Top 10 vulnerability classes covered by ZecurX methodology",
    sub: "Complete coverage",
  },
  {
    value: "6 Services",
    label: "Specialised AI and LLM security capabilities — from model to output",
    sub: "One integrated practice",
  },
  {
    value: "MITRE ATLAS",
    label: "Aligned to the industry's definitive AI adversarial threat framework",
    sub: "Every engagement mapped",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "3 Critical LLM Vulnerabilities Found Before 4.2M Policyholders Were Exposed",
    quote:
      "ZecurX's LLM penetration test identified three critical vulnerabilities: a system prompt extraction attack that revealed the chatbot's internal configuration including the claims decision logic, an indirect prompt injection via policy document uploads that caused the model to provide incorrect claim settlement guidance, and a jailbreak path that enabled the chatbot to provide specific medical and legal advice in violation of IRDAI regulations. All three were remediated before the issues were discovered externally.",
    name: "Head of Digital Products",
    role: "Major Indian Insurance Company (4.2M Policyholders)",
    icon: Brain,
    lottie: getCdnUrl("lottie/llm_pentest.json"),
    metrics: [
      { value: "3", label: "Critical Vulnerabilities", sub: "Found pre-launch" },
      { value: "IRDAI", label: "Compliance Risk Averted", sub: "Formal investigation prevented" },
    ],
  },
  {
    id: 2,
    heading: "Poisoned Legal Research Assistant — Incorrect Citations Undetectable to Attorneys",
    quote:
      "A simulated adversarial test demonstrated that a planted document containing subtly incorrect legal precedent citations caused the RAG system to incorporate the incorrect citations in subsequent legal research queries with a confidence that would have been indistinguishable from accurate results. The firm immediately implemented document ingestion controls, mandatory human review for new sources, and embedding-layer anomaly detection.",
    name: "Chief Information Security Officer",
    role: "Global Law Firm (2.3M Internal Documents, RAG-based Legal Assistant)",
    icon: Database,
    lottie: getCdnUrl("lottie/data_poisoning.json"),
    metrics: [
      { value: "2.3M", label: "Documents in RAG Corpus", sub: "No ingestion validation" },
      { value: "0", label: "Contributor Identity Checks", sub: "Before ZecurX engagement" },
    ],
  },
  {
    id: 3,
    heading: "AI Agent Bypassed ₹10,000 Refund Limit via Indirect Prompt Injection",
    quote:
      "A crafted customer complaint containing embedded instructions caused the agent to initiate a refund for an amount exceeding the ₹10,000 limit by misclassifying the transaction type, bypassing the limit check. A second finding demonstrated that the agent could be caused to reveal the full account details of any customer if the requesting customer's complaint included a specific social engineering phrase that triggered a context confusion in the model.",
    name: "VP Engineering",
    role: "FinTech Company (AI Agent integrated with Customer Support CRM)",
    icon: Activity,
    lottie: getCdnUrl("lottie/agent_security.json"),
    metrics: [
      { value: "2", label: "Critical Agent Findings", sub: "Privilege escalation + data leak" },
      { value: "₹10K", label: "Limit Bypassed", sub: "Via indirect prompt injection" },
    ],
  },
  {
    id: 4,
    heading: "Behavioural Drift Detected in 4 Hours — Unlicensed Investment Advice Averted",
    quote:
      "Six weeks after launch, ZecurX's AI Output Monitoring system detected a statistically significant increase in outputs containing specific phrases associated with direct investment advice — a regulated activity the platform was not licensed to provide through AI. Investigation revealed that a change in the system prompt introduced during a product iteration had inadvertently removed a key constraint on the model's advisory scope. Without the monitoring system, the regulatory exposure would have compounded for weeks before discovery.",
    name: "Head of AI Products",
    role: "Wealth Management Platform (180,000 Retail Investors)",
    icon: Eye,
    lottie: getCdnUrl("lottie/ai_monitoring.json"),
    metrics: [
      { value: "4 hrs", label: "Drift Detection Time", sub: "From deployment to alert" },
      { value: "180K", label: "Investors Protected", sub: "From unlicensed AI advice" },
    ],
  },
];

// ── METHODOLOGY STEPS ─────────────────────────────────────────────────────────

const methodologySteps = [
  {
    title: "Architecture Review",
    desc: "Map AI system components, data flows, trust boundaries, and external integrations.",
  },
  {
    title: "Threat Modelling",
    desc: "STRIDE + MITRE ATLAS analysis — adversarial ML technique mapping to your specific architecture.",
  },
  {
    title: "Adversarial Testing",
    desc: "LLM red-teaming, prompt injection campaigns, agent exploitation, and data poisoning simulation.",
  },
  {
    title: "Access & Control",
    desc: "API authorisation review, multi-tenant isolation, rate limiting, and abuse pattern testing.",
  },
  {
    title: "Pipeline Security",
    desc: "Training data integrity, RAG source audit, vector DB review, and model supply chain.",
  },
  {
    title: "Runtime Monitoring",
    desc: "Output policy enforcement, drift detection, and continuous behavioural assurance deployment.",
  },
];

// ── TOOLING COVERAGE ──────────────────────────────────────────────────────────

const toolingGroups = [
  {
    title: "LLM Providers & Models",
    items: [
      "OpenAI GPT-4o, GPT-4 Turbo, GPT-3.5",
      "Anthropic Claude 3 (Opus, Sonnet, Haiku)",
      "Google Gemini Pro, Gemini Ultra, PaLM 2",
      "Meta LLaMA 2 / LLaMA 3 (self-hosted)",
      "Mistral, Mixtral, and open-source fine-tuned variants",
      "Azure OpenAI Service and AWS Bedrock",
    ],
  },
  {
    title: "AI Frameworks & Infrastructure",
    items: [
      "LangChain and LlamaIndex (RAG/agent frameworks)",
      "AutoGPT, CrewAI, and AutoGen (agent frameworks)",
      "Hugging Face Transformers and Inference API",
      "ChromaDB, Pinecone, Weaviate, Qdrant, pgvector",
      "MLflow, Weights & Biases (MLOps platforms)",
      "Vertex AI, Azure AI Studio, AWS SageMaker",
    ],
  },
  {
    title: "Deployment Patterns",
    items: [
      "Customer-facing chatbot and virtual assistant deployments",
      "Internal RAG knowledge base and document Q&A systems",
      "AI coding assistants (GitHub Copilot, Cursor, CodeWhisperer)",
      "Multi-agent pipeline and workflow automation systems",
    ],
  },
];

// ── FRAMEWORKS ────────────────────────────────────────────────────────────────

const technicalFrameworks = [
  "OWASP LLM Application Security Top 10 (2025 edition) — complete vulnerability class coverage",
  "MITRE ATLAS (Adversarial Threat Landscape for AI Systems) — full technique matrix alignment",
  "NIST AI Risk Management Framework (AI RMF 1.0) — Govern, Map, Measure, Manage functions",
  "ISO/IEC 42001:2023 — AI Management System standard (certification-aligned engagements)",
  "NIST SP 800-218A — Secure Software Development Practices for AI and ML",
  "Google SAIF (Secure AI Framework) — six core elements mapped to ZecurX service coverage",
];

const regulatoryFrameworks = [
  "EU Artificial Intelligence Act (AIA) — risk classification, conformity assessment, and high-risk AI system requirements",
  "India Digital India Act (DIA) — AI governance provisions and digital intermediary obligations",
  "SEBI Circular on AI/ML — algorithmic trading and robo-advisory security requirements",
  "RBI Guidelines on AI/ML in Financial Services — model risk management and explainability",
  "DPDPA 2023 — AI system personal data processing, automated decision-making provisions",
  "IRDAI Circular on Use of AI — insurance sector AI deployment approval and audit requirements",
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function SecureAILLMPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <SecureAILLMHero />

        {/* ── STATS BAR ─────────────────────────────────────────── */}
        <section className="py-12 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold font-manrope text-[##4c69e4] mb-1">
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  AI Security at the{" "}
                  <span className="text-[#4c69e4]">Intersection of ML and Adversarial Research</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "AI-Native Security Research",
                  desc: "Our AI security practice is staffed by engineers who understand transformer architectures, fine-tuning pipelines, and embedding models from first principles — not security generalists who have read a prompt injection blog post. We test AI systems the way ML engineers build them: with deep knowledge of the internals.",
                },
                {
                  title: "OWASP LLM Top 10 Coverage",
                  desc: "Our LLM security testing methodology provides complete coverage of the OWASP LLM Application Security Top 10 — the definitive framework for GenAI vulnerability classification.Every engagement produces findings mapped to this standard, enabling direct comparison against industry benchmarks and regulatory expectations.",
                },
                {
                  title: "MITRE ATLAS Framework",
                  desc: "We apply the MITRE ATLAS (Adversarial Threat Landscape for AI Systems) framework to every engagement — the AI security equivalent of the ATT&CK framework for traditional cyber threats. Every attack technique we test is mapped to ATLAS, giving your security team a common language for AI threat communication.",
                },
                {
                  title: "Regulation-Aware Practice",
                  desc: "AI regulation is arriving fast — the EU AI Act is in force, India's Digital India Act includes AI governance provisions, and SEBI and RBI are both issuing AI-specific guidance for regulated industries. ZecurX AI security engagements are structured to produce evidence of compliance with emerging AI governance requirements.",
                },
              ].map((item, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-manrope font-bold text-[#0c0a1e] text-lg">
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  Six Specialised <span className="text-[#4c69e4]">AI Security Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From model red-teaming to real-time output monitoring — one integrated AI security practice.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── METHODOLOGY ─────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">AI Security Methodology</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  A structured approach purpose-built for the unique threat landscape of AI and LLM systems.
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
                    <h3 className="font-manrope font-bold text-[#0c0a1e] text-sm">{step.title}</h3>
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  What You <span className="text-[#4c69e4]">Receive</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Actionable, evidence-backed outputs — mapped to the frameworks your regulators expect.
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  Proven AI security <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our AI and LLM security engagements have caught critical vulnerabilities
                  before they became incidents — or regulatory findings.
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
                            <h3 className="font-manrope font-bold text-[#0c0a1e] text-xl leading-snug">
                              {study.heading}
                            </h3>
                          </div>

                          <blockquote className="relative pl-5 border-l-2 border-[#4c69e4]/30">
                            <p className="text-slate-600 font-inter text-[15px] leading-relaxed italic">
                              "{study.quote}"
                            </p>
                            <footer className="mt-3 text-sm font-inter">
                              <span className="font-semibold text-[#0c0a1e]">{study.name}</span>
                              <span className="text-slate-400 ml-2">— {study.role}</span>
                            </footer>
                          </blockquote>

                          <div className="flex flex-wrap gap-4 pt-2">
                            {study.metrics.map((m, mi) => (
                              <div
                                key={mi}
                                className="flex flex-col gap-0.5 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200"
                              >
                                <span className="font-manrope font-bold text-[#0c0a1e] text-xl">
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
                  Platform Coverage
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  Native Expertise Across the{" "}
                  <span className="text-[#4c69e4]">AI Ecosystem</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Deep testing capability across every major LLM provider, AI framework, and deployment pattern.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {toolingGroups.map((group, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <h3 className="font-manrope font-bold text-[#0c0a1e] text-lg">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  Regulatory <span className="text-[#4c69e4]">Alignment</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Every AI security engagement aligned to the frameworks your regulators and auditors require.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlurFade delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="font-manrope font-bold text-[#0c0a1e] text-xl">
                      Technical AI Security Standards
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {technicalFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#4c69e4] mt-1 shrink-0">➤</span>
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
                    <h3 className="font-manrope font-bold text-[#0c0a1e] text-xl">
                      Regulatory & Governance Frameworks
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {regulatoryFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#4c69e4] mt-1 shrink-0">➤</span>
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
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c0a1e]">
                  Structured for{" "}
                  <span className="text-[#4c69e4]">AI Deployment Velocity</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From pre-launch red-teaming to continuous production monitoring — matched to your AI maturity.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Pre-Launch AI Red Team",
                  desc: "Intensive adversarial testing engagement conducted before an AI system goes live — covering LLM penetration testing, agent security audit, access control review, and data poisoning assessment. Fixed scope, fixed timeline. Deliverable: comprehensive findings report with OWASP LLM Top 10 and MITRE ATLAS mapping. Typical duration: 3–6 weeks.",
                },
                {
                  title: "AI Threat Model & Architecture Review",
                  desc: "Design-phase security engagement — ZecurX reviews your AI system architecture before development begins, produces a formal STRIDE + ATLAS threat model, and derives security requirements for the engineering team. Most cost-effective intervention point. Deliverable: living threat model document and security requirements specification. Typical duration: 2–3 weeks.",
                },
                {
                  title: "Continuous AI Monitoring",
                  desc: "Ongoing production AI monitoring — ZecurX deploys and operates the output monitoring pipeline, drift detection, and abuse analytics for your AI system. Monthly reporting on detected threats, policy violations, and behavioural trends. Priced per model deployment. Ideal for regulated industries and high-volume customer-facing AI products.",
                },
                {
                  title: "AI Security Retainer",
                  desc: "Dedicated AI security partner — quarterly red team exercises, architecture review for new AI features, continuous monitoring operation, and on-demand threat modelling. For AI-first businesses and enterprises with multiple AI deployments. Includes regulatory advisory as AI governance requirements evolve. Most comprehensive option.",
                },
              ].map((model, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-manrope font-bold text-[#0c0a1e] text-lg">
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
              <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4c69e4]/20 bg-gradient-to-br from-[#faf8ff] to-violet-50/50 shadow-[0_20px_60px_rgba(76,105,228,0.08)] overflow-hidden text-center">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4c69e410_1px,transparent_1px),linear-gradient(to_bottom,#4c69e410_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c0a1e] mb-4">
                    Your AI is already deployed.{" "}
                    <span className="text-[#4c69e4]">Is it already secured?</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-4 max-w-xl mx-auto text-lg leading-relaxed">
                    Request a complimentary AI Security Exposure Assessment — a 45-minute consultation
                    with a ZecurX AI security researcher who will map your AI attack surface, identify
                    the highest-risk vulnerabilities in your current deployment, and outline what
                    adversarial testing would reveal. Zero cost. Zero obligation. Complete clarity.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-500 font-inter mb-10">

                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#c4b5fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#c4b5fd] transition-all duration-200"
                    >
                      Get AI Exposure Assessment
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c0a1e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
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