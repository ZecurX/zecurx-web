"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Terminal, Cloud, Cpu, ShieldCheck, Zap } from "lucide-react"

const capabilities = [
    {
        title: "Offensive Security & Penetration Testing",
        description:
            "Deep-dive web, API, and infrastructure security testing. We identify and fix complex vulnerabilities before attackers exploit them — not just surface-level scanner results.",
        icon: Terminal,
        href: "/services/offensive-security"
    },
    {
        title: "Cloud & DevSecOps",
        description:
            "Continuous cloud posture management and automated CI/CD pipeline security for AWS, GCP, and Azure environments.",
        icon: Cloud,
        href: "/services/cloud-devsecops"
    },
    {
        title: "Secure AI & LLM Security",
        description:
            "Advanced threat modeling, LLM sandbox integration, and AI abuse testing for secure GenAI applications.",
        icon: Cpu,
        href: "/services/secure-ai-llm"
    },

    {
        title: "Secure Application Development",
        description:
            "Embed security into your development lifecycle — from architecture to production.",
        icon: Terminal,
        href: "/services/secure-app-dev"
    },
    {
        title: "SOC, Detection & Response",
        description:
            "24/7 monitoring, detection, and incident response.",
        icon: Zap,
        href: "/services/soc-detection"
    },
    {
        title: "Compliance & Governance",
        description:
            "SOC 2, ISO 27001, GDPR, and DPDP readiness.",
        icon: ShieldCheck,
        href: "/services/compliance-governance"
    },

    {
        title: "Web3, Blockchain & NFT Development",
        description:
            "Secure smart contracts and decentralized systems with audit-first development.",
        icon: Cpu,
        href: "/services/web3-blockchain-nft"
    },
];

const CornerPlusIcons = () => (
    <>
        <PlusIcon className="absolute -top-3 -left-3" />
        <PlusIcon className="absolute -top-3 -right-3" />
        <PlusIcon className="absolute -bottom-3 -left-3" />
        <PlusIcon className="absolute -bottom-3 -right-3" />
    </>
)

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        className={cn("size-6 text-foreground/30", className)}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
)

const CapabilityCard: React.FC<{
    className?: string
    title: string
    description: string
    icon: React.ElementType
    href: string
}> = ({ className = "", title, description, icon: Icon, href }) => {
    return (
        <Link href={href} className="block group">
           <div
                className={cn(
                    "relative border border-dashed border-border rounded-2xl p-6 md:p-8 bg-card",
                    "flex flex-col justify-between h-full",
                    "min-h-[260px] md:min-h-[300px]",
                    "transition-all duration-300 cursor-pointer",
                    "hover:border-[#4c69e4] hover:shadow-2xl hover:shadow-[#4c69e4]/20 hover:-translate-y-2",
                    className
                )}
            >
                <CornerPlusIcons />

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#4c69e4] group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg md:text-xl font-manrope font-bold text-[#4c69e4] group-hover:text-primary">
                            {title}
                        </h3>
                    </div>

                    <p className="text-muted-foreground font-manrope font-light leading-relaxed text-sm md:text-base">
                        {description}
                    </p>
                </div>

                {/* Strong CTA */}
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#4c69e4]">
                        Explore
                    </span>

                    <div className="w-9 h-9 rounded-full bg-[#4c69e4] flex items-center justify-center shadow-md group-hover:scale-105 transition">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function CapabilitiesBento() {
    return (
        <section id="capabilities" className="bg-background border-y border-border/40">
            <div className="mx-auto container max-w-7xl py-16 md:py-24 px-4 md:px-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {capabilities.map((cap) => (
                        <CapabilityCard
                            key={cap.title}
                            title={cap.title}
                            description={cap.description}
                            icon={cap.icon}
                            href={cap.href}
                            // className={cap.className}
                        />
                    ))}
                </div>

                <div className="max-w-2xl ml-auto text-right px-4 mt-8 lg:-mt-16">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground mb-4">
                        Built for <span className="font-newsreader italic text-[#4c69e4]">performance.</span>
                    </h2>
                    <p className="text-muted-foreground font-manrope font-light text-base md:text-lg leading-relaxed">
                        End-to-end security solutions for modern engineering teams. We don&apos;t just hand you a PDF report — we work alongside your engineers to fix flaws and ship secure code.
                    </p>
                </div>
            </div>
        </section>
    )
}