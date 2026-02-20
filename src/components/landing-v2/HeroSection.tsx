"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const fadeBlurUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1, ease: EASE_OUT_EXPO },
    },
};

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
    const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[110vh] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Perimeter Glow — Blue edges + red/warm top center */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Blue edge glow — left */}
                <div
                    className="absolute inset-y-0 left-0 w-[120px]"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(30,80,220,0.15), transparent)",
                    }}
                />
                {/* Blue edge glow — right */}
                <div
                    className="absolute inset-y-0 right-0 w-[120px]"
                    style={{
                        background:
                            "linear-gradient(to left, rgba(30,80,220,0.15), transparent)",
                    }}
                />
                {/* Blue edge glow — bottom */}
                <div
                    className="absolute inset-x-0 bottom-0 h-[120px]"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(30,80,220,0.12), transparent)",
                    }}
                />
                {/* Warm/Red top center glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(180,40,40,0.08) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* Subtle grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundSize: "80px 80px",
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
                }}
            />

            {/* Main Content */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
                className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full will-change-transform"
            >
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center"
                >
                    {/* Headline */}
                    <motion.h1
                        variants={fadeBlurUp}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold font-manrope tracking-[-0.04em] leading-[0.88] text-white"
                    >
                        <span className="block">Security that helps</span>
                        <span
                            className="block mt-2"
                            style={{
                                textShadow:
                                    "0 0 60px rgba(255,255,255,0.25), 0 0 120px rgba(255,255,255,0.08)",
                            }}
                        >
                            you ship faster.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeBlurUp}
                        className="mt-8 md:mt-10 max-w-xl text-lg md:text-xl text-white/50 leading-relaxed font-inter"
                    >
                        ZecurX helps startups and AI teams secure applications, cloud
                        infrastructure, and AI systems.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={fadeBlurUp}
                        className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className="group relative h-14 px-10 rounded-none flex items-center gap-3 bg-white text-black font-manrope font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                        >
                            <span className="relative z-10">Start Protecting</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/book-demo"
                            className="h-14 px-10 flex items-center border border-white/20 text-white/70 font-manrope font-medium text-sm tracking-wide hover:text-white hover:border-white/40 transition-all duration-300"
                        >
                            Talk to Experts
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </section>
    );
}
