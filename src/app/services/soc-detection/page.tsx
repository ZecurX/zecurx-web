"use client";

import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  ArrowRight,
  Shield,
  AlertTriangle,
  Search,
  BarChart2,
  Microscope,
  Globe,
  FileText,
  BarChart,
  GitBranch,
  Award,
  CheckCircle2,
  XCircle,
  UserCheck,
  FileSignature,
  Landmark,
  Workflow,
  LineChart,
  TerminalSquare,
  Fingerprint,
  ShieldCheck,
  GlobeLock,
  AlertCircle,
  FileCode2,
  Radar,
  Crosshair,
  Network,
  Users,
} from "lucide-react";
import Link from "next/link";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { SOCDetectionHero } from "./soc-detection-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { getCdnUrl } from "@/lib/cdn";
import { useState, useEffect, useRef } from "react";

// ── DATA ARRAYS (STRICT CONTENT ADHERENCE) ───────────────────────────────────

const capabilities = [
  {
    title: "Managed SOC (vSOC)",
    desc: "Your dedicated Security Operations Centre — real analysts, real triage, real containment. 24/7/365 monitoring across endpoints, networks, cloud workloads, SaaS applications, and identity platforms. Custom detection rules tuned to your environment, 70–90% alert fatigue reduction in the first 90 days, and CERT-In/RBI/SEBI compliance reporting packages delivered on demand.",
    icon: "Shield",
  },
  {
    title: "Incident Response Retainer",
    desc: "Pre-arranged breach response capability with contractually guaranteed 15-minute first response — 24/7/365. Remote triage activation within 15 minutes; on-site deployment to any Indian metro within 4–6 hours. Covers ransomware specialisation, CERT-In 6-hour notification support, forensic evidence preservation with legal chain-of-custody, and post-incident hardening roadmap.",
    icon: "AlertTriangle",
  },
  {
    title: "Threat Hunting",
    desc: "Proactive adversary detection across endpoints, cloud workloads, and log pipelines — finding attackers your automated systems have already missed. Hypothesis-driven hunts built on MITRE ATT&CK, covering APT detection, Active Directory abuse, LOLBin misuse, dark web credential monitoring, and cloud workload anomalies. Hunt findings are converted into permanent SIEM detection rules.",
    icon: "Search",
  },
  {
    title: "SIEM Deployment & Tuning",
    desc: "End-to-end SIEM deployment and ongoing engineering for Splunk Enterprise, Splunk Cloud, Microsoft Sentinel, and Elastic Security. Custom correlation rule development, UEBA configuration, SOAR integration, and alert fatigue remediation — typical clients see 70–99% effective alert volume reduction while detection quality improves. Compliance use cases for PCI-DSS, RBI, SEBI, and CERT-In included.",
    icon: "BarChart2",
  },
  {
    title: "Digital Forensics",
    desc: "Post-incident memory, disk, and network artifact analysis with legal-grade evidence handling. Covers memory forensics (Volatility 3), disk forensics (FTK/Autopsy), PCAP analysis, cloud forensics (AWS/Azure/GCP), mobile device forensics, malware reverse engineering, and expert witness capability for Indian courts and international arbitration. Hash-verified chain-of-custody from acquisition to legal resolution.",
    icon: "Microscope",
  },
  {
    title: "Threat Intelligence",
    desc: "Dark web monitoring, IOC feed management via STIX/TAXII, adversary profiling, brand impersonation detection with active takedown service, and executive protection intelligence — 24/7. Industry-specific weekly threat briefings for BFSI, Healthcare, Manufacturing, IT/ITeS, Government, and E-Commerce. Monthly executive intelligence summary and quarterly strategic threat assessment for CISO and board.",
    icon: "Globe",
  },
];

const deliverables = [
  {
    title: "Onboarding & Detection Baseline Package",
    desc: "Completed in 14 days: asset inventory, log source connections, behavioural baseline establishment, and initial detection rule deployment tuned to your environment. Includes SIEM-agnostic log ingestion setup, escalation playbooks co-developed with your internal team, and initial threat landscape assessment for your industry and geography.",
    icon: "FileText",
  },
  {
    title: "Weekly Operational Dashboard & Monthly Executive Report",
    desc: "Weekly operational dashboards for your security team — alert volumes, detection rule performance, incidents by severity, and open investigations. Monthly executive security posture report in plain business language for your CISO, CTO, and board — with trend analysis, significant incidents, and strategic risk posture assessment.",
    icon: "BarChart",
  },
  {
    title: "Compliance Reporting Package",
    desc: "Audit-ready reports for CERT-In, RBI, SEBI, ISO 27001, SOC 2, and PCI-DSS — pre-formatted and analyst-reviewed before submission. Includes the CERT-In 6-hour incident notification draft, RBI Cyber Security Framework reporting, and SEBI CSCRF compliance evidence — covering every Indian regulatory reporting obligation your security operations generate.",
    icon: "GitBranch",
  },
  {
    title: "Incident Response & Forensics Report",
    desc: "Complete incident documentation: attack timeline reconstruction, initial access vector, lateral movement path, persistence mechanisms, data exfiltration scope, and root cause analysis. Legal-grade forensic evidence package with hash-verified chain-of-custody, malware analysis results, and 30-day prioritised post-incident hardening roadmap targeting the specific vulnerabilities exploited.",
    icon: "Award",
  },
];

const stats = [
  {
    value: "207 Days",
    label:
      "Average attacker dwell time before detection without active SOC (IBM)",
    sub: "We detect in under 15 minutes",
  },
  {
    value: "< 15 Min",
    label: "ZecurX Mean Time to Detect (MTTD) guaranteed in SLA",
    sub: "Contractual commitment",
  },
  {
    value: "6 Services",
    label: "Integrated SOC, hunting, forensics, and intelligence capabilities",
    sub: "One integrated team",
  },
  {
    value: "6 Hours",
    label: "CERT-In mandatory breach reporting window we meet it every time",
    sub: "Notification draft guaranteed",
  },
];

