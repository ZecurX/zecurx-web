import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Shield, AlertTriangle, Search, BarChart2, Microscope, Globe } from "lucide-react";
import { SOCDetectionHero } from "./soc-detection-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "SOC, Detection & Response | ZecurX",
  description:
    "Continuous monitoring, threat hunting, and rapid containment — 24/7/365 managed SOC with human analysts, sub-15-minute MTTD SLA, CERT-In 6-hour breach reporting coverage, threat hunting, digital forensics, SIEM deployment, and threat intelligence. Active, not reactive.",
  keywords: [
    "managed SOC",
    "vSOC",
    "threat hunting",
    "incident response retainer",
    "SIEM deployment",
    "digital forensics",
    "threat intelligence",
    "CERT-In breach reporting",
    "24/7 security monitoring",
    "MITRE ATT&CK",
  ],
  openGraph: {
    title: "SOC, Detection & Response | ZecurX",
    description:
      "24/7/365 managed SOC with human analysts, <15-min MTTD SLA, threat hunting, digital forensics, and CERT-In breach reporting coverage.",
    type: "website",
    url: "https://zecurx.com/services/soc-detection-response",
  },
  alternates: {
    canonical: "https://zecurx.com/services/soc-detection-response",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

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

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

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

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "207 Days",
    label: "Average attacker dwell time before detection without active SOC (IBM)",
    sub: "We detect in under 15 minutes",
  },
  {
    value: "< 15 Min",
    label: "ZecurX Mean Time to Detect (MTTD) — guaranteed in SLA",
    sub: "Contractual commitment",
  },
  {
    value: "6 Services",
    label: "Integrated SOC, hunting, forensics, and intelligence capabilities",
    sub: "One integrated team",
  },
  {
    value: "6 Hours",
    label: "CERT-In mandatory breach reporting window — we meet it every time",
    sub: "Notification draft guaranteed",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "3 Active Compromises Detected in First 30 Days — Cyber Insurance Premium Reduced by 22%",
    quote:
      "Within the first 30 days, our analysts detected an active brute-force campaign targeting their VPN gateway from 14 countries, a compromised vendor account accessing their ERP system outside business hours, and a workstation with an active Cobalt Strike beacon that had been present for 11 days undetected. All three were contained before any data was exfiltrated. The client's cyber insurance premium subsequently decreased by 22% at renewal due to the demonstrated 24/7 monitoring capability.",
    name: "Head of IT",
    role: "Manufacturing Group (3,200 employees across six plants, post ransomware near-miss)",
    icon: Shield,
    lottie: getCdnUrl("lottie/vsoc.json"),
    metrics: [
      { value: "3", label: "Active Compromises Detected", sub: "In first 30 days of monitoring" },
      { value: "22%", label: "Insurance Premium Reduction", sub: "At renewal after SOC enrolment" },
    ],
  },
  {
    id: 2,
    heading: "BlackCat Ransomware Contained in 12 Minutes — Full Recovery in 38 Hours, Zero Ransom Paid",
    quote:
      "A FinTech serving 800,000 retail investors was hit by a ransomware attack deploying BlackCat/ALPHV at 11:47 PM on a Sunday. The ZecurX IR hotline was called at 11:52 PM. A senior incident commander was on a bridge call by 12:04 AM — 12 minutes after the call. By 1:30 AM, network isolation was complete. By 4:00 AM, the infection scope was fully mapped and contained. By 6:00 AM, the CERT-In notification had been drafted and was awaiting client legal review. No ransom was paid. The encrypted systems were recovered from verified clean backups. The client was fully operational within 38 hours.",
    name: "CISO",
    role: "FinTech (800,000 retail investors, BlackCat/ALPHV ransomware attack)",
    icon: AlertTriangle,
    lottie: getCdnUrl("lottie/ir_retainer.json"),
    metrics: [
      { value: "12 mins", label: "IR Commander Engaged", sub: "From hotline call to bridge" },
      { value: "38 hours", label: "Full Recovery", sub: "Zero ransom paid" },
    ],
  },
  {
    id: 3,
    heading: "47-Day APT Dwell Ended Before Exfiltration — ₹180 Crore in Pharma R&D Data Saved",
    quote:
      "During an initial threat hunting engagement for a global pharmaceutical company with Indian R&D operations, ZecurX analysts discovered a threat actor operating under a compromised service account that had been present for 47 days. The actor had been systematically staging clinical trial data to an encrypted archive on a network share — preparing for exfiltration. The account had generated no alerts in the client's SIEM because its activity patterns were superficially consistent with its legitimate function. ZecurX's hunt detected it through process lineage analysis — the service account was spawning cmd.exe child processes, which was inconsistent with its defined role. The actor was ejected before exfiltration completed. The client estimated the value of the staged data at over ₹180 Crore in competitive intelligence.",
    name: "VP Information Security",
    role: "Global Pharmaceutical Company (Indian R&D operations, clinical trial data at risk)",
    icon: Search,
    lottie: getCdnUrl("lottie/threat_hunting.json"),
    metrics: [
      { value: "47 Days", label: "APT Dwell Time Ended", sub: "Before exfiltration completed" },
      { value: "₹180 Cr", label: "R&D Data Protected", sub: "Estimated competitive intelligence value" },
    ],
  },
  {
    id: 4,
    heading: "45,000 Daily Alerts Reduced to 290 — 3 Undetected Compromises Found in Week One",
    quote:
      "A 2,800-seat financial services firm was processing 45,000 Splunk alerts per day with a 3-person security team. They were investigating fewer than 200 per day — meaning 44,800 alerts were dismissed unreviewed. After a ZecurX tuning engagement — rewriting 340 correlation rules, implementing environment-specific suppression logic, adding UEBA behavioural baselines, and deploying automated SOAR triage — daily alerts dropped to 290 high-fidelity incidents, all of which were actionable. Investigation time per alert dropped from 45 minutes to under 6 minutes. The team discovered 3 previously undetected compromises in the first week of operating the tuned system — all had generated alerts under the old ruleset that had been dismissed as noise.",
    name: "Head of Cyber Defence",
    role: "Financial Services Firm (2,800 seats, 3-person security team, Splunk SIEM)",
    icon: BarChart2,
    lottie: getCdnUrl("lottie/siem.json"),
    metrics: [
      { value: "45K → 290", label: "Daily Alerts After Tuning", sub: "All 290 actionable" },
      { value: "3", label: "Prior Undetected Compromises Found", sub: "In week one post-tuning" },
    ],
  },
  {
    id: 5,
    heading: "Insider Exfiltration Proven — Forensic Evidence Accepted by CBI, Arrest in 60 Days",
    quote:
      "A private bank's fraud investigation team suspected an insider had been exfiltrating customer KYC data over a 6-month period. ZecurX conducted a full forensic investigation across 4 suspect workstations, Exchange mail server logs, and DLP system records. Memory analysis of one workstation recovered an encryption key in active use by a custom data exfiltration tool running as a disguised Windows service. Disk forensics recovered 3,400 deleted files from the suspect's workstation including customer data exports. Network forensics traced exfiltration traffic to a personally controlled cloud storage account. The forensic report was submitted to the bank's legal team and subsequently to the CBI. The suspect was arrested within 60 days. The forensic evidence was accepted as primary evidence in the criminal filing.",
    name: "Chief Risk Officer",
    role: "Private Bank (insider KYC data exfiltration, CBI criminal proceedings)",
    icon: Microscope,
    lottie: getCdnUrl("lottie/forensics.json"),
    metrics: [
      { value: "3,400", label: "Deleted Files Recovered", sub: "Including customer data exports" },
      { value: "60 days", label: "To Arrest", sub: "Forensics accepted as primary evidence" },
    ],
  },
  {
    id: 6,
    heading: "Phishing Domain Taken Down in 31 Hours — 50,000+ Banking Customers Protected",
    quote:
      "A private sector bank's fraud team received a ZecurX Threat Intelligence alert at 9:14 AM: a newly registered domain (b4nk-client-name.com) was observed in a criminal Telegram channel with a phishing kit targeting the bank's retail internet banking customers — complete with cloned login page and SMS OTP capture capability. The domain had been registered 6 hours earlier. ZecurX initiated takedown procedures immediately. The domain was suspended within 31 hours of initial registration — before it had been indexed by major search engines or distributed widely to potential victims. The bank's fraud team estimated the phishing campaign, had it reached its intended audience, would have exposed 50,000+ customers to credential theft. Zero customers were defrauded.",
    name: "Head of Fraud & Cyber Intelligence",
    role: "Private Sector Bank (retail internet banking, brand impersonation threat)",
    icon: Globe,
    lottie: getCdnUrl("lottie/threat_intel.json"),
    metrics: [
      { value: "31 Hours", label: "Phishing Domain Suspended", sub: "From initial registration" },
      { value: "50,000+", label: "Customers Protected", sub: "Zero defrauded" },
    ],
  },
];

