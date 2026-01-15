"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Target, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Quote, Users, Award, GitCompare, ArrowRight } from "lucide-react";

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

import { Button } from "@/components/ui/button";

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

    const cardClassName = "group relative overflow-hidden bg-gradient-to-b from-muted/50 to-background border border-border/40 p-8 rounded-3xl hover:border-foreground/20 transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5";

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden bg-background text-foreground">
            {/* --- Parallax Background Elements --- */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-40">

                {/* SECTION 1: Overview (Why ZecurX?) */}
                <div id="overview" className="scroll-mt-24">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-manrope font-semibold text-foreground tracking-tight">
                                Engineered for <span className="text-foreground">Resilience</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mt-4 leading-relaxed font-light">
                                ZecurX protects the people, processes, and technologies that drive modern enterprise. Powered by world-class security expertise.
                            </p>
                        </div>
                        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-border to-transparent ml-12 mb-4" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Threat Driven",
                                desc: "Security informed by how real attackers think, move, and exploit — not assumptions.",
                                icon: Target
                            },
                            {
                                title: "AI Powered",
                                desc: "Harnesses the power of big data and artificial intelligence for instant visibility.",
                                icon: Cpu
                            },
                            {
                                title: "Unified Platform",
                                desc: "Eliminates complexity with a consolidated security approach that strengthens resilience.",
                                icon: ShieldCheck
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-manrope font-bold mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: Leadership */}
                <div id="leadership" className="scroll-mt-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div className="sticky top-32">
                            <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground mb-6">Leadership & Expertise</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-light">
                                Led by security professionals with hands-on technical experience, not just managerial oversight. We've been in the trenches.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "Technical-First Leadership",
                                    desc: "Our leadership team comes from red team operations, secure architecture, and incident response backgrounds. We understand the technical reality of defense.",
                                    icon: Users
                                },
                                {
                                    title: "Research-Driven Innovation",
                                    desc: "We invest heavily in academic partnerships and independent research initiatives to stay ahead of emerging threats before they become mainstream.",
                                    icon: BookOpen
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                >
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-manrope font-bold mb-2 text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Certifications */}
                <div id="certifications" className="scroll-mt-24">
                    <div className="mb-16 flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-4xl font-manrope font-semibold text-foreground mb-4">Global Standards</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl font-light">
                            We align with globally recognized security frameworks to ensure trust, compliance, and audit readiness.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                        {[
                            { name: "ISO/IEC 27001", category: "Security Management" },
                            { name: "NIST CSF", category: "Risk Framework" },
                            { name: "OWASP Top 10", category: "Application Security" },
                            { name: "CIS Controls", category: "Security Controls" },
                            { name: "SOC 2 Type II", category: "Audit Compliance" },
                            { name: "GDPR", category: "Data Privacy" },
                            { name: "HIPAA", category: "Healthcare Security" },
                            { name: "PCI DSS", category: "Payment Security" }
                        ].map((cert, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.03 }}
                                className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/[0.05] flex items-center gap-3 cursor-default"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                <span className="text-sm font-medium text-foreground">{cert.name}</span>
                                <span className="text-xs text-muted-foreground border-l border-white/10 pl-3 group-hover:text-foreground/70 transition-colors">{cert.category}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 4: Methodology (The ZecurX Difference) */}
                <div id="methodology" className="scroll-mt-24">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground mb-6">The ZecurX Difference</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl font-light">Technology augmented with deep security expertise. We don't just alert you to problems; we help you fix them.</p>
                    </div>

                    <div className="flex flex-col border-t border-white/10">
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
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative border-b border-white/10 py-12 md:py-16 px-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-6 md:gap-12">
                                        <span className="text-sm font-mono text-primary/50 pt-2">0{i + 1}</span>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-manrope font-medium text-foreground group-hover:text-primary transition-colors mb-4">{item.title}</h3>
                                            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-light group-hover:text-foreground/80 transition-colors">{item.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 md:pl-12">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 5: Comparison (3 Reasons + Testimonials) */}
                <div id="comparison" className="scroll-mt-24 grid lg:grid-cols-2 gap-16 items-center pb-24">
                    <div>
                        <h2 className="text-4xl font-manrope font-bold text-foreground mb-12">Why industry leaders choose ZecurX</h2>
                        <div className="space-y-8">
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
                                <div key={i} className="flex gap-6 group">
                                    <div className="mt-1 w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                        <CheckCircle2 className="w-6 h-6 text-foreground group-hover:text-background transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-foreground transition-colors">{reason.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{reason.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial Carousel */}
                    <div
                        className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-background border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/5"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Decorative Quote Icon */}
                        <Quote className="absolute top-8 right-8 w-24 h-24 text-foreground/5 -rotate-12 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Client Stories</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevTestimonial}
                                        className="w-10 h-10 rounded-full bg-background hover:bg-muted border border-border flex items-center justify-center text-foreground transition-colors shadow-sm cursor-pointer"
                                        aria-label="Previous testimonial"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="w-10 h-10 rounded-full bg-background hover:bg-muted border border-border flex items-center justify-center text-foreground transition-colors shadow-sm cursor-pointer"
                                        aria-label="Next testimonial"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[240px] relative flex flex-col justify-between">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        <p className="text-xl md:text-2xl font-manrope font-medium text-foreground mb-8 leading-relaxed">
                                            "{testimonials[currentIndex].quote}"
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center text-background font-bold text-lg">
                                                {testimonials[currentIndex].name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground text-lg">{testimonials[currentIndex].name}</div>
                                                <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex gap-1.5">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex
                                                ? "bg-foreground w-8"
                                                : "bg-border w-2 hover:bg-foreground/50"
                                                }`}
                                            aria-label={`Go to testimonial ${i + 1}`}
                                        />
                                    ))}
                                </div>
                                <Button className="w-full sm:w-auto px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl h-auto gap-2 text-sm bg-foreground text-background hover:bg-foreground/90">
                                    Start Your Journey
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
