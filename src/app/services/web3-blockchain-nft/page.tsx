import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, MessageSquare, FileCode, Image, Zap, KeyRound, Lock, Search } from "lucide-react";
import { Web3BlockchainHero } from "./web3-hero";
import { ServiceTimeline } from "@/components/ui/service-timeline";
import { ServiceFeatureGrid } from "@/components/ui/service-feature-grid";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "Web3 & Blockchain Security | ZecurX",
  description:
    "Secure-by-design decentralised applications — smart contract development and audit, NFT platforms, DeFi protocol security, wallet & key management, token-gated systems, and blockchain forensics. Formal verification and institutional-grade delivery across Ethereum, Solana, and Polygon.",
  keywords: [
    "smart contract audit",
    "smart contract development",
    "NFT platform development",
    "DeFi security",
    "blockchain forensics",
    "token-gated access",
    "wallet security",
    "formal verification",
    "Solidity audit",
    "Web3 security",
  ],
  openGraph: {
    title: "Web3 & Blockchain Security | ZecurX",
    description:
      "Secure-by-design decentralised applications — smart contract audit, NFT platforms, DeFi protocol security, and blockchain forensics.",
    type: "website",
    url: "https://zecurx.com/services/web3-blockchain",
  },
  alternates: {
    canonical: "https://zecurx.com/services/web3-blockchain",
  },
};

// ── SERVICE CAPABILITIES ──────────────────────────────────────────────────────

const capabilities = [
  {
    title: "NFT-Based Chat System Development",
    desc: "Token-gated messaging platforms where on-chain ownership is the identity — built for exclusive communities, DAOs, and Web3-native brands. ERC-721/1155 and SPL token gate logic, end-to-end encrypted DMs, multi-wallet support, and automatic access revocation within seconds of NFT transfer. Push Protocol and XMTP integration for decentralised wallet-to-wallet messaging.",
    icon: "MessageSquare",
  },
  {
    title: "Smart Contract Development & Audit",
    desc: "Full-lifecycle Solidity and Rust smart contract development with formal verification using Certora Prover and SMTChecker — mathematical proof that contract logic is correct under all possible states. Reentrancy analysis, access control audit, gas optimisation, upgradeability patterns, and CVSS-scored investor-grade audit reports accepted by leading launchpads and VCs.",
    icon: "FileCode",
  },
  {
    title: "NFT Platform Development",
    desc: "Full-stack NFT marketplace and minting platform with ERC-2981 royalty enforcement, IPFS and Arweave decentralised storage, lazy minting architecture, and merkle-proof whitelist systems. Anti-wash-trading detection, multi-currency settlement, and full administrative dashboards — built to the same standard we apply to DeFi protocols.",
    icon: "Image",
  },
  {
    title: "DeFi Protocol Security",
    desc: "Comprehensive DeFi security review covering flash loan simulation, oracle manipulation testing, economic exploit modelling using agent-based simulation, and AMM invariant verification. Governance attack surface review, cross-protocol composability risk analysis, and adversarial red team on forked mainnet — before a single dollar of TVL is at risk.",
    icon: "Zap",
  },
  {
    title: "Wallet & Key Management Security",
    desc: "Institutional-grade wallet integration, Gnosis Safe multi-sig architecture, HSM integration, and MPC wallet implementation for keyless signing without single custodian risk. Private key exposure audit, seed phrase security architecture, key rotation procedures, and break-glass access protocols — eliminating the single greatest attack surface in Web3.",
    icon: "KeyRound",
  },
  {
    title: "Blockchain Forensics",
    desc: "On-chain transaction graph analysis, wallet attribution and clustering, rug pull investigation, and smart contract exploit post-mortems for legal, regulatory, and recovery contexts. Exchange and mixer tracing, legal-grade evidence packaging for civil litigation and regulatory submissions, and asset recovery coordination with international law enforcement.",
    icon: "Search",
  },
];

// ── DELIVERABLES ──────────────────────────────────────────────────────────────

