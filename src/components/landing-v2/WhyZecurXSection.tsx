"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const beliefs = [
    {
        num: "01",
        title: "Understanding Attacker Behavior",
        desc: "Security informed by how attackers actually think, move, and exploit systems.",
    },
    {
        num: "02",
        title: "Engineering Resilient Systems",
        desc: "Building security into the DNA of your technology, not adding it as an afterthought.",
    },
    {
        num: "03",
        title: "Embedding Security Culture",
        desc: "Integrating security into technology and culture for sustainable protection.",
    },
];

export default function WhyZecurXSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section className="relative w-full overflow-hidden py-24 md:py-32">
            {/* Perimeter glow */}
            <PerimeterGlow />

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 space-y-24 md:space-y-32">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] block mb-6">
                            Who We Are
                        </span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-manrope font-light text-white leading-[1.05] tracking-[-0.03em]">
                            Trust.{" "}
                            <span
                                className="font-semibold"
                                style={{
                                    textShadow:
                                        "0 0 40px rgba(255,255,255,0.12), 0 0 80px rgba(255,255,255,0.04)",
                                }}
                            >
                                Depth.
                                <br />
                                Expertise.
                            </span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-lg text-white/40 font-inter leading-relaxed">
                            ZecurX operates at the intersection of{" "}
                            <span className="text-white/70">
                                offensive security, defensive strategy, and secure innovation
                            </span>
                            . Our work is threat-driven, intelligence-led, and focused on
                            reducing real organizational risk.
                        </p>
                    </motion.div>
                </div>

                {/* Beliefs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
                    {beliefs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.7,
                                delay: 0.3 + i * 0.15,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="bg-black p-8 md:p-10 group hover:bg-white/[0.02] transition-colors duration-500"
                        >
                            <div className="text-5xl md:text-6xl font-manrope font-bold text-white/[0.04] mb-6 group-hover:text-white/[0.08] transition-colors duration-500">
                                {item.num}
                            </div>
                            <h3 className="text-lg font-manrope font-medium text-white mb-4">
                                {item.title}
                            </h3>
                            <p className="text-sm text-white/30 leading-relaxed font-inter group-hover:text-white/50 transition-colors duration-500">
                                {item.desc}
                            </p>
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
                        "linear-gradient(to right, rgba(30,80,220,0.08), transparent)",
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-[80px]"
                style={{
                    background:
                        "linear-gradient(to left, rgba(30,80,220,0.08), transparent)",
                }}
            />
            {/* Subtle center glow */}
            <div
                className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px]"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(30,80,220,0.03) 0%, transparent 70%)",
                }}
            />
        </div>
    );
}
