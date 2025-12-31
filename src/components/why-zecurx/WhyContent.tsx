"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Target, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Quote, Users, Award, GitCompare } from "lucide-react";

const testimonials = [
    {
        quote: "ZecurX delivered exceptional quality from UI/UX design to full-stack development. Their VAPT assessment gave us confidence in our platform's security. Truly enterprise-grade service.",
        name: "Gurudev Engicon Pvt. Ltd.",
        role: "Enterprise Client",
        services: "Full-Stack Development, VAPT, Brand Identity"
    },
    {
        quote: "The team transformed our online presence with a beautiful, mobile-first website. Their security hardening and 24/7 support gives us peace of mind.",
        name: "Honey Herbal Beauty Parlour",
        role: "Business Client",
        services: "Web Design, Development, Security"
    },
    {
        quote: "When we engaged ZecurX, it was a complete transformation. Now we've found a partner that helps us engineer resilience rather than just buying tools.",
        name: "Major Financial Institution",
        role: "CISO",
        services: "Security Consulting, Threat Assessment"
    },
    {
        quote: "Their threat-driven approach identified vulnerabilities our previous auditors missed. Professional, thorough, and truly security-focused.",
        name: "Technology Startup",
        role: "CTO",
        services: "Penetration Testing, Security Review"
    }
];