const deliverables = [
  {
    title: "Security Architecture & Threat Model",
    desc: "Attack surface map for your smart contract system or Web3 product — trust boundaries, privileged roles, economic attack vectors, and cross-protocol composability risks documented before development begins. Includes blockchain-native threat model covering flash loan, oracle, governance, and reentrancy attack classes.",
    icon: "FileText",
  },
  {
    title: "Formal Verification Report",
    desc: "Certora Prover and SMTChecker output with mathematical proof of correctness for critical contract logic — demonstrating that specified invariants hold under all possible inputs and states. Accepted by institutional investors, launchpads, and DeFi insurance protocols as the highest standard of contract assurance.",
    icon: "BarChart",
  },
  {
    title: "Smart Contract Audit Report",
    desc: "CVSS-scored findings with proof-of-concept exploit code, root cause analysis, and prioritised remediation guidance — suitable for investor disclosure, regulatory submission, and public publication. Includes automated analysis (Slither, Mythril, Echidna) augmented with expert manual review of all critical paths.",
    icon: "GitBranch",
  },
  {
    title: "Deployment & Post-Launch Package",
    desc: "Production deployment support with verified contract source code, deployment scripts, multi-sig governance configuration, and 30-day post-launch monitoring. Includes gas optimisation report, upgradeability documentation, and incident response runbook — the complete handover package for live protocol management.",
    icon: "Award",
  },
];

// ── STATS ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    value: "$1.8B+",
    label: "Lost to smart contract exploits in 2023 alone",
    sub: "Majority were preventable",
  },
  {
    value: "7",
    label: "Specialised Web3 service verticals",
    sub: "One integrated practice",
  },
  {
    value: "ETH · SOL · Polygon",
    label: "Multi-chain delivery capability",
    sub: "Plus Arbitrum, Base, Avalanche",
  },
  {
    value: "0 Breaches",
    label: "Post-deployment on ZecurX-audited contracts",
    sub: "Since practice inception",
  },
];

