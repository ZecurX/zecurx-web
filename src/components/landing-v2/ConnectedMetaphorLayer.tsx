"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, User, Database } from "lucide-react";
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

    const isLeft = direction === "left";

    return (
        <motion.div
            style={{ opacity, y, x }}
            className={cn(
                "absolute z-0 pointer-events-none flex items-center",
                isLeft ? "flex-row-reverse right-[50%] mr-[-20px]" : "flex-row left-[50%] ml-[-20px]",
                className?.replace(/left-\[.*?\]|right-\[.*?\]/g, "")
            )}
        >
            {/* Connection Line - SVG driven */}
            <svg className="w-32 h-[4px] overflow-visible md:w-48 lg:w-64" viewBox="0 0 100 4">
                <defs>
                    <linearGradient id={`gradient-line-${direction}-${Math.random()}`} x1={isLeft ? "100%" : "0%"} y1="0%" x2={isLeft ? "0%" : "100%"} y2="0%">
                        <stop offset="0%" stopColor="rgba(96, 165, 250, 0.9)" />
                        <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
                    </linearGradient>
                </defs>
                <motion.line
                    x1={isLeft ? "100" : "0"}
                    y1="2"
                    x2={isLeft ? "0" : "100"}
                    y2="2"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Connector Dot at the center line */}
                <circle cx={isLeft ? "100" : "0"} cy="2" r="3" fill="#60a5fa" fillOpacity="1" />
            </svg>

            {/* Connection Node at Card */}
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,1)] shrink-0 z-10" />

            <div className={cn("relative group mx-4", className?.match(/w-\w+/)?.[0])}>
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-xl group-hover:bg-blue-500/20 transition-colors duration-700" />

                {/* Card Body */}
                <div className="relative bg-black/60 border border-blue-500/30 backdrop-blur-md p-5 rounded-xl shadow-2xl">
                    {children}

                    {/* Scanning Line Animation */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-blue-400/50"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function ConnectedMetaphorLayer() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-[4000px] z-20">
            {/* Card 1: User Session (High up) */}
            <FloatingCard
                scrollYRange={[0.08, 0.15]}
                className="top-[700px] w-64"
                direction="left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-white/50 uppercase">Session Active</div>
                        <div className="text-xs font-semibold text-white">usr_8923_adm</div>
                    </div>
                </div>
            </FloatingCard>

            {/* Card 2: Database (Mid Right) */}
            <FloatingCard
                scrollYRange={[0.2, 0.3]}
                className="top-[1600px] w-56"
                direction="right"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Database className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-white/50 uppercase">DB Connection</div>
                        <div className="text-xs font-semibold text-white">Encrypted</div>
                    </div>
                </div>
            </FloatingCard>

            {/* Card 3: Vulnerability (Lower Left) */}
            <FloatingCard
                scrollYRange={[0.4, 0.5]}
                className="top-[2800px] w-72"
                direction="left"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <Shield className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-xs font-semibold text-white">Threat Mitigated</div>
                </div>
                <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                    <motion.div className="h-full bg-green-500" animate={{ width: "100%" }} transition={{ duration: 1 }} />
                </div>
            </FloatingCard>
        </div>
    );
}