const caseStudies = [
  {
    id: 1,
    heading:
      "3 Active Compromises Detected in First 30 Days Cyber Insurance Premium Reduced by 22%",
    quote:
      "Within the first 30 days, our analysts detected an active brute-force campaign targeting their VPN gateway from 14 countries, a compromised vendor account accessing their ERP system outside business hours, and a workstation with an active Cobalt Strike beacon that had been present for 11 days undetected. All three were contained before any data was exfiltrated. The client's cyber insurance premium subsequently decreased by 22% at renewal due to the demonstrated 24/7 monitoring capability.",
    name: "Head of IT",
    role: "Manufacturing Group (3,200 employees across six plants, post ransomware near-miss)",
    icon: Shield,
    lottie: getCdnUrl("lottie/vsoc.json"),
    metrics: [
      {
        value: "3",
        label: "Active Compromises Detected",
        sub: "In first 30 days of monitoring",
      },
      {
        value: "22%",
        label: "Insurance Premium Reduction",
        sub: "At renewal after SOC enrolment",
      },
    ],
  },
  {
    id: 2,
    heading:
      "BlackCat Ransomware Contained in 12 Minutes Full Recovery in 38 Hours, Zero Ransom Paid",
    quote:
      "A FinTech serving 800,000 retail investors was hit by a ransomware attack deploying BlackCat/ALPHV at 11:47 PM on a Sunday. The ZecurX IR hotline was called at 11:52 PM. A senior incident commander was on a bridge call by 12:04 AM — 12 minutes after the call. By 1:30 AM, network isolation was complete. By 4:00 AM, the infection scope was fully mapped and contained. By 6:00 AM, the CERT-In notification had been drafted and was awaiting client legal review. No ransom was paid. The encrypted systems were recovered from verified clean backups. The client was fully operational within 38 hours.",
    name: "CISO",
    role: "FinTech (800,000 retail investors, BlackCat/ALPHV ransomware attack)",
    icon: AlertTriangle,
    lottie: getCdnUrl("lottie/ir_retainer.json"),
    metrics: [
      {
        value: "12 mins",
        label: "IR Commander Engaged",
        sub: "From hotline call to bridge",
      },
      { value: "38 hours", label: "Full Recovery", sub: "Zero ransom paid" },
    ],
  },
  {
    id: 3,
    heading:
      "47-Day APT Dwell Ended Before Exfiltration ₹180 Crore in Pharma R&D Data Saved",
    quote:
      "During an initial threat hunting engagement for a global pharmaceutical company with Indian R&D operations, ZecurX analysts discovered a threat actor operating under a compromised service account that had been present for 47 days. The actor had been systematically staging clinical trial data to an encrypted archive on a network share preparing for exfiltration. The account had generated no alerts in the client's SIEM because its activity patterns were superficially consistent with its legitimate function. ZecurX's hunt detected it through process lineage analysis the service account was spawning cmd.exe child processes, which was inconsistent with its defined role. The actor was ejected before exfiltration completed. The client estimated the value of the staged data at over ₹180 Crore in competitive intelligence.",
    name: "VP Information Security",
    role: "Global Pharmaceutical Company (Indian R&D operations, clinical trial data at risk)",
    icon: Search,
    lottie: getCdnUrl("lottie/threat_hunting.json"),
    metrics: [
      {
        value: "47 Days",
        label: "APT Dwell Time Ended",
        sub: "Before exfiltration completed",
      },
      {
        value: "₹180 Cr",
        label: "R&D Data Protected",
        sub: "Estimated competitive intelligence value",
      },
    ],
  },
  {
    id: 4,
    heading:
      "45,000 Daily Alerts Reduced to 290 3 Undetected Compromises Found in Week One",
    quote:
      "A 2,800-seat financial services firm was processing 45,000 Splunk alerts per day with a 3-person security team. They were investigating fewer than 200 per day meaning 44,800 alerts were dismissed unreviewed. After a ZecurX tuning engagement rewriting 340 correlation rules, implementing environment-specific suppression logic, adding UEBA behavioural baselines, and deploying automated SOAR triage daily alerts dropped to 290 high-fidelity incidents, all of which were actionable. Investigation time per alert dropped from 45 minutes to under 6 minutes. The team discovered 3 previously undetected compromises in the first week of operating the tuned system all had generated alerts under the old ruleset that had been dismissed as noise.",
    name: "Head of Cyber Defence",
    role: "Financial Services Firm (2,800 seats, 3-person security team, Splunk SIEM)",
    icon: BarChart2,
    lottie: getCdnUrl("lottie/siem.json"),
    metrics: [
      {
        value: "45K → 290",
        label: "Daily Alerts After Tuning",
        sub: "All 290 actionable",
      },
      {
        value: "3",
        label: "Prior Undetected Compromises Found",
        sub: "In week one post-tuning",
      },
    ],
  },
  {
    id: 5,
    heading:
      "Insider Exfiltration Proven Forensic Evidence Accepted by CBI, Arrest in 60 Days",
    quote:
      "A private bank's fraud investigation team suspected an insider had been exfiltrating customer KYC data over a 6-month period. ZecurX conducted a full forensic investigation across 4 suspect workstations, Exchange mail server logs, and DLP system records. Memory analysis of one workstation recovered an encryption key in active use by a custom data exfiltration tool running as a disguised Windows service. Disk forensics recovered 3,400 deleted files from the suspect's workstation including customer data exports. Network forensics traced exfiltration traffic to a personally controlled cloud storage account. The forensic report was submitted to the bank's legal team and subsequently to the CBI. The suspect was arrested within 60 days. The forensic evidence was accepted as primary evidence in the criminal filing.",
    name: "Chief Risk Officer",
    role: "Private Bank (insider KYC data exfiltration, CBI criminal proceedings)",
    icon: Microscope,
    lottie: getCdnUrl("lottie/forensics.json"),
    metrics: [
      {
        value: "3,400",
        label: "Deleted Files Recovered",
        sub: "Including customer data exports",
      },
      {
        value: "60 days",
        label: "To Arrest",
        sub: "Forensics accepted as primary evidence",
      },
    ],
  },
  {
    id: 6,
    heading:
      "Phishing Domain Taken Down in 31 Hours 50,000+ Banking Customers Protected",
    quote:
      "A private sector bank's fraud team received a ZecurX Threat Intelligence alert at 9:14 AM: a newly registered domain (b4nk-client-name.com) was observed in a criminal Telegram channel with a phishing kit targeting the bank's retail internet banking customers complete with cloned login page and SMS OTP capture capability. The domain had been registered 6 hours earlier. ZecurX initiated takedown procedures immediately. The domain was suspended within 31 hours of initial registration before it had been indexed by major search engines or distributed widely to potential victims. The bank's fraud team estimated the phishing campaign, had it reached its intended audience, would have exposed 50,000+ customers to credential theft. Zero customers were defrauded.",
    name: "Head of Fraud & Cyber Intelligence",
    role: "Private Sector Bank (retail internet banking, brand impersonation threat)",
    icon: Globe,
    lottie: getCdnUrl("lottie/threat_intel.json"),
    metrics: [
      {
        value: "31 Hours",
        label: "Phishing Domain Suspended",
        sub: "From initial registration",
      },
      { value: "50,000+", label: "Customers Protected", sub: "Zero defrauded" },
    ],
  },
];

