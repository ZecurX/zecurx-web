"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Terminal, Cloud, Cpu, ShieldCheck, Zap } from "lucide-react"

const capabilities = [
    {
        title: "Application Security",
        description:
            "Deep-dive web, API, and source code security testing. We identify and fix complex logic flaws before they affect your users — not just surface-level scanner results.",
        icon: Terminal,
        href: "/services/application-security",
        className: "lg:col-span-3 lg:row-span-2",
    },
    {
        title: "Cloud & DevSecOps",
        description:
            "Continuous cloud posture management and automated CI/CD pipeline security for AWS, GCP, and Azure environments.",
        icon: Cloud,
        href: "/services/cloud-devsecops",
        className: "lg:col-span-2 lg:row-span-2",
    },
    {
        title: "Secure AI Development",
        description:
            "Advanced threat modeling, LLM sandbox integration, and AI abuse testing for secure GenAI applications. We protect your models and AI agents from prompt injection, data poisoning, and unauthorized access — ensuring your intelligent systems remain trustworthy at scale.",
        icon: Cpu,
        href: "/services/secure-ai-development",
        className: "lg:col-span-4 lg:row-span-1",
    },
    {
        title: "Compliance Readiness",
        description:
            "Streamlined pathways to SOC 2, ISO 27001, and DPDP readiness without grinding your engineering team to a halt.",
        icon: ShieldCheck,
        href: "/services/compliance-readiness",
        className: "lg:col-span-2 lg:row-span-1",
    },
    {
        title: "24/7 Security Operations",
        description:
            "Always-on DevSecOps integration with real-time monitoring, incident response, and continuous vulnerability management.",
        icon: Zap,
        href: "/contact",
        className: "lg:col-span-2 lg:row-span-1",
    },
]

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
    visual?: React.ReactNode
}> = ({ className = "", title, description, icon: Icon, href, visual }) => {
    return (
        <div
            className={cn(
                "relative border border-dashed border-border rounded-2xl p-6 md:p-8 bg-card min-h-[200px]",
                "flex flex-col justify-between group transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                className
            )}
        >
            <Link href={href} className="absolute inset-0 z-20" aria-label={title} />
            <CornerPlusIcons />

            {/* Content */}
            <div className="relative z-10 space-y-3">
                {visual && (
                    <div className="w-full mb-2">
                        {visual}
                    </div>
                )}
                <h3 className="text-lg md:text-xl font-manrope font-bold text-[#496ae8] transition-colors">
                    {title}
                </h3>
                <p className="text-muted-foreground font-manrope font-light leading-relaxed text-sm md:text-base">
                    {description}
                </p>
            </div>

            {/* Bottom arrow hint */}
            <div className="relative z-10 mt-4 flex items-center text-primary font-manrope font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </div>
        </div>
    )
}

export default function CapabilitiesBento() {
    return (
        <section id="capabilities" className="bg-background border-y border-border/40">
            <div className="mx-auto container max-w-7xl py-16 md:py-24 px-4 md:px-6">
                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4 md:gap-5">
                    {capabilities.map((cap) => (
                        <CapabilityCard
                            key={cap.title}
                            title={cap.title}
                            description={cap.description}
                            icon={cap.icon}
                            href={cap.href}
                            className={cap.className}
                        />
                    ))}
                </div>

                {/* Section Footer */}
                <div className="max-w-2xl ml-auto text-right px-4 mt-8 lg:-mt-16">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground mb-4">
                        Built for <span className="font-newsreader italic text-[#496ae8]">performance.</span>
                    </h2>
                    <p className="text-muted-foreground font-manrope font-light text-base md:text-lg leading-relaxed">
                        End-to-end security solutions for modern engineering teams. We don&apos;t just hand you a PDF report — we work alongside your engineers to fix flaws and ship secure code.
                    </p>
                </div>
            </div>
        </section>
    )
}