// ── SOC OPERATIONS MODEL ──────────────────────────────────────────────────────

const socSteps = [
  {
    title: "Detect",
    desc: "Automated correlation rules and AI-assisted anomaly detection generate candidate alerts across all monitored sources.",
  },
  {
    title: "Triage",
    desc: "Human analyst reviews, enriches with TI context, asset data, and user behaviour — makes a severity classification decision.",
  },
  {
    title: "Investigate",
    desc: "Confirmed incidents investigated for scope, lateral movement, persistence, and data exposure by dedicated tier-2 analysts.",
  },
  {
    title: "Contain",
    desc: "Active containment actions: isolation, account suspension, firewall block, EDR quarantine — with client authorisation protocols.",
  },
  {
    title: "Hunt",
    desc: "Post-incident hypothesis-driven hunting to determine if the detected threat is part of a broader campaign or longer-dwell presence.",
  },
  {
    title: "Improve",
    desc: "Every incident updates detection rules, playbooks, and baseline models — the SOC becomes smarter with every event it handles.",
  },
];

// ── TOOLING COVERAGE ──────────────────────────────────────────────────────────

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

// ── COMPARISON TABLE ──────────────────────────────────────────────────────────

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

// ── REGULATORY ALIGNMENT ──────────────────────────────────────────────────────

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

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function SOCDetectionResponsePage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <SOCDetectionHero />

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
                  A genuine SOC —{" "}
                  <span className="text-[#4c69e4]">not a managed alert forwarding service</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "◉",
                  title: "Human Analysts, Every Shift",
                  desc: "Every alert in our SOC is reviewed by a certified analyst — OSCP, CEH, GCIH, GCFE, and CISSP qualified. We do not use automation to forward alerts and call it monitoring. When a critical incident fires at 3 AM, a human being is reading it, enriching it, and making a triage decision within minutes.",
                },
                {
                  icon: "📋",
                  title: "Guaranteed SLAs That Mean Something",
                  desc: "Our SLAs are contractual commitments, not marketing language. Mean Time to Detect under 15 minutes. Incident Response retainer activation under 15 minutes. CERT-In 6-hour reporting window coverage guaranteed. When we miss an SLA, it is documented, root-caused, and compensated.",
                },
                {
                  icon: "🇮🇳",
                  title: "India-Native, Globally Capable",
                  desc: "Deep knowledge of India's regulatory landscape — CERT-In, RBI, SEBI, DPDPA, IRDAI — plus international frameworks: NIST, SOC 2, ISO 27001, GDPR, PCI-DSS. We speak the language of your auditors and your board simultaneously. Intelligence feeds directly into detection rules.",
                },
                {
                  icon: "🔗",
                  title: "Integrated, Not Siloed",
                  desc: "Our SOC, Threat Hunting, Digital Forensics, and Threat Intelligence capabilities are operated by a single integrated team — not contracted out to separate vendors with disconnected tooling. When a hunter finds a threat, forensics and IR are briefed instantly.",
                },
              ].map((item, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
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
                  Six Integrated{" "}
                  <span className="text-[#4c69e4]">Security Operations Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From continuous monitoring to post-breach forensics — one integrated active security operations programme.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── SOC OPERATIONS MODEL ─────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">SOC Operations Model</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our 24/7 security operations centre actually works — the people, process, and technology behind the service.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {socSteps.map((step, i) => (
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
                  Operational reporting, compliance documentation, and forensic evidence — delivered continuously, not at year-end review.
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
                  Proven security operations{" "}
                  <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our SOC, IR, hunting, forensics, and intelligence engagements have detected, contained, and recovered from real attacks.
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
                  Native Expertise Across{" "}
                  <span className="text-[#4c69e4]">Every Security Platform</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  The platforms, tools, and integrations our SOC and detection practice operates natively.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {toolingGroups.map((group, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <h3 className="font-manrope font-bold text-[#0c1a2e] text-lg">
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

        {/* ── COMPARISON TABLE ─────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  ZecurX vs. The Alternatives
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Why the most common alternatives{" "}
                  <span className="text-[#4c69e4]">fall short</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  A direct comparison between in-house SOC, generic MSSP, and ZecurX Layer 05.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm font-inter">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-6 py-4 font-manrope font-bold text-[#0c1a2e] text-sm">Capability</th>
                      <th className="px-6 py-4 font-manrope font-bold text-[#0c1a2e] text-sm text-center">In-House SOC</th>
                      <th className="px-6 py-4 font-manrope font-bold text-[#0c1a2e] text-sm text-center">Generic MSSP</th>
                      <th className="px-6 py-4 font-manrope font-bold text-[#4c69e4] text-sm text-center">ZecurX Layer 05</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                        <td className="px-6 py-3.5 font-medium text-[#0c1a2e]">{row.capability}</td>
                        <td className="px-6 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span>{row.inHouse.icon}</span>
                            <span className="text-slate-500 text-xs">{row.inHouse.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span>{row.mssp.icon}</span>
                            <span className="text-slate-500 text-xs">{row.mssp.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-center bg-[#4c69e4]/3">
                          <div className="flex flex-col items-center gap-0.5">
                            <span>{row.zecurx.icon}</span>
                            <span className="text-[#4c69e4] text-xs font-medium">{row.zecurx.label}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── REGULATORY ALIGNMENT ─────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
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
                  Designed to satisfy the SOC and incident response obligations of Indian and international regulators.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlurFade delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      Indian Regulatory Obligations
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {indiaFrameworks.map((item, i) => (
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
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      International Frameworks
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {internationalFrameworks.map((item, i) => (
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
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Engagement Models
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Security Maturity</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Flexible commercial structures aligned to your security maturity and operational requirements.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🛡",
                  title: "Fully Managed SOC (vSOC)",
                  desc: "Complete outsourced SOC operations — ZecurX is your security operations centre. Includes 24/7 monitoring, alert triage, investigation, containment, threat hunting, and compliance reporting. Monthly subscription priced per seat, endpoint, or log volume. Ideal for organisations without an internal security team or with a small team that needs to be supplemented by expert coverage.",
                },
                {
                  icon: "🤝",
                  title: "Co-Managed SOC",
                  desc: "ZecurX augments your existing internal security team — covering the hours, skill sets, and threat scenarios your team cannot. Your analysts handle Tier 1 during business hours; ZecurX covers nights, weekends, and provides Tier 2/3 escalation expertise. Ideal for organisations with a small internal team that needs expert backup and extended coverage.",
                },
                {
                  icon: "🚨",
                  title: "IR Retainer Only",
                  desc: "Pre-arranged incident response capability without ongoing monitoring — for organisations that have internal monitoring but need guaranteed expert breach response. Annual retainer with contractual SLA. Includes annual tabletop exercise, pre-authorised access setup, and on-demand access to our forensics team.",
                },
                {
                  icon: "🔍",
                  title: "Hunt & Intelligence Subscription",
                  desc: "Proactive threat hunting on a monthly or quarterly basis, combined with continuous threat intelligence delivery — dark web monitoring, IOC feeds, adversary briefings, and brand protection. Ideal for organisations with existing monitoring that want proactive and intelligence capabilities layered on top.",
                },
              ].map((model, i) => (
                <BlurFade key={i} delay={0.1 + i * 0.05}>
                  <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-3">
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
                    Active protection.{" "}
                    <span className="text-[#4c69e4]">Not reactive reports.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-6 max-w-lg mx-auto text-base leading-relaxed">
                    Request a free 30-minute Security Operations Assessment — a senior ZecurX SOC
                    analyst will evaluate your current detection coverage, identify gaps, and show
                    you exactly where your blind spots are. No cost. No obligation. Just clarity.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 py-3 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-1px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Get Security Operations Assessment
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