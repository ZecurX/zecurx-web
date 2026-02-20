"use client";

import React, { useRef } from "react";
import { type MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        num: "01",
        title: "Application Security",
        subtitle: "Web, API & Code Review",
        description:
            "We find and fix real-world vulnerabilities before attackers exploit them. Penetration testing, API security, and source code review for applications that need to be bulletproof.",
        tags: ["Web Pentesting", "API Security", "Source Code Review", "Mobile Security"],
        href: "/services/application-security",
    },
    {
        num: "02",
        title: "Cloud & DevSecOps",
        subtitle: "Infrastructure & Pipeline Security",
        description:
            "Cloud misconfiguration and CI/CD security audits. Secure your AWS, GCP, or Azure infrastructure with DevSecOps best practices baked into your deployment pipeline.",
        tags: ["Cloud Security", "CI/CD Hardening", "Kubernetes", "Infrastructure as Code"],
        href: "/services/cloud-devsecops",
    },
    {
        num: "03",
        title: "Secure AI Development",
        subtitle: "LLM & AI System Security",
        description:
            "Build secure AI-powered products. We test for prompt injection, model abuse, data poisoning, and other threats unique to AI/ML systems.",
        tags: ["LLM Security", "AI Threat Modeling", "Prompt Injection", "AI Abuse Testing"],
        href: "/services/secure-ai-development",
    },
    {
        num: "04",
        title: "Compliance Readiness",
        subtitle: "Certifications & Frameworks",
        description:
            "ISO 27001, SOC 2, and DPDP readiness support. We prepare your organization for compliance without slowing down your development velocity.",
        tags: ["ISO 27001", "SOC 2", "DPDP", "Security Policies"],
        href: "/services/compliance-readiness",
    },
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={sectionRef} className="relative w-full h-[500vh] bg-black">
            {/* Sticky Wrapper - Pin the viewport for the entire duration */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden z-20">
                {/* Base Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                <PerimeterGlow />

                {/* Top Glowing Line (Initial Spark) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 z-30">
                    <svg className="w-full h-10 overflow-visible">
                        <motion.path
                            d="M 500 0 L 500 40"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="transparent"
                            style={{
                                pathLength: useTransform(scrollYProgress, [0, 0.05], [0, 1]),
                                opacity: useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 1, 0.8])
                            }}
                            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        />
                    </svg>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start justify-center min-h-[50vh]">
                    {/* Section header - Stationary and focused */}
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.3, 1, 1, 0]),
                        }}
                        className="mb-12 max-w-2xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-px bg-blue-500/50" />
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                Service Capabilities
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-manrope font-medium text-white tracking-tight leading-none">
                            Security that <span className="text-white/30 italic">moves with you.</span>
                        </h2>
                    </motion.div>

                    {/* The Mesh Container - Cards appear here in sequence */}
                    <div className="relative w-full h-[450px]">
                        {/* Vertical Guide Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden lg:block" />

                        {services.map((service, i) => (
                            <ServiceBlock
                                key={i}
                                service={service}
                                index={i}
                                globalProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ServiceBlock({
    service,
    index,
    globalProgress,
}: {
    service: (typeof services)[0];
    index: number;
    globalProgress: MotionValue<number>;
}) {
    const isEven = index % 2 === 0;

    // Each card gets its own dedicated phase in the 500vh scroll
    // 0: 0.05 - 0.25 (Peak 0.15)
    // 1: 0.25 - 0.45 (Peak 0.35)
    // 2: 0.45 - 0.65 (Peak 0.55)
    // 3: 0.65 - 0.85 (Peak 0.75)
    const start = 0.05 + (index * 0.22);
    const end = start + 0.22;
    const peak = start + 0.11;

    // Stationary In-Place Reveal Logic
    const blockOpacity = useTransform(globalProgress, [start, start + 0.04, end - 0.04, end], [0, 1, 1, 0]);
    const blockScale = useTransform(globalProgress, [start, peak, end], [0.98, 1, 0.98]);
    const lineProgress = useTransform(globalProgress, [start, peak], [0, 1]);
    const glowOpacity = useTransform(globalProgress, [start, peak, end], [0, 1, 0.4]);

    // Stationary horizontal stagger (No Y translation to avoid scrolling out of view)
    const offsets = [
        "lg:-translate-x-40",
        "lg:translate-x-48",
        "lg:-translate-x-56",
        "lg:translate-x-40",
    ];

    return (
        <motion.div
            className={cn(
                "absolute inset-0 flex items-center pointer-events-none",
                isEven ? "justify-start" : "justify-end",
            )}
            style={{ opacity: blockOpacity, scale: blockScale }}
        >
            <div className={cn("relative w-full max-w-lg pointer-events-auto px-6 lg:px-0", offsets[index])}>
                {/* Neural Connector Lines */}
                <div className="hidden lg:block absolute top-1/2 w-full h-[300px] pointer-events-none z-0" style={{ transform: "translateY(-50%)" }}>
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Connection to Spine - Travels Center -> Box */}
                        <motion.path
                            d={isEven ? "M 500 150 L 220 150" : "M 500 150 L 780 150"}
                            stroke="#1e3a8a"
                            strokeWidth="0.5"
                            fill="transparent"
                            style={{ opacity: 0.2 }}
                        />
                        <motion.path
                            d={isEven ? "M 500 150 L 220 150" : "M 500 150 L 780 150"}
                            stroke="#3b82f6"
                            strokeWidth="4"
                            fill="transparent"
                            filter="url(#glow)"
                            style={{ pathLength: lineProgress, opacity: useTransform(glowOpacity, [0, 1], [0, 0.6]) }}
                        />
                        <motion.path
                            d={isEven ? "M 500 150 L 220 150" : "M 500 150 L 780 150"}
                            stroke="#60a5fa"
                            strokeWidth="1.5"
                            fill="transparent"
                            style={{ pathLength: lineProgress, opacity: glowOpacity }}
                        />
                        {/* Data Head Pulse */}
                        <motion.circle
                            cx={useTransform(lineProgress, [0, 1], [500, isEven ? 220 : 780])}
                            cy="150"
                            r="2.5"
                            fill="#fff"
                            style={{ opacity: glowOpacity, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))" }}
                        />
                    </svg>
                </div>

                {/* The Card */}
                <motion.div
                    className={cn(
                        "relative p-8 md:p-12 group cursor-default overflow-hidden",
                        "bg-zinc-900 border border-zinc-800",
                        "hover:border-blue-500/40 transition-colors duration-700"
                    )}
                >
                    {/* Inner Glow Layer */}
                    <motion.div
                        className="absolute inset-0 bg-blue-500/5 pointer-events-none"
                        style={{ opacity: useTransform(glowOpacity, [0, 1], [0, 0.2]) }}
                    />

                    <div className="relative mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-2xl font-mono font-bold text-white/5">
                                {service.num}
                            </span>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                                <ArrowUpRight className="w-3 h-3 text-white/30" />
                            </div>
                        </div>
                        <motion.h3
                            className="text-2xl md:text-3xl font-manrope font-semibold text-white tracking-tight leading-none"
                            style={{ color: useTransform(glowOpacity, [0, 1], ["rgba(255,255,255,0.7)", "rgba(255,255,255,1)"]) }}
                        >
                            {service.title}
                        </motion.h3>
                    </div>

                    <p className="relative text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-manrope">
                        {service.description}
                    </p>

                    <ServiceTags tags={service.tags} glowOpacity={glowOpacity} />
                </motion.div>
            </div>
        </motion.div>
    );
}

function ServiceTags({ tags, glowOpacity }: { tags: string[]; glowOpacity: MotionValue<number> }) {
    const dotOpacity = useTransform(glowOpacity, [0.5, 1], [0.2, 0.8]);

    return (
        <div className="relative flex flex-wrap gap-x-4 gap-y-2">
            {tags.map((tag, i) => (
                <div key={i} className="flex items-center gap-2">
                    <motion.div
                        className="w-1 h-1 rounded-full bg-blue-500"
                        style={{ opacity: dotOpacity }}
                    />
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{tag}</span>
                </div>
            ))}
        </div>
    );
}

function PerimeterGlow() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -left-[10%] top-1/4 w-[40%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
            <div className="absolute -right-[10%] bottom-1/4 w-[40%] h-[50%] bg-blue-900/5 blur-[120px] rounded-full" />
        </div>
    );
}
