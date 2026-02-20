"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Key, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
    children: React.ReactNode;
    className?: string;
    scrollYRange: [number, number];
    parallaxOffset?: number;
    direction?: "left" | "right";
}

function FloatingCard({ children, className, scrollYRange, parallaxOffset = 50, direction = "left" }: FloatingCardProps) {
    const { scrollYProgress } = useScroll();

    // Fade in and out based on range
    const opacity = useTransform(
        scrollYProgress,
        [scrollYRange[0] - 0.05, scrollYRange[0], scrollYRange[1], scrollYRange[1] + 0.05],
        [0, 1, 1, 0]
    );

    // Parallax movement
    const y = useTransform(
        scrollYProgress,
        [scrollYRange[0], scrollYRange[1]],
        [parallaxOffset, -parallaxOffset]
    );

    // Horizontal movement
    const x = useTransform(
        scrollYProgress,
        [scrollYRange[0], scrollYRange[1]],
        [direction === "left" ? -20 : 20, 0]
    );

    // Determine connection points
    const isLeft = direction === "left";

    return (
        <motion.div
            style={{ opacity, y, x }}
            className={cn(
                "absolute z-0 pointer-events-none flex items-center",
                isLeft ? "flex-row-reverse right-[50%] mr-[-20px]" : "flex-row left-[50%] ml-[-20px]",
                // We remove specific left/right positioning from props when using this centered layout
                className?.replace(/left-\[.*?\]|right-\[.*?\]/g, "")
            )}
        >
            {/* Connection Line - SVG driven */}
            <svg className="w-32 h-[2px] overflow-visible md:w-48 lg:w-64" viewBox="0 0 100 2">
                <defs>
                    <linearGradient id={`gradient-line-${direction}`} x1={isLeft ? "100%" : "0%"} y1="0%" x2={isLeft ? "0%" : "100%"} y2="0%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                </defs>
                <motion.line
                    x1={isLeft ? "100" : "0"}
                    y1="1"
                    x2={isLeft ? "0" : "100"}
                    y2="1"
                    stroke={`url(#gradient-line-${direction})`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Connector Dot at the center line */}
                <circle cx={isLeft ? "100" : "0"} cy="1" r="1.5" fill="#3b82f6" fillOpacity="0.8" />
            </svg>

            {/* Connection Node at Card */}
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0 z-10" />

            <div className={cn("relative group mx-4", className?.match(/w-\w+/)?.[0])}>
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-xl group-hover:bg-blue-500/20 transition-colors duration-700" />

                {/* Card Body */}
                <div className="relative bg-black/40 border border-blue-500/20 backdrop-blur-md p-6 rounded-xl shadow-2xl">
                    {children}

                    {/* Scanning Line Animation */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-blue-400/30"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function MetaphorLayer() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-[4000px]">
            {/* Card 1: Leaked Credential (Narrative Section) */}
            <FloatingCard
                scrollYRange={[0.08, 0.15]}
                className="top-[800px] left-[15%] w-72"
                direction="left"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <User className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Compromised Asset</div>
                        <div className="text-sm font-manrope font-semibold text-white/90">admin_session_01</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-red-500/50"
                            animate={{ width: ["100%", "90%"] }}
                        />
                    </div>
                    <div className="text-[10px] font-mono text-white/20">STATUS: EXFILTRATED</div>
                </div>
            </FloatingCard>

            {/* Card 2: AWS Key (Services Section) */}
            <FloatingCard
                scrollYRange={[0.2, 0.35]}
                className="top-[1800px] right-[12%] w-64"
                direction="right"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Key className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Secret Scanned</div>
                        <div className="text-sm font-manrope font-semibold text-white/90">AKIA...4XJ</div>
                    </div>
                </div>
                <div className="p-3 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-green-400/70">
                    SECURE_KEY_DETECTED
                </div>
            </FloatingCard>

            {/* Card 3: Vulnerability Report (Trust Section) */}
            <FloatingCard
                scrollYRange={[0.45, 0.6]}
                className="top-[3200px] left-[10%] w-80"
                direction="left"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Assessment Report</div>
                        <div className="text-sm font-manrope font-semibold text-white/90">Vulnerability Resolved</div>
                    </div>
                </div>
                <p className="text-xs text-white/40 leading-relax font-inter">
                    CVE-2024-3829: Zero-day exploit mitigated in production within 45 minutes of detection.
                </p>
            </FloatingCard>
        </div>
    );
}