// ── CASE STUDIES ──────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: 1,
    heading: "12,000 Wallets Onboarded in 30 Days — Zero Security Incidents on Token-Gated Chat Platform",
    quote:
      "ZecurX delivered a custom token-gated chat platform in 8 weeks — 3 tier levels based on NFT rarity, E2E encrypted DMs, and automatic access revocation on NFT transfer. The platform onboarded 12,000 wallets in the first 30 days with zero security incidents.",
    name: "Head of Community",
    role: "Leading NFT Gaming Project (exclusive strategy channels for token holders)",
    icon: MessageSquare,
    lottie: getCdnUrl("lottie/nft_chat.json"),
    metrics: [
      { value: "12,000", label: "Wallets Onboarded", sub: "In first 30 days" },
      { value: "0", label: "Security Incidents", sub: "Zero breaches post-launch" },
    ],
  },
  {
    id: 2,
    heading: "3 Critical Vulnerabilities Found Before $15M TVL Launch — Protocol Launched Without Incident",
    quote:
      "A DeFi lending protocol required audit before a $15M TVL launch. ZecurX's review identified three critical vulnerabilities — including a flash-loan-assisted price manipulation path that could have drained the entire liquidity pool. All findings were remediated before deployment. The protocol launched without incident and cited the ZecurX audit report in investor communications.",
    name: "CTO",
    role: "DeFi Lending Protocol ($15M TVL launch, investor-grade audit required)",
    icon: FileCode,
    lottie: getCdnUrl("lottie/smart_contract.json"),
    metrics: [
      { value: "3 Critical", label: "Vulnerabilities Found", sub: "Before mainnet deployment" },
      { value: "$15M TVL", label: "Launched Without Incident", sub: "Audit cited by investors" },
    ],
  },
  {
    id: 3,
    heading: "2,500 NFT Drop Sold Out in 11 Minutes — ₹38L in Secondary Royalties Generated",
    quote:
      "ZecurX delivered a fully branded marketplace with Arweave-backed metadata (permanent storage), ERC-2981 royalties, and a private minting portal for brand administrators. The initial drop of 2,500 NFTs sold out in 11 minutes with zero contract incidents. Secondary market royalties have since generated ₹38L in passive creator revenue.",
    name: "Digital Director",
    role: "Luxury Fashion House (digital product authentication and limited-edition drops)",
    icon: Image,
    lottie: getCdnUrl("lottie/nft_platform.json"),
    metrics: [
      { value: "11 mins", label: "2,500 NFT Drop Sold Out", sub: "Zero contract incidents" },
      { value: "₹38L", label: "Secondary Royalties Generated", sub: "Passive creator revenue" },
    ],
  },
  {
    id: 4,
    heading: "Critical Governance Flash Loan Path Found Before $50M TVL — Architecture Redesigned Pre-Launch",
    quote:
      "A yield optimisation protocol preparing for $50M TVL launch engaged ZecurX for a DeFi security review. Our economic modelling identified a governance flash loan attack path that would have allowed a single actor to temporarily acquire a voting majority and pass a malicious upgrade proposal in a single transaction. The finding was considered critical — equivalent vulnerabilities have caused eight-figure losses elsewhere. The governance architecture was redesigned before launch.",
    name: "Protocol Architect",
    role: "Yield Optimisation Protocol ($50M TVL launch, governance security review)",
    icon: Zap,
    lottie: getCdnUrl("lottie/defi.json"),
    metrics: [
      { value: "1 Critical", label: "Governance Exploit Found", sub: "8-figure equivalent loss prevented" },
      { value: "$50M TVL", label: "Safe Launch Achieved", sub: "After architecture redesign" },
    ],
  },
  {
    id: 5,
    heading: "3,400 ETH Treasury Secured — 4-of-7 Multi-Sig Implemented Across Geographies",
    quote:
      "A Web3 gaming company's treasury (holding 3,400 ETH) was managed by a single EOA (Externally Owned Account) — one compromised developer laptop away from total loss. ZecurX designed and implemented a Gnosis Safe multi-sig governance structure with 4-of-7 signing authority distributed across geographies, hardware wallets, and a timelock delay for large transactions. The treasury has operated without incident since, through three major market volatility events.",
    name: "Co-Founder",
    role: "Web3 Gaming Company (3,400 ETH treasury, single EOA risk eliminated)",
    icon: KeyRound,
    lottie: getCdnUrl("lottie/wallet.json"),
    metrics: [
      { value: "3,400 ETH", label: "Treasury Secured", sub: "4-of-7 multi-sig governance" },
      { value: "0 Incidents", label: "Through 3 Volatility Events", sub: "Since implementation" },
    ],
  },
  {
    id: 6,
    heading: "Token Holder Retention Up 34% — Multi-Chain Gating Layer Live in 6 Weeks",
    quote:
      "ZecurX built a multi-chain gating layer connecting ERC-20 balance thresholds to feature flags in the SaaS platform — with real-time balance monitoring and graceful downgrade UX when token balances dropped below thresholds. Implementation took 6 weeks. The feature increased token holder retention by 34% within 90 days of launch.",
    name: "Head of Product",
    role: "Web3-Native SaaS Analytics Platform (DAO governance token gating)",
    icon: Lock,
    lottie: getCdnUrl("lottie/token_gate.json"),
    metrics: [
      { value: "+34%", label: "Token Holder Retention", sub: "Within 90 days of launch" },
      { value: "6 weeks", label: "Multi-Chain Gating Live", sub: "ERC-20 to feature flags" },
    ],
  },
  {
    id: 7,
    heading: "$1.1M in Assets Frozen Within 72 Hours — Oracle Exploit Forensics Submitted Across Two Jurisdictions",
    quote:
      "A venture-backed DeFi protocol lost $4.2M in an oracle manipulation exploit. ZecurX conducted a full forensic investigation — reconstructing the 14-transaction attack sequence, tracing profits through two bridges and a centralised exchange deposit, and attributing the attack to a cluster of wallets linked to a known threat actor. The forensic report was submitted to law enforcement in two jurisdictions. The exchange froze $1.1M in assets within 72 hours of receiving the report.",
    name: "General Counsel",
    role: "Venture-Backed DeFi Protocol ($4.2M oracle manipulation exploit, asset recovery)",
    icon: Search,
    lottie: getCdnUrl("lottie/forensics.json"),
    metrics: [
      { value: "$1.1M", label: "Assets Frozen", sub: "Within 72 hours of report" },
      { value: "2", label: "Jurisdictions Engaged", sub: "Law enforcement coordination" },
    ],
  },
];