const socSteps = [
  {
    id: "01",
    code: "Detect",
    title: "Identify",
    desc: "Automated correlation rules and AI-assisted anomaly detection generate candidate alerts.",
    icon: FileCode2,
    className: "step1",
  },
  {
    id: "02",
    code: "Triage",
    title: "Verify",
    desc: "Human analyst reviews, enriches with TI context, asset data, and user behaviour.",
    icon: Radar,
    className: "step2",
  },
  {
    id: "03",
    code: "Investigate",
    title: "Analyze",
    desc: "Confirmed incidents investigated for scope, lateral movement, and persistence.",
    icon: Crosshair,
    className: "step3",
  },
  {
    id: "04",
    code: "Contain",
    title: "Mitigate",
    desc: "Active containment: isolation, account suspension, firewall block, EDR quarantine.",
    icon: Network,
    className: "step4",
  },
  {
    id: "05",
    code: "Hunt",
    title: "Proactive",
    desc: "Hypothesis-driven hunting to determine if threat is part of a broader campaign.",
    icon: FileText,
    className: "step5",
  },
  {
    id: "06",
    code: "Improve",
    title: "Optimize",
    desc: "Every incident updates detection rules, playbooks, and baseline models.",
    icon: ShieldCheck,
    className: "step6",
  },
];

const toolingGroups = [
  {
    icon: "📊",
    title: "SIEM Platforms",
    items: [
      "Splunk Enterprise & Splunk Cloud",
      "Microsoft Sentinel (Azure)",
      "Elastic Security / OpenSearch",
      "IBM QRadar SIEM",
      "Securonix and LogRhythm",
      "ArcSight Enterprise Security Manager",
    ],
  },
  {
    icon: "🖥",
    title: "EDR & Endpoint",
    items: [
      "CrowdStrike Falcon",
      "SentinelOne Singularity",
      "Microsoft Defender for Endpoint",
      "Palo Alto Cortex XDR",
      "Carbon Black EDR",
      "Cybereason and Trend Micro XDR",
    ],
  },
  {
    icon: "🔬",
    title: "Forensics & Hunting",
    items: [
      "Volatility 3 (memory forensics)",
      "Autopsy / FTK (disk forensics)",
      "Zeek / Suricata (network)",
      "YARA / Sigma rule frameworks",
      "Velociraptor (live response)",
      "Elastic SIEM + OSQuery",
    ],
  },
];

const comparisonRows = [
  {
    capability: "24/7 Human Coverage",
    inHouse: { icon: "❌", label: "Requires 10+ analysts" },
    mssp: { icon: "⚠️", label: "Often automated" },
    zecurx: { icon: "✅", label: "Guaranteed" },
  },
  {
    capability: "< 15-Min MTTD SLA",
    inHouse: { icon: "❌", label: "Depends on staffing" },
    mssp: { icon: "❌", label: "Rarely contractual" },
    zecurx: { icon: "✅", label: "Contractual SLA" },
  },
  {
    capability: "India Regulatory Expertise",
    inHouse: { icon: "⚠️", label: "Depends on team" },
    mssp: { icon: "⚠️", label: "Generic compliance" },
    zecurx: { icon: "✅", label: "CERT-In, RBI, SEBI, DPDPA" },
  },
  {
    capability: "Custom Detection Rules",
    inHouse: { icon: "✅", label: "If resourced" },
    mssp: { icon: "❌", label: "Generic rule sets" },
    zecurx: { icon: "✅", label: "Environment-specific" },
  },
  {
    capability: "Threat Hunting Integrated",
    inHouse: { icon: "⚠️", label: "If budget allows" },
    mssp: { icon: "❌", label: "Usually separate" },
    zecurx: { icon: "✅", label: "Same team, same platform" },
  },
  {
    capability: "Digital Forensics Available",
    inHouse: { icon: "⚠️", label: "Rarely in-house" },
    mssp: { icon: "❌", label: "Contracted out" },
    zecurx: { icon: "✅", label: "In-house, immediate" },
  },
  {
    capability: "Typical Annual Cost",
    inHouse: { icon: "❌", label: "₹4–8 Cr minimum" },
    mssp: { icon: "⚠️", label: "Variable, opaque" },
    zecurx: { icon: "✅", label: "Predictable OPEX" },
  },
];

