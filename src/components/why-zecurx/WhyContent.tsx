"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, ChevronRight, Quote, ArrowRight
} from "lucide-react";
import Link from "next/link";

const testimonials = [
    {
        quote: "ZecurX delivered exceptional quality from UI/UX design to full-stack development. Their VAPT assessment gave us confidence in our platform's security. Truly enterprise-grade service.",
        name: "Gurudev Engicon Pvt. Ltd.",
        role: "Enterprise Client",
    },
    {
        quote: "The team transformed our online presence with a beautiful, mobile-first website. Their security hardening and 24/7 support gives us peace of mind.",
        name: "Honey Herbal Beauty Parlour",
        role: "Business Client",
    },
    {
        quote: "Their threat-driven approach identified vulnerabilities our previous auditors missed. Professional, thorough, and truly security-focused.",
        name: "Technology Startup",
        role: "CTO",
    }
];

const engagementPhases = [
    {
        step: "01",
        title: "Discovery & Threat Modeling",
        desc: "We don't just run scans. We learn your architecture, business logic, and threat model. We identify critical assets and potential attack vectors specific to your stack."
    },
    {
        step: "02",
        title: "Deep-Dive Assessment",
        desc: "Our engineers perform manual penetration testing and code review. We simulate real-world attacks (BOLA, IDOR, Injection) that automated tools miss."
    },
    {
        step: "03",
        title: "Reporting & Remediation",
        desc: "You get a developer-friendly report with reproduction steps and code fixes. We don't just dump a PDF; we walk your engineering team through the fixes."
    },
    {
        step: "04",
        title: "Verification Retest",
        desc: "After you patch, we verify. We ensure the vulnerabilities are truly closed and no regressions were introduced."
    }
];

const securityBundles = [
    {
        name: "Startup Pack",
        tagline: "For early-stage teams",
        description: "Essential security for seed to Series A startups. Get audit-ready without slowing down development.",
        features: [
            "Web/Mobile App Penetration Test",
            "Cloud Configuration Review",
            "Developer Security Training",
            "Compliance Readiness Check"
        ]
    },
    {
        name: "AI Product Pack",
        tagline: "For LLM-powered apps",
        description: "Specialized security for AI applications. Prompt injection, model security, and responsible AI practices.",
        features: [
            "LLM Security Assessment",
            "Prompt Injection Testing",
            "RAG Pipeline Review",
            "AI Risk Documentation"
        ]
    },
    {
        name: "SME Essentials",
        tagline: "For growing businesses",
        description: "Comprehensive security for established SMEs. Regular assessments, compliance support, and security advisory.",
        features: [
            "Quarterly Security Assessments",
            "ISO 27001 / SOC 2 Prep",
            "Incident Response Planning",
            "Virtual CISO Advisory"
        ]
    }
];

const whatWeDontDo = [
    "Sell endpoint agents or antivirus software",
    "Operate 24/7 SOC or SIEM monitoring services",
    "Provide managed IT support or helpdesk",
    "Resell third-party security hardware"
];

export default function WhyContent() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, _setIsPaused] = useState(false);

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

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden bg-background text-foreground">
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-32">

                <div id="approach" className="scroll-mt-24 border-t border-white/5 pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <h2 className="text-3xl font-bold text-foreground mb-6 leading-tight">
                                    Our <br />
                                    <span className="text-muted-foreground">Approach</span>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                    Security that fits how modern teams actually work. We test like attackers, not auditors.
                                </p>
                                <div className="hidden lg:block w-12 h-1 bg-primary mb-8" />
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-col space-y-12">
                            <div className="group border-l-2 border-primary/20 pl-8">
                                <h3 className="text-xl font-bold text-foreground mb-3">Real-World Attack Simulation</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    We test like actual attackers. We perform manual exploitation, business logic testing, and complex attack chaining that automated scanners simply cannot find.
                                </p>
                            </div>
                            <div className="group border-l-2 border-primary/20 pl-8">
                                <h3 className="text-xl font-bold text-foreground mb-3">Developer-Friendly Reporting</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    We speak your language. Our reports focus on reproduction steps, root cause analysis, and code-level remediation advice that your engineers can implement immediately.
                                </p>
                            </div>
                            <div className="group border-l-2 border-primary/20 pl-8">
                                <h3 className="text-xl font-bold text-foreground mb-3">Risk-Based Prioritization</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    Not all bugs are critical. We help you prioritize fixes based on real exploitability and business impact, so you focus on what actually matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="engagement" className="scroll-mt-24 border-t border-white/5 pt-24">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">How We Engage</h2>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            A transparent, structured process designed to get you from assessment to secure deployment efficiently.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {engagementPhases.map((phase, i) => (
                            <div key={i} className="relative">
                                {i < engagementPhases.length - 1 && (
                                    <div className="hidden lg:block absolute top-6 -right-4 w-[1px] h-16 bg-white/10" />
                                )}
                                
                                <div className="flex flex-col h-full p-6 rounded-2xl bg-muted/5 border border-white/5 hover:border-primary/20 transition-colors">
                                    <span className="text-4xl font-mono font-bold text-primary/20 mb-6">{phase.step}</span>
                                    <h3 className="text-lg font-bold text-foreground mb-3">{phase.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {phase.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="bundles" className="scroll-mt-24 border-t border-white/5 pt-24">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Security Bundles</h2>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            Packaged engagements designed for specific needs. Clear scope, clear value.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {securityBundles.map((bundle, i) => (
                            <div
                                key={i}
                                className="flex flex-col p-8 rounded-2xl bg-muted/10 border border-white/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <h3 className="text-2xl font-bold text-foreground mb-2">{bundle.name}</h3>
                                <p className="text-sm text-primary font-medium mb-6 uppercase tracking-wide">{bundle.tagline}</p>
                                <p className="text-muted-foreground leading-relaxed mb-8 flex-1 border-b border-white/5 pb-8">
                                    {bundle.description}
                                </p>
                                
                                <ul className="space-y-4">
                                    {bundle.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-foreground/80">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="what-we-dont-do" className="scroll-mt-24 border-t border-white/5 pt-24">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">What We Don&apos;t Do</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                We believe in specialization. To maintain high quality, we explicitly do <strong>not</strong> offer these services:
                            </p>
                            <ul className="space-y-4">
                                {whatWeDontDo.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
                            <h3 className="text-xl font-bold text-foreground mb-4">What We Excel At</h3>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                We focus 100% on **offensive security assessment** and **security engineering**. We help you find bugs and fix them. That&apos;s it. No product reselling, no managed services fluff.
                            </p>
                            <Link href="/services" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
                                Explore Our Services <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div id="testimonials" className="scroll-mt-24 pb-24 border-t border-white/5 pt-24">
                    <div className="relative overflow-hidden bg-gradient-to-br from-muted/10 to-background border border-white/10 rounded-3xl p-8 md:p-12">
                        <Quote className="absolute top-8 right-8 w-24 h-24 text-foreground/5 -rotate-12 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Client Stories</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevTestimonial}
                                        className="w-10 h-10 rounded-full bg-background/50 hover:bg-background border border-white/10 flex items-center justify-center text-foreground transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="w-10 h-10 rounded-full bg-background/50 hover:bg-background border border-white/10 flex items-center justify-center text-foreground transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[180px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <p className="text-xl md:text-3xl font-light text-foreground mb-8 leading-relaxed">
                                            &quot;{testimonials[currentIndex].quote}&quot;
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
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
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