// ── METHODOLOGY STEPS ─────────────────────────────────────────────────────────

const methodologySteps = [
  {
    title: "Threat Modelling",
    desc: "Map attack surface before writing a single line of code.",
  },
  {
    title: "Secure Architecture",
    desc: "Design patterns selected for security properties first.",
  },
  {
    title: "Development",
    desc: "Security-aware engineering with inline expert review.",
  },
  {
    title: "Automated Analysis",
    desc: "Slither, Mythril, Echidna fuzzing on all contract code.",
  },
  {
    title: "Manual Audit",
    desc: "Expert review of all critical paths and economic logic.",
  },
  {
    title: "Formal Verification",
    desc: "Mathematical proof for critical logic and state invariants.",
  },
];

// ── MULTI-CHAIN TOOLING ───────────────────────────────────────────────────────

const chainGroups = [
  {
    icon: "⬡",
    title: "Ethereum & EVM",
    items: [
      "Solidity (0.8.x) — primary smart contract language",
      "OpenZeppelin Standards — audited contract libraries",
      "Hardhat / Foundry — development and testing frameworks",
      "ERC-20, 721, 1155, 2981 — token and royalty standards",
      "Arbitrum · Optimism · Base — Layer 2 deployments",
    ],
  },
  {
    icon: "◎",
    title: "Solana Ecosystem",
    items: [
      "Rust + Anchor Framework — Solana program development",
      "Metaplex NFT Standard — NFT creation and management",
      "SPL Token Program — fungible and non-fungible tokens",
      "Solana Program Library — core on-chain primitives",
      "Phantom / Backpack Integration — wallet connectivity",
    ],
  },
  {
    icon: "◈",
    title: "Other Chains",
    items: [
      "Polygon (PoS + zkEVM) — low-cost EVM deployment",
      "Avalanche (C-Chain) — high-throughput EVM environment",
      "BNB Smart Chain — BSC-native contract deployment",
      "Cosmos / IBC — interchain protocol development",
      "LayerZero, Wormhole — cross-chain bridge integration",
    ],
  },
];

// ── REGULATORY ALIGNMENT ──────────────────────────────────────────────────────

const indiaFrameworks = [
  "CERT-In Cybersecurity Directions — breach reporting obligations for Web3 platforms",
  "PMLA / ED Compliance — transaction tracing supporting AML obligations",
  "DPDPA 2023 — on-chain user data minimisation and privacy architecture",
  "Income Tax Act Section 115BBH — technical documentation for crypto tax compliance",
  "RBI Virtual Digital Assets guidance for payment-adjacent blockchain systems",
  "SEBI consultation framework for digital asset securities",
];

const internationalFrameworks = [
  "FATF Travel Rule — technical implementation for VASPs and crypto exchanges",
  "MiCA (EU) — Markets in Crypto-Assets Regulation compliance architecture",
  "ISO/IEC 27001:2022 — development and audit process alignment",
  "NIST Cybersecurity Framework applied to smart contract risk management",
  "CCSS (Cryptocurrency Security Standard) — custody and key management",
  "SOC 2 Type II — security controls documentation for B2B Web3 products",
];

// ── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function Web3BlockchainPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
      <CreativeNavBar />

      <main className="flex-1 pt-24 pb-12">
        <Web3BlockchainHero />

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
                  The institutional standard for{" "}
                  <span className="text-[#4c69e4]">blockchain security and development</span>
                </h2>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "⬡",
                  title: "Security-Native Architecture",
                  desc: "Every smart contract, wallet integration, and protocol we build is threat-modelled from day one. Security is not an afterthought — it is the architecture. Our developers are also auditors, which means adversarial thinking is embedded in every design decision before a single line of Solidity or Rust is written.",
                },
                {
                  icon: "🔬",
                  title: "Formal Verification Capability",
                  desc: "Beyond standard testing — we apply mathematical formal verification to critical contract logic using Certora Prover and SMTChecker, providing proof-level assurance that your contract behaves exactly as specified under all possible inputs. This is the highest standard of assurance available in blockchain engineering.",
                },
                {
                  icon: "◈",
                  title: "Multi-Chain Engineering",
                  desc: "Native expertise across Ethereum (Solidity/EVM), Solana (Rust/Anchor), Polygon, Avalanche, and BNB Chain — plus Layer 2 deployments on Arbitrum, Optimism, and Base. One team, every production chain, without the handoff risk of engaging multiple specialist contractors.",
                },
                {
                  icon: "✅",
                  title: "Enterprise-Grade Delivery",
                  desc: "ISO 27001-aligned development processes, documented audit trails, full source control, and legal-grade technical documentation — ready for institutional, regulatory, and investor scrutiny. Every engagement produces artefacts that satisfy enterprise procurement, VC due diligence, and regulatory examination requirements.",
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
                  Seven Specialised{" "}
                  <span className="text-[#4c69e4]">Web3 Security & Development Capabilities</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  From smart contract architecture to blockchain forensics — one integrated Web3 security and development practice.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2}>
              <ServiceFeatureGrid items={capabilities} />
            </BlurFade>
          </div>
        </section>

        {/* ── METHODOLOGY ──────────────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10 bg-white/40">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Methodology
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  The ZecurX{" "}
                  <span className="text-[#4c69e4]">Security-First Development Process</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Every engagement follows a structured, repeatable, and documented security process — from concept to formal verification.
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
                  Investor-grade documentation and production-ready code delivered at engagement close — not after a separate remediation sprint.
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
                  Proven Web3 security and development{" "}
                  <span className="text-[#4c69e4]">outcomes</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  How our engagements have prevented exploits, secured treasuries, and recovered stolen assets across the Web3 ecosystem.
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

        {/* ── MULTI-CHAIN TOOLING ───────────────────────────────────── */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Technology Coverage
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Native Expertise Across{" "}
                  <span className="text-[#4c69e4]">Every Production Chain</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Multi-chain engineering capability across every major production blockchain ecosystem.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {chainGroups.map((group, i) => (
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

        {/* ── REGULATORY ALIGNMENT ─────────────────────────────────── */}
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
                  Built to satisfy institutional, legal, and investor-grade requirements across Indian and international regulatory frameworks.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <BlurFade delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">🇮🇳</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      India-Specific Frameworks
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
                    <span className="text-2xl">🌐</span>
                    <h3 className="font-manrope font-bold text-[#0c1a2e] text-xl">
                      International Standards
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
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade delay={0.1}>
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e2d5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Engagement Models
                </span>
                <h2 className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]">
                  Structured to Match Your{" "}
                  <span className="text-[#4c69e4]">Timeline and Delivery Preference</span>
                </h2>
                <p className="text-slate-600 font-inter text-lg">
                  Three commercial structures designed for audit-only, full build, and ongoing protocol security requirements.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Audit-Only",
                  desc: "Fixed-scope smart contract security review — automated and manual analysis, CVSS-scored findings report, remediation guidance and re-check, and investor-grade audit certificate. Typical duration: 2–4 weeks. Ideal for protocols approaching launch that require third-party assurance.",
                },
                {
                  icon: "⚡",
                  title: "Build + Secure",
                  desc: "End-to-end development with security embedded throughout — architecture, development, and audit in one engagement with a single accountable team and no handoff risk. Production deployment support and 30-day post-launch monitoring included. Typical duration: 8–20 weeks.",
                },
                {
                  icon: "🔐",
                  title: "Retainer / Ongoing",
                  desc: "Dedicated Web3 security partner for live protocols — contract monitoring and anomaly alerting, protocol upgrade review on demand, blockchain forensics response SLA, and monthly security briefings. Ideal for protocols with live TVL that require continuous security oversight.",
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
                    Build on-chain.{" "}
                    <span className="text-[#4c69e4]">Build with confidence.</span>
                  </h2>
                  <p className="text-slate-600 font-inter mb-6 max-w-lg mx-auto text-base leading-relaxed">
                    Request a complimentary Web3 security scoping session with a ZecurX blockchain
                    engineer — we will review your contract architecture, identify your highest-risk
                    attack surfaces, and outline the fastest path to a production-ready, audit-certified
                    deployment.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 py-3 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-1px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                    >
                      Get Web3 Security Scoping Session
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