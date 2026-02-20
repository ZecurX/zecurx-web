"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Building2, Landmark, GraduationCap, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
    {
        id: "enterprise",
        name: "Enterprises",
        desc: "Comprehensive security for large-scale organizations managing sensitive data and critical infrastructure.",
        icon: Building2,
    },
    {
        id: "gov",
        name: "Government & Public Sector",
        desc: "Compliance-driven security for critical public infrastructure and citizen data protection.",
        icon: Landmark,
    },
    {
        id: "edu",
        name: "Educational Institutions",
        desc: "Protecting research data, student privacy, and academic intellectual property.",
        icon: GraduationCap,
    },
    {
        id: "tech",
        name: "Technology Startups & SaaS",
        desc: "Secure-by-design architecture for high-growth tech companies building the future.",
        icon: Rocket,
    },
];

export default function IndustriesSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });

    return (
        <section className="relative w-full py-24 md:py-32">
            {/* Perimeter glow */}
            <PerimeterGlow />

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 md:mb-24"
                >
                    <span className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] block mb-6">
                        Industries
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-medium text-white tracking-[-0.03em] leading-[1.1]">
                        We protect those
                        <br />
                        <span className="text-white/40">who build what matters.</span>
                    </h2>
                </motion.div>

                {/* Industry Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
                    {industries.map((ind, i) => (
                        <motion.div
                            key={ind.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.7,
                                delay: 0.2 + i * 0.12,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="relative"
                        >
                            {/* Connector Line - Simplified: Connect Inner Edge to Center Gap */}
                            <div className={cn(
                                "hidden md:block absolute top-[40px] w-0 h-0 overflow-visible z-20 pointer-events-none",
                                i % 2 === 0 ? "right-[-20px]" : "left-[-20px]" // Position at the gap edge
                            )}>
                                <svg className="overflow-visible" width="0" height="0">
                                    <defs>
                                        <linearGradient id={`pulse-ind-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                                        </linearGradient>
                                    </defs>

                                    {/* Base Line */}
                                    <motion.line
                                        x1="0" y1="0"
                                        x2={i % 2 === 0 ? "40" : "-40"}
                                        y2="0"
                                        stroke="#1e3a8a"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                                    />

                                    {/* Glowing Pulse */}
                                    <motion.line
                                        x1="0" y1="0"
                                        x2={i % 2 === 0 ? "40" : "-40"}
                                        y2="0"
                                        stroke={`url(#pulse-ind-${i})`}
                                        strokeWidth="3"
                                        initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
                                        animate={isInView ? { pathLength: 1, opacity: [0, 1, 0], pathOffset: [0, 1] } : {}}
                                        transition={{
                                            duration: 2,
                                            ease: "easeInOut",
                                            repeat: Infinity,
                                            repeatDelay: 1.5,
                                            delay: 0.5 + i * 0.2
                                        }}
                                    />

                                    <circle cx="0" cy="0" r="3" fill="#60a5fa" />
                                </svg>
                            </div>

                            <Link
                                href={`/industries?tab=${ind.id}`}
                                className="group relative block bg-black p-8 md:p-12 min-h-[280px] md:min-h-[320px] flex flex-col justify-between hover:bg-white/[0.02] transition-colors duration-500"
                            >
                                {/* Icon */}
                                <div className="mb-8">
                                    <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors duration-500">
                                        <ind.icon className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors duration-500" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-xl md:text-2xl font-manrope font-medium text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                        {ind.name}
                                    </h3>
                                    <p className="text-white/30 text-sm leading-relaxed font-inter mb-6 max-w-sm group-hover:text-white/50 transition-colors duration-500">
                                        {ind.desc}
                                    </p>
                                    <div className="flex items-center gap-2 text-white/20 group-hover:text-white/60 transition-colors duration-300">
                                        <span className="text-xs font-mono tracking-wide uppercase">
                                            Explore
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PerimeterGlow() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <div
                className="absolute inset-y-0 left-0 w-[80px]"
                style={{
                    background:
                        "linear-gradient(to right, rgba(30,80,220,0.1), transparent)",
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-[80px]"
                style={{
                    background:
                        "linear-gradient(to left, rgba(30,80,220,0.1), transparent)",
                }}
            />
        </div>
    );
}
