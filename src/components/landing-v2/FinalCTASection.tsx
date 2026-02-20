"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const glowIntensity = useTransform(scrollYProgress, [0.2, 0.5], [0.08, 0.2]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden py-32"
        >
            {/* Intensified perimeter glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute inset-y-0 left-0 w-[150px]"
                    style={{
                        opacity: glowIntensity,
                        background:
                            "linear-gradient(to right, rgba(30,80,220,1), transparent)",
                    }}
                />
                <motion.div
                    className="absolute inset-y-0 right-0 w-[150px]"
                    style={{
                        opacity: glowIntensity,
                        background:
                            "linear-gradient(to left, rgba(30,80,220,1), transparent)",
                    }}
                />
                <motion.div
                    className="absolute inset-x-0 bottom-0 h-[150px]"
                    style={{
                        opacity: glowIntensity,
                        background:
                            "linear-gradient(to top, rgba(30,80,220,1), transparent)",
                    }}
                />
                <motion.div
                    className="absolute inset-x-0 top-0 h-[100px]"
                    style={{
                        opacity: glowIntensity,
                        background:
                            "linear-gradient(to bottom, rgba(160,30,30,0.8), transparent)",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-manrope font-medium text-white tracking-[-0.03em] leading-[1.05]"
                        style={{
                            textShadow:
                                "0 0 80px rgba(255,255,255,0.15), 0 0 160px rgba(255,255,255,0.05)",
                        }}
                    >
                        Ready to secure
                        <br />
                        your next release?
                    </h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 text-lg text-white/35 font-inter max-w-lg mx-auto"
                    >
                        Book a demo and discover how ZecurX can help you ship faster,
                        without compromising on security.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className="group h-14 px-10 flex items-center gap-3 bg-white text-black font-manrope font-semibold text-sm tracking-wide hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300"
                        >
                            <span>Start Protecting</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/book-demo"
                            className="h-14 px-10 flex items-center gap-2 border border-white/20 text-white/60 font-manrope text-sm hover:text-white hover:border-white/40 transition-all duration-300"
                        >
                            Book a Demo
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