const indiaFrameworks = [
  "CERT-In Directions 2022 — 6-hour breach reporting: ZecurX guarantees notification draft within the window",
  "RBI Cyber Security Framework for Banks — mandatory SOC, SIEM, and NeSL reporting: fully aligned",
  "SEBI CSCRF — continuous monitoring, SOC operations, and incident response: framework compliant",
  "DPDPA 2023 — personal data breach detection, scoping, and notification: forensics-supported response",
  "IRDAI Cybersecurity Guidelines — 24-hour incident reporting and security monitoring mandates",
  "MCA and SEBI listing obligations — material cybersecurity event disclosure requirements",
];

const internationalFrameworks = [
  "NIST Cybersecurity Framework (CSF 2.0) — Identify, Protect, Detect, Respond, Recover functions",
  "ISO/IEC 27001:2022 — Annex A controls for security monitoring and incident management",
  "SOC 2 Type II — Availability and Security Trust Service Criteria for continuous monitoring",
  "PCI-DSS v4.0 — Requirements 10 (logging), 11 (testing), and 12 (incident response)",
  "GDPR — 72-hour supervisory authority breach notification — our forensics supports required scope assessment",
  "HIPAA Security Rule — Security Incident Procedures and Audit Controls requirements",
];

// ── GLOBAL SCOPED HELPERS & HOVER CLASSES ────────────────────────────────────

const getCapabilityIcon = (name: string) => {
  const icons: Record<string, any> = {
    Shield,
    AlertTriangle,
    Search,
    BarChart2,
    Microscope,
    Globe,
  };
  const IconComponent = icons[name] || Search;
  return <IconComponent className="w-7 h-7 text-[#4c69e4]" />;
};

const getToolingIcon = (str: string) => {
  if (str === "📊") return <LineChart className="w-6 h-6 text-[#4c69e4]" />;
  if (str === "🖥")
    return <TerminalSquare className="w-6 h-6 text-[#4c69e4]" />;
  if (str === "🔬") return <Fingerprint className="w-6 h-6 text-[#4c69e4]" />;
  return null;
};

const renderComparisonIcon = (s: string) => {
  if (s === "✅") return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (s === "❌") return <XCircle className="w-5 h-5 text-slate-300" />;
  if (s === "⚠️") return <AlertCircle className="w-5 h-5 text-amber-500" />;
  return <span>{s}</span>;
};

// High-fidelity Glassmorphic Configuration Class string:
// Translates low-bg opacity, massive backdrop-blur, sharp crisp inset white highlights,
// and transitions into full opaque white background and clear primary blue accent border glow on hover.
const glassClasses = `
  relative 
  backdrop-blur-xl 
  bg-white/40 
  border border-white/60 
  shadow-[0_8px_32px_rgba(12,26,46,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)]
  transition-all duration-500
  hover:bg-white/95 
  hover:border-[#4c69e4]/40 
  hover:shadow-[0_12px_40px_rgba(76,105,228,0.15)]
`;

// ── EXPORTED MAIN PAGE COMPONENT ──────────────────────────────────────────────

