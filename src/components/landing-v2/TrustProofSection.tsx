"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function TrustProofSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const statRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);

    const statInView = useInView(statRef, { once: true, amount: 0.5 });
    const quoteInView = useInView(quoteRef, { once: true, amount: 0.3 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const statScale = useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]);
    const statOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden py-32 md:py-48"
        >
            {/* Perimeter glow */}
            <PerimeterGlow />

            <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-32 md:space-y-48">
                {/* Trust Statement + Stat */}
                <div ref={statRef} className="text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={statInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-white/30 font-inter text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
                    >
                        We&apos;ve chosen to let our work speak. Our clients range from
                        early-stage startups to enterprise teams. To give you a sense of
                        scope, we&apos;ve secured products serving over
                    </motion.p>

                    <motion.div
                        style={{ scale: statScale, opacity: statOpacity }}
                        className="will-change-transform"
                    >
                        <span
                            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-manrope font-bold text-white tracking-[-0.04em]"
                            style={{
                                textShadow:
                                    "0 0 80px rgba(255,255,255,0.1), 0 0 160px rgba(255,255,255,0.04)",
                            }}
                        >
                            500+
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={statInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-6 text-white/20 font-manrope text-lg tracking-wide"
                    >
                        security assessments delivered.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={statInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-8 text-white/40 font-inter text-base italic"
                    >
                        We don&apos;t showcase logos. We protect them.
                    </motion.p>
                </div>

                {/* Testimonial */}
                <div ref={quoteRef} className="max-w-4xl mx-auto text-center">
                    <motion.blockquote
                        initial={{ opacity: 0, y: 30 }}
                        animate={quoteInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-manrope font-light text-white/80 leading-[1.3] tracking-[-0.01em]">
                            &ldquo;ZecurX didn&apos;t just find vulnerabilities — they helped us
                            build a security culture. Within weeks, our team was shipping
                            faster because we were confident in our security posture. They
                            found critical issues our internal tools missed.&rdquo;
                        </p>
                    </motion.blockquote>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={quoteInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-10 text-white/25 font-inter text-base"
                    >
                        — CTO at a Series B SaaS Company
                    </motion.p>
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
            <div
                className="absolute inset-x-0 bottom-0 h-[60px]"
                style={{
                    background:
                        "linear-gradient(to top, rgba(30,80,220,0.06), transparent)",
                }}
            />
            {/* warm glow behind testimonial */}
            <div
                className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(160,30,30,0.04) 0%, transparent 70%)",
                }}
            />
        </div>
    );
}