export default function WhyContent() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Testimonial carousel state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextTestimonial, 5000);
        return () => clearInterval(interval);
    }, [isPaused, nextTestimonial]);

    const cardClassName = "relative overflow-hidden bg-muted/10 border border-border/50 p-8 rounded-2xl hover:bg-muted/20 transition-colors";

    return (
        <section ref={containerRef} className="relative w-full py-12 overflow-hidden bg-background text-foreground">
            {/* --- Parallax Background Elements --- */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-32">

                {/* SECTION 1: Overview (Why ZecurX?) */}
                <div id="overview" className="scroll-mt-24">
                    <div className="mb-12 border-l-4 border-blue-500 pl-6">
                        <h2 className="text-4xl font-bold text-foreground">Why ZecurX?</h2>
                        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                            ZecurX protects the people, processes, and technologies that drive modern enterprise. Powered by world-class security expertise.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Threat Driven",
                                desc: "Security informed by how real attackers think, move, and exploit — not assumptions. We map defenses directly to adversary TTPs.",
                                icon: Target
                            },
                            {
                                title: "AI Powered",
                                desc: "Harnesses the power of big data and artificial intelligence to empower your team with instant visibility and automated response.",
                                icon: Cpu
                            },
                            {
                                title: "Unified Platform",
                                desc: "Eliminates complexity with a consolidated security approach that improves visibility and strengthens resilience.",
                                icon: ShieldCheck
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={cardClassName}
                            >
                                <div className="absolute -right-20 -top-20 -bottom-20 w-60 bg-gradient-to-l from-blue-500/5 to-transparent blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <item.icon className="w-10 h-10 text-blue-500 mb-6" />
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: Leadership */}
                <div id="leadership" className="scroll-mt-24">
                    <div className="mb-12 border-l-4 border-blue-500 pl-6">
                        <h2 className="text-4xl font-bold text-foreground">Leadership & Expertise</h2>
                        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                            Led by security professionals with hands-on technical experience, not just managerial oversight.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Technical-First Leadership",
                                desc: "Our leadership team comes from red team operations, secure architecture, and incident response backgrounds.",
                                icon: Users
                            },
                            {
                                title: "Research-Driven Innovation",
                                desc: "We invest in academic partnerships and research initiatives to stay ahead of emerging threats.",
                                icon: BookOpen
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={cardClassName}
                            >
                                <div className="absolute -right-20 -top-20 -bottom-20 w-60 bg-gradient-to-l from-blue-500/5 to-transparent blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <item.icon className="w-10 h-10 text-blue-500 mb-6" />
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 3: Certifications */}
                <div id="certifications" className="scroll-mt-24">
                    <div className="mb-12 border-l-4 border-blue-500 pl-6">
                        <h2 className="text-4xl font-bold text-foreground">Certifications & Compliance</h2>
                        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                            We align with globally recognized security frameworks to ensure trust, compliance, and audit readiness.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: "ISO/IEC 27001",
                                desc: "International standard for information security management systems (ISMS).",
                                category: "Security Management"
                            },
                            {
                                name: "NIST CSF",
                                desc: "Cybersecurity framework for managing and reducing infrastructure risks.",
                                category: "Risk Framework"
                            },
                            {
                                name: "OWASP Top 10",
                                desc: "Standard awareness document for web application security risks.",
                                category: "Application Security"
                            },
                            {
                                name: "CIS Controls",
                                desc: "Prioritized set of actions to protect organizations from cyber attacks.",
                                category: "Security Controls"
                            },
                            {
                                name: "SOC 2 Type II",
                                desc: "Trust service criteria for security, availability, and confidentiality.",
                                category: "Audit Compliance"
                            },
                            {
                                name: "GDPR",
                                desc: "European regulation for data protection and privacy rights.",
                                category: "Data Privacy"
                            },
                            {
                                name: "HIPAA",
                                desc: "US healthcare data protection and privacy requirements.",
                                category: "Healthcare Security"
                            },
                            {
                                name: "PCI DSS",
                                desc: "Payment card industry data security standards for transactions.",
                                category: "Payment Security"
                            }
                        ].map((cert, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="relative overflow-hidden p-6 rounded-2xl bg-muted/10 border border-border/50 hover:bg-muted/20 transition-colors group"
                            >
                                <div className="absolute -right-20 -top-20 -bottom-20 w-60 bg-gradient-to-l from-blue-500/5 to-transparent blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="text-xs font-medium text-blue-500 uppercase tracking-wider">{cert.category}</div>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{cert.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 4: Methodology (The ZecurX Difference) */}
                <div id="methodology" className="scroll-mt-24">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">The ZecurX Difference</h2>
                        <p className="text-muted-foreground mt-2">Technology augmented with deep security expertise</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "World-Class Intelligence",
                                desc: "All data is enriched with integrated threat intelligence to provide a full picture of attacks.",
                                link: "Learn more about Threat Intel",
                                icon: BookOpen
                            },
                            {
                                title: "24/7 Threat Hunting",
                                desc: "Our elite team proactively searches for threats on your behalf, catching what automated tools miss.",
                                link: "Learn more about Services",
                                icon: Target
                            },
                            {
                                title: "Fully Managed Service",
                                desc: "Gain instant security maturity. Our experts configure and operate the solution for you.",
                                link: "Explore Managed Security",
                                icon: ShieldCheck
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`${cardClassName} flex flex-col justify-between min-h-[280px]`}
                            >
                                <div className="absolute -right-20 -top-20 -bottom-20 w-60 bg-gradient-to-l from-blue-500/5 to-transparent blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <card.icon className="w-10 h-10 text-blue-500 mb-6" />
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{card.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                                </div>
                                <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 cursor-pointer transition-colors mt-6">
                                    {card.link} <span className="text-lg">→</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 5: Comparison (3 Reasons + Testimonials) */}
                <div id="comparison" className="scroll-mt-24 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-8">3 reasons to choose ZecurX</h2>
                        <div className="space-y-10">
                            {[
                                {
                                    title: "Better Protection",
                                    desc: "Get protection across the entire threat lifecycle by combining machine learning, AI, and offensive insight in a single solution."
                                },
                                {
                                    title: "Better Performance",
                                    desc: "A single lightweight approach works everywhere preventing friction and ensuring business continuity."
                                },
                                {
                                    title: "Better Value",
                                    desc: "Get better protection while simplifying your stack. An extensible platform that grows with you without adding complexity."
                                }
                            ].map((reason, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground">{reason.title}</h3>
                                        <p className="text-muted-foreground">{reason.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial Carousel */}
                    <div
                        className="relative overflow-hidden bg-muted/30 border border-border/50 rounded-3xl p-8 md:p-10"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="absolute -right-20 -top-20 -bottom-20 w-60 bg-gradient-to-l from-blue-500/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-foreground">What our customers say</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevTestimonial}
                                        className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center text-foreground transition-colors"
                                        aria-label="Previous testimonial"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center text-foreground transition-colors"
                                        aria-label="Next testimonial"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[220px] relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center"
                                    >
                                        <Quote className="w-10 h-10 text-blue-500/30 mx-auto mb-4" />
                                        <p className="text-lg md:text-xl italic text-muted-foreground mb-6 leading-relaxed">
                                            "{testimonials[currentIndex].quote}"
                                        </p>
                                        <div className="font-bold text-foreground">{testimonials[currentIndex].name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                                        <div className="text-xs text-blue-500 mt-2">{testimonials[currentIndex].services}</div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Dots indicator */}
                            <div className="flex justify-center gap-2 mt-6">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                            ? "bg-blue-500 w-6"
                                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                            }`}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50 text-center">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors w-full sm:w-auto">
                                    Get Started with ZecurX
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