export default function SOCDetectionResponsePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0); // Add this line
  const isHovering = useRef(false);
  const [activeStory, setActiveStory] = useState(0);

  // Auto-cycle logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering.current) {
        setActiveStep((prev) => (prev === socSteps.length - 1 ? 0 : prev + 1));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans selection:bg-[#4c69e4] selection:text-white relative overflow-hidden">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12 relative z-10">
        <SOCDetectionHero />

        {/* ── STATS BAR (4 Glassmorphic Cards) ── */}
        <section className="py-12 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <BlurFade key={i} delay={0.1 + i * 0.05}>
                <div
                  className={`p-8 rounded-[2rem] text-center ${glassClasses}`}
                >
                  <div className="text-2xl md:text-3xl font-bold font-manrope text-[#4c69e4] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[#0c1a2e] font-inter text-sm font-semibold mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-slate-500 font-inter text-xs">
                    {stat.sub}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>

        {/* ── WHY ZECURX (Enterprise Comparison Matrix) ── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white">
          <div className="max-w-[1320px] mx-auto">
            {/* Section Header */}
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-bold font-manrope text-[#0c1a2e]">
                  A genuine SOC <br />
                  <span className="text-[#4c69e4]">
                    not a managed alert forwarding service
                  </span>
                </h2>
              </div>
            </BlurFade>

            {/* Comparison Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                // Panel 1
                [
                  {
                    title: "Human Analysts",
                    desc: "Every critical alert is reviewed by certified analysts.",
                    icon: UserCheck,
                    conv: ["Automated alert routing", "Generic escalation"],
                    zecurx: [
                      "Certified analysts",
                      "Manual investigation",
                      "Threat context",
                    ],
                  },
                  {
                    title: "Guaranteed SLAs",
                    desc: "Contractual commitments backed by measurable response times.",
                    icon: FileSignature,
                    conv: ["Best-effort response", "Undefined MTTR"],
                    zecurx: [
                      "<15m detection",
                      "<15m IR activation",
                      "SLA accountability",
                    ],
                  },
                ],
                // Panel 2
                [
                  {
                    title: "India Native",
                    desc: "Deep regulatory expertise meets global capability.",
                    icon: Landmark,
                    conv: ["Offshore generic support", "Regulation agnostic"],
                    zecurx: [
                      "CERT-In/RBI/SEBI expertise",
                      "NIST/ISO alignment",
                      "Auditor-ready",
                    ],
                  },
                  {
                    title: "Integrated Team",
                    desc: "SOC, Hunting, Forensics, and Intel as one unified team.",
                    icon: Workflow,
                    conv: ["Siloed vendor tools", "Fragmented handoffs"],
                    zecurx: [
                      "Unified operational flow",
                      "Instant cross-team briefing",
                      "Continuous intelligence",
                    ],
                  },
                ],
              ].map((panel, pIdx) => (
                <div key={pIdx} className="flex flex-col gap-8">
                  {panel.map((item, i) => (
                    <div
                      key={i}
                      className="group p-8 md:p-10 bg-white border border-slate-200 rounded-[2rem] hover:border-[#4c69e4]/30 hover:shadow-[0_20px_40px_-15px_rgba(76,105,228,0.15)] transition-all duration-500"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-slate-50 text-[#4c69e4]">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0c1a2e] text-lg">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-slate-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100 my-6" />

                      {/* Comparison Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 block">
                            Conventional
                          </span>
                          <ul className="space-y-3">
                            {item.conv.map((c, ci) => (
                              <li
                                key={ci}
                                className="text-[13px] text-slate-500 flex items-center gap-2"
                              >
                                <span>○</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#4c69e4] mb-4 block">
                            ZecurX Approach
                          </span>
                          <ul className="space-y-3">
                            {item.zecurx.map((z, zi) => (
                              <li
                                key={zi}
                                className="text-[13px] text-[#0c1a2e] font-medium flex items-center gap-2"
                              >
                                <span>✓</span> {z}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICE PORTFOLIO (Full Dark Theme) ── */}
        <section
          className="py-20 px-6 relative z-10 bg-slate-900 pb-0" // Remove bottom padding
          id="capabilities"
        >
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-white">
                  Six Integrated Security <br />
                  <span className="text-[#60a5fa]">
                    Operations Capabilities
                  </span>
                </h2>
                <p className="text-slate-400 font-inter text-lg">
                  From continuous monitoring to post-breach forensics — one
                  integrated active security operations programme.
                </p>
              </div>
            </BlurFade>

            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
              {/* LEFT: Interactive Map (Dark Theme with Core Node) */}
              <div className="relative w-full lg:w-1/2 h-[600px] flex items-center justify-center">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {capabilities.map((_, index) => {
                    const angle =
                      (index / capabilities.length) * 2 * Math.PI - Math.PI / 2;
                    const x1 = 250 + Math.cos(angle) * 60; // Offset from center
                    const y1 = 300 + Math.sin(angle) * 60;
                    const x2 = 250 + Math.cos(angle) * 200;
                    const y2 = 300 + Math.sin(angle) * 150;
                    return (
                      <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#334155"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                </svg>

                {/* CORE CENTER NODE: Restored Icon */}
                <div className="absolute z-20 w-24 h-24 flex items-center justify-center -translate-x-[29px]">
                  <div className="relative w-full h-full flex items-center justify-center bg-[#0f172a] border border-slate-900 rounded-full shadow-[0_0_30px_rgba(96,165,250,0.15)]">
                    {" "}
                    {/* Ensure this path points to your actual logo/core icon file */}
                    <img
                      src="/icons/icon.png" // Use absolute path (starting with /)
                      alt="Core Operations"
                      className="w-24 h-24 object-contain" // REMOVED filter brightness-0 invert
                    />
                  </div>
                  {/* Core Node Glow & Ripple Effect */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Static Glow: Always present, soft halo */}
                    <div
                      className="absolute w-24 h-24 rounded-full border border-[#60a5fa]/30"
                      style={{
                        boxShadow: "0 0 40px 10px rgba(96, 165, 250, 0.15)",
                      }}
                    />

                    {/* Ripple Effect: The active animation */}
                    <div
                      className="absolute w-24 h-24 rounded-full border border-[#60a5fa] animate-ping"
                      style={{
                        animationDuration: "3s",
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="absolute w-24 h-24 rounded-full border border-[#60a5fa]/50 animate-ping"
                      style={{
                        animationDuration: "3s",
                        animationDelay: "1.5s",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </div>

                {/* OUTER NODES */}
                {capabilities.map((item, index) => {
                  const angle =
                    (index / capabilities.length) * 2 * Math.PI - Math.PI / 2;
                  const x = Math.round(Math.cos(angle) * 200);
                  const y = Math.round(Math.sin(angle) * 150);
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveCapability(index)}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className={`absolute z-10 px-5 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                        activeCapability === index
                          ? "border-[#60a5fa] bg-[#1e293b] text-[#60a5fa] shadow-[0_0_20px_rgba(96,165,250,0.2)] scale-105"
                          : "border-slate-800 bg-[#0f172a] text-slate-400 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      {getCapabilityIcon(item.icon)}
                      <span className="font-bold text-sm">{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: Detail Viewer (Dark Theme, Interactive) */}
              <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
                {/* Added 'group' to the wrapper to trigger child effects */}
                <div className="relative group">
                  {/* Decorative Glow - Intensifies on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-[2.5rem] blur opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

                  {/* Main Container - Added hover lift and border transition */}
                  <div className="relative p-10 bg-[#0f172a] rounded-[2rem] border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:border-[#60a5fa]/50 group-hover:shadow-[0_20px_50px_rgba(96,165,250,0.15)] group-hover:-translate-y-1">
                    {/* Internal "Highlight" effect that appears on hover */}
                    <div className="absolute inset-0 rounded-[2rem] border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div
                      key={activeCapability}
                      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#60a5fa] bg-[#1e293b] px-3 py-1 rounded-md">
                          Operational Excellence
                        </span>
                        <span className="text-4xl font-black text-slate-800 font-manrope group-hover:text-slate-700 transition-colors">
                          {String(activeCapability + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 mb-6">
                        {/* Icon Box - Brightens on hover */}
                        <div className="p-3 bg-[#1e293b] rounded-2xl text-[#60a5fa] border border-slate-700 group-hover:bg-[#1e293b] group-hover:border-[#60a5fa]/30 transition-all">
                          {getCapabilityIcon(
                            capabilities[activeCapability].icon,
                          )}
                        </div>
                        <h3 className="text-3xl font-extrabold text-white font-manrope tracking-tight leading-tight transition-colors group-hover:text-white">
                          {capabilities[activeCapability].title}
                        </h3>
                      </div>

                      <p className="text-slate-400 text-[17px] leading-relaxed mb-10 pl-2 border-l-4 border-[#60a5fa]/40 group-hover:border-[#60a5fa] transition-colors duration-500">
                        {capabilities[activeCapability].desc}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-700 pt-8 group-hover:border-[#60a5fa]/30 transition-colors duration-500">
                        <div className="flex gap-2">
                          {["Analysis", "Monitoring", "Response"].map((tag) => (
                            <button
                              key={tag}
                              className="px-4 py-1.5 rounded-full bg-[#1e293b] text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        {/* Counter Badge - Glows on hover */}
                        <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-[#60a5fa]/30 flex items-center justify-center text-[#60a5fa] text-[10px] font-bold group-hover:text-white group-hover:bg-[#60a5fa] transition-all">
                          {String(activeCapability + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-64 px-6 bg-slate-900" // Huge vertical padding (approx 1.5 - 2 inches)
          id="method"
        >
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-24">
              {" "}
              {/* Increased margin-bottom */}
              <h2 className="text-3xl font-bold md:text-5xl font-sans text-[#eff6ff]">
                The ZecurX{" "}
                <span className="text-[#4c69e4]">Operations Journey</span>
              </h2>
            </div>

            <div className="relative attackPath">
              <svg
                className="pathSvg w-full h-auto"
                viewBox="0 0 1100 330"
                preserveAspectRatio="none"
              >
                <path
                  className="stroke-[#4c69e4]/30 fill-none stroke-[2] [stroke-dasharray:8,8]"
                  d="M 30 180 C 130 180, 130 70, 235 70 C 340 70, 340 220, 450 220 C 550 220, 555 295, 650 295 C 760 295, 755 140, 865 140 C 970 140, 965 205, 1070 205"
                />
              </svg>
              {socSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    className={`absolute pathStep ${step.className}`}
                    key={step.id}
                  >
                    <div className="relative w-16 h-16 rounded-full bg-[#f4f9ff] border border-[#4c69e4] flex items-center justify-center text-black mb-4">
                      <Icon size={24} />
                      {/* Glow indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    </div>
                    <small className="text-[10px] font-bold text-[#4c69e4] uppercase tracking-widest block mb-1">
                      {step.id} / {step.code}
                    </small>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-[160px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── DELIVERABLES (Using exact block and component requested) ── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  What You <span className="text-[#4c69e4]">Receive</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Operational reporting, compliance documentation, and forensic
                  evidence — delivered continuously, not at year-end review.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceTimeline items={deliverables} />
            </BlurFade>
          </div>
        </section>

        {/* ── SUCCESS STORIES (Editorial Redesign: 30/70 Split) ── */}
        <section
          className="py-20 md:py-32 px-6 bg-slate-50/60 border-y border-slate-100 relative z-10"
          id="success"
        >
          <div className="max-w-[1200px] mx-auto">
            {/* Section Header */}
            <BlurFade delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Proven security operations{" "}
                  <span className="text-[#4c69e4]">outcomes</span>
                </h2>
              </div>
            </BlurFade>

            {/* 30/70 Split Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* LEFT: Sidebar Index (30%) - Interactive Hover State */}
              <div className="lg:w-[30%] flex flex-col gap-3">
                {caseStudies.map((s, i) => {
                  const shortHeading = s.heading
                    .split(" ")
                    .slice(0, 3)
                    .join(" ");

                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveStory(i)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                        activeStory === i
                          ? "border-[#4c69e4] bg-white shadow-md"
                          : "border-slate-200 bg-white/50 hover:border-[#4c69e4]/50 hover:shadow-lg"
                      }`}
                    >
                      {/* Hover Highlight Layer (Invisible line that slides in) */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-[#4c69e4] transition-all duration-500 ${activeStory === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                      />

                      <div
                        className={`text-[9px] font-bold mb-1 uppercase tracking-[0.2em] transition-colors duration-300 ${
                          activeStory === i
                            ? "text-[#4c69e4]"
                            : "text-slate-400 group-hover:text-[#4c69e4]/70"
                        }`}
                      >
                        CASE {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        className={`font-manrope font-bold text-sm transition-transform duration-300 group-hover:translate-x-1 ${
                          activeStory === i
                            ? "text-[#0c1a2e]"
                            : "text-slate-700"
                        }`}
                      >
                        {shortHeading}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: Intelligence Report Viewer (70%) - Height-Matched & High-Interaction */}
              <div className="w-full lg:w-[70%]">
                {/* We add 'group' to trigger hover states across all child elements simultaneously */}
                <div className="relative group min-h-[500px] bg-[#FAFAFA] border border-slate-200 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(76,105,228,0.15)] hover:border-[#4c69e4]/30 hover:bg-white">
                  {/* Blueprint Background Layer - Intensifies on hover */}
                  <div className="absolute inset-0 z-0">
                    <div
                      className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #4c69e4 1px, transparent 1px), linear-gradient(to bottom, #4c69e4 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />

                    {/* Icon Reveal: Becomes more visible and active on hover */}
                    <div className="absolute -right-10 -top-10 opacity-[0.03] transition-all duration-[1000ms] ease-out group-hover:opacity-[0.08] group-hover:rotate-[5deg] group-hover:scale-110">
                      {(() => {
                        const Icon = caseStudies[activeStory].icon;
                        return (
                          <Icon className="w-[500px] h-[500px] text-[#4c69e4]" />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Content Layer */}
                  <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
                    <div
                      key={activeStory}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      {/* Metadata Row */}
                      <div className="flex gap-4 mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {[
                          "CASE " + String(activeStory + 1).padStart(2, "0"),
                          "CLASSIFIED",
                          "ENTERPRISE",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#4c69e4]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title Section - Slight lift on hover */}
                      <h3 className="text-[32px] font-bold text-[#0c1a2e] font-manrope leading-[1.1] tracking-tight mb-8 max-w-xl transition-transform duration-500 group-hover:translate-x-1">
                        {caseStudies[activeStory].heading}
                      </h3>

                      {/* Executive Summary */}
                      <div className="mb-8">
                        <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 group-hover:text-[#4c69e4] transition-colors duration-500">
                          Executive Summary
                        </h4>
                        <p className="text-[15px] text-slate-700 leading-relaxed max-w-xl font-light">
                          {caseStudies[activeStory].quote}
                        </p>
                      </div>

                      {/* Intelligence Workflow Strip */}
                      <div className="flex items-center gap-2 mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        {["DISCOVERY", "ASSESSMENT", "RESOLUTION"].map(
                          (step, idx) => (
                            <div key={step} className="flex items-center gap-2">
                              <div className="px-2 py-0.5 border border-slate-300 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest group-hover:border-[#4c69e4]/30 group-hover:text-[#4c69e4] transition-colors duration-500">
                                {step}
                              </div>
                              {idx < 2 && (
                                <div className="w-6 h-[1px] bg-slate-300 group-hover:bg-[#4c69e4]/30 transition-colors duration-500" />
                              )}
                            </div>
                          ),
                        )}
                      </div>

                      <div className="w-full h-[1px] bg-slate-200 mb-8 group-hover:bg-[#4c69e4]/20 transition-colors duration-500" />

                      {/* Metrics Dashboard - Cards lift and brighten on hover */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {caseStudies[activeStory].metrics.map((m, mi) => (
                          <div
                            key={mi}
                            className="flex flex-col transition-transform duration-500 group-hover:translate-y-[-4px]"
                          >
                            <div className="text-[24px] font-bold text-[#0c1a2e] tracking-tighter mb-1 group-hover:text-[#4c69e4] transition-colors duration-500">
                              {m.value}
                            </div>
                            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                              {m.label}
                            </div>
                            <div className="text-[9px] text-slate-400">
                              {m.sub}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Consultant Signature Block */}
                      <div className="flex items-end justify-between pt-4 border-t border-slate-200 group-hover:border-[#4c69e4]/20 transition-colors duration-500">
                        <div>
                          <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                            Lead Security Consultant
                          </div>
                          <div className="text-sm font-semibold text-[#0c1a2e]">
                            {caseStudies[activeStory].name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                            Verified Assessment
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {caseStudies[activeStory].role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOLING COVERAGE ── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Native Expertise Across{" "}
                  <span className="text-[#4c69e4]">
                    Every Security Platform
                  </span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {toolingGroups.map((group, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.1} className="h-full">
                  <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    {/* Subtle Grid */}
                    <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#4c69e4_1px,transparent_1px),linear-gradient(to_bottom,#4c69e4_1px,transparent_1px)] bg-[size:22px_22px]" />

                    {/* Terminal Header */}
                    <div className="relative flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
                          terminal
                        </span>
                        <span className="font-manrope font-semibold text-[#0c1a2e] text-sm">
                          {group.title}
                        </span>
                      </div>
                      <div className="w-14" />
                    </div>

                    {/* Terminal Body */}
                    <div className="relative p-7">
                      {/* Subtle glass reflection */}
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
                      </div>

                      {/* Command Line */}
                      <div className="flex items-center text-[13px] font-mono text-[#4c69e4] mb-7">
                        <span className="mr-2">$</span>
                        <span className="opacity-90">
                          {group.title === "SIEM Platforms"
                            ? "./list-supported-tools"
                            : group.title === "EDR & Endpoint"
                              ? "enumerate-edr --vendors"
                              : "load-toolkit --forensics"}
                        </span>
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="ml-1"
                        >
                          █
                        </motion.span>
                      </div>

                      {/* Tool List */}
                      <div className="space-y-3">
                        {group.items.map((item, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: j * 0.08, duration: 0.35 }}
                            className="flex items-center gap-3 group/item"
                          >
                            <span className="font-mono text-[#4c69e4] select-none">
                              &gt;
                            </span>
                            <span className="font-inter text-[15px] text-slate-700 transition-all duration-300 group-hover/item:text-[#0c1a2e]">
                              {item}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Terminal Footer */}
                      <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between text-xs font-mono text-slate-400">
                        <span>{group.items.length} packages</span>
                        <span>registry.local</span>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1000px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Why the most common alternatives{" "}
                  <span className="text-[#4c69e4]">fall short</span>
                </h2>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-slate-50 border-b border-slate-200 p-6">
                    <div className="font-manrope font-bold text-[#0c1a2e] text-sm uppercase tracking-wide">
                      Capability
                    </div>
                    <div className="font-manrope font-bold text-slate-500 text-sm uppercase tracking-wide text-center">
                      In-House SOC
                    </div>
                    <div className="font-manrope font-bold text-slate-500 text-sm uppercase tracking-wide text-center">
                      Generic MSSP
                    </div>
                    <div className="font-manrope font-bold text-[#4c69e4] text-sm uppercase tracking-wide text-center">
                      ZecurX Layer 05
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {comparisonRows.map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1.5fr_1fr_1fr_1fr] p-6 hover:bg-slate-50/50 transition-colors items-center"
                      >
                        <div className="font-medium text-[#0c1a2e] font-inter text-base">
                          {row.capability}
                        </div>
                        <div className="flex flex-col items-center text-center gap-1.5">
                          {renderComparisonIcon(row.inHouse.icon)}
                          <span className="text-slate-500 font-inter text-[11px] font-medium leading-tight">
                            {row.inHouse.label}
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1.5">
                          {renderComparisonIcon(row.mssp.icon)}
                          <span className="text-slate-500 font-inter text-[11px] font-medium leading-tight">
                            {row.mssp.label}
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1.5 bg-[#f8fbff] py-3 px-2 rounded-xl border border-[#4c69e4]/10">
                          {renderComparisonIcon(row.zecurx.icon)}
                          <span className="text-[#4c69e4] font-bold font-inter text-[11px] leading-tight">
                            {row.zecurx.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── REGULATORY ALIGNMENT ── */}
        <section className="py-20 md:py-32 px-6 relative z-10 border-t border-slate-100">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Regulatory <span className="text-[#4c69e4]">Alignment</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BlurFade delay={0.15}>
                <div className={`p-10 rounded-[2rem] h-full ${glassClasses}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-8 h-8 text-[#4c69e4]" />
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-2xl">
                      Indian Regulatory Obligations
                    </h3>
                  </div>
                  <ul className="space-y-5">
                    {indiaFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-[#4c69e4]/60 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-inter text-base leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>

              <BlurFade delay={0.2}>
                <div className={`p-10 rounded-[2rem] h-full ${glassClasses}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <GlobeLock className="w-8 h-8 text-[#4c69e4]" />
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-2xl">
                      International Frameworks
                    </h3>
                  </div>
                  <ul className="space-y-5">
                    {internationalFrameworks.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-[#4c69e4]/60 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-inter text-base leading-relaxed">
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

        {/* ── ENGAGEMENT MODELS (Service Selection Interface) ── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-bold font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Security Maturity</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Fully Managed SOC",
                  bestFor: "No internal security team",
                  includes: [
                    "24/7 Monitoring",
                    "Full Triage & IR",
                    "Threat Hunting",
                    "Compliance Reporting",
                  ],
                  model: "Subscription (Per Seat/Log)",
                  rec: "SMEs & Growing Enterprises",
                },
                {
                  icon: Users,
                  title: "Co-Managed SOC",
                  bestFor: "Supplementing small teams",
                  includes: [
                    "Night/Weekend Coverage",
                    "Tier 2/3 Escalation",
                    "Expert Backup",
                    "Skill Augmentation",
                  ],
                  model: "Subscription (Tiered)",
                  rec: "In-house team needing scale",
                },
                {
                  icon: AlertTriangle,
                  title: "IR Retainer Only",
                  bestFor: "Internal monitoring exists",
                  includes: [
                    "Guaranteed SLA Response",
                    "Annual Tabletop Exercise",
                    "Forensics Access",
                    "Pre-auth Setup",
                  ],
                  model: "Annual Retainer",
                  rec: "Mature teams needing IR surge",
                },
                {
                  icon: Search,
                  title: "Hunt & Intelligence",
                  bestFor: "Layering advanced defense",
                  includes: [
                    "Dark Web Monitoring",
                    "Proactive Hunting",
                    "IOC/Adversary Feeds",
                    "Brand Protection",
                  ],
                  model: "Monthly/Quarterly Fee",
                  rec: "Security-mature organizations",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="group flex flex-col p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-[#4c69e4]/30 hover:shadow-[0_20px_40px_-15px_rgba(76,105,228,0.1)] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#4c69e4]/5 transition-colors">
                      <service.icon className="w-5 h-5 text-[#4c69e4]" />
                    </div>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-lg leading-tight mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {service.bestFor}
                    </p>
                  </div>

                  <div className="h-[1px] w-full bg-slate-100 mb-6" />

                  {/* Includes List */}
                  <div className="flex-grow space-y-3 mb-6">
                    {service.includes.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[12px] text-slate-600"
                      >
                        <span className="text-[#4c69e4]">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Commercial Model
                      </p>
                      <p className="text-[12px] font-semibold text-[#0c1a2e]">
                        {service.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Recommended For
                      </p>
                      <p className="text-[12px] font-semibold text-[#0c1a2e]">
                        {service.rec}
                      </p>
                    </div>
                  </div>

                  {/* Accent Line */}
                  <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-[#4c69e4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-16 md:py-24 px-6 relative z-10">
          <div className="max-w-[800px] mx-auto">
            <BlurFade delay={0.2}>
              <div className="relative p-10 md:p-16 rounded-[2.5rem] bg-[#0c1a2e] shadow-2xl overflow-hidden text-center border border-[#1e2d5f] group">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-manrope font-bold text-white mb-4">
                    Active protection. <br className="hidden sm:block" />
                    <span className="text-[#4c69e4]">
                      Not reactive reports.
                    </span>
                  </h2>
                  <p className="text-slate-300 font-inter mb-10 max-w-lg mx-auto text-base leading-relaxed">
                    Request a free 30-minute Security Operations Assessment — a
                    senior ZecurX SOC analyst will evaluate your current
                    detection coverage, identify gaps, and show you exactly
                    where your blind spots are. No cost. No obligation. Just
                    clarity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:bg-[#3b55c6] transition-all duration-200 hover:shadow-[0_0_20px_rgba(76,105,228,0.4)]"
                    >
                      Get Security Operations Assessment
                      <ArrowRight className="w-4 h-4" />
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
