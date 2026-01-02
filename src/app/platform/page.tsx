"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const platformCapabilities = [
    {
        id: "endpoint-security",
        title: "Endpoint Security",
        tagline: "Behavior-Based Protection",
        description: "Continuous endpoint visibility and behavior-based protection rather than relying only on signatures. AI models detect abnormal behavior, lateral movement, and zero-day activity.",
        outcomes: ["Reduced breach probability", "Faster incident containment", "Lower SOC overhead"],
    },
    {
        id: "cloud-security",
        title: "Cloud Security",
        tagline: "Multi-Cloud Visibility",
        description: "Unified visibility across multi-cloud and hybrid environments with policy-driven security controls. AI continuously analyzes cloud posture and auto-remediates risks.",
        outcomes: ["Secure cloud adoption", "Reduced misconfigurations", "Stronger governance"],
    },
    {
        id: "identity-security",
        title: "Identity Security",
        tagline: "Zero Trust Access",
        description: "Focus on identity behavior, privilege usage, and access risk—not just authentication. AI detects identity abuse and triggers automated access restrictions.",
        outcomes: ["Reduced identity attacks", "Improved access governance", "Zero Trust posture"],
    },
    {
        id: "application-security",
        title: "Application Security",
        tagline: "Secure SDLC",
        description: "Security integrated across the application lifecycle, from development to production. AI prioritizes exploitable risks and automates remediation recommendations.",
        outcomes: ["Faster app releases", "Reduced vulnerabilities", "DevSecOps maturity"],
    },
    {
        id: "threat-intelligence",
        title: "Threat Intelligence",
        tagline: "Proactive Hunting",
        description: "Global threat intelligence combined with proactive threat hunting tailored to your organization. AI correlates threat data to surface hidden threats early.",
        outcomes: ["Early attack detection", "Reduced dwell time", "Threat readiness"],
    },
    {
        id: "ai-detection",
        title: "AI Detection & Response",
        tagline: "ML-Powered Analytics",
        description: "High-confidence detections with contextual intelligence, not alert volume. AI-driven correlation reduces false positives and automates response actions.",
        outcomes: ["Faster incident response", "Reduced alert fatigue", "Higher SOC efficiency"],
    },
    {
        id: "security-automation",
        title: "Security Automation",
        tagline: "SOAR Capabilities",
        description: "Automation embedded across detection, investigation, and response workflows. AI-driven playbooks automate repetitive tasks for strategic focus.",
        outcomes: ["Lower operational costs", "Faster response cycles", "Scalable operations"],
    },
    {
        id: "data-protection",
        title: "Data Protection",
        tagline: "DLP & Encryption",
        description: "Data-centric security with visibility into data usage, movement, and exposure. AI identifies abnormal data access and enforces protection policies.",
        outcomes: ["Reduced data leakage", "Regulatory compliance", "Customer trust"],
    },
];

export default function PlatformPage() {
    const [mounted, setMounted] = useState(false);
    const [activeCapability, setActiveCapability] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle hash navigation - runs on every hash change
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const index = platformCapabilities.findIndex(c => `#${c.id}` === hash);
                if (index !== -1) {
                    setActiveCapability(index);
                }
            }
        };

        // Handle initial hash
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Also check on popstate for back/forward navigation
        window.addEventListener('popstate', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    }, []);

    const gridColor = mounted
        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')
        : 'transparent';

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
                                     linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                }}
            />

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] dark:bg-blue-500/10" />
            </div>

            <CreativeNavBar />

            {/* Hero Header */}
            <section className="pt-32 pb-6 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block"
                    >
                        Platform Capabilities
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-8"
                    >
                        Unified. <br />
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                            Intelligent. Secure.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl"
                    >
                        Enterprise security platform protecting modern organizations—powered by AI and automation.
                    </motion.p>
                </div>
            </section>

            {/* Interactive Capabilities Section */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-16">

                        {/* Left: Navigation List */}
                        <div className="lg:sticky lg:top-32 lg:self-start">
                            <div className="space-y-1">
                                {platformCapabilities.map((capability, index) => (
                                    <button
                                        key={capability.id}
                                        id={capability.id}
                                        onMouseEnter={() => setActiveCapability(index)}
                                        onClick={() => setActiveCapability(index)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${activeCapability === index
                                            ? 'bg-muted border border-border'
                                            : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-manrope font-bold transition-colors ${activeCapability === index ? 'text-primary' : 'text-muted-foreground'
                                                }`}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className={`font-manrope font-medium transition-colors ${activeCapability === index ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                                }`}>
                                                {capability.title}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Content Panel */}
                        <div className="min-h-[500px]">
                            <motion.div
                                key={activeCapability}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="p-8 md:p-12 rounded-3xl bg-muted/50 backdrop-blur-sm border border-border"
                            >
                                <p className="text-primary font-manrope font-semibold tracking-widest text-xs uppercase mb-4">
                                    {platformCapabilities[activeCapability].tagline}
                                </p>

                                <h2 className="text-4xl md:text-5xl font-manrope font-medium text-foreground mb-6 leading-tight">
                                    {platformCapabilities[activeCapability].title}
                                </h2>

                                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                                    {platformCapabilities[activeCapability].description}
                                </p>

                                {/* Outcomes */}
                                <div className="space-y-3">
                                    <p className="text-xs font-manrope font-semibold tracking-widest text-muted-foreground uppercase mb-4">
                                        Enterprise Outcomes
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {platformCapabilities[activeCapability].outcomes.map((outcome, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm text-foreground/80"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                {outcome}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Large Number Indicator */}
                                <div className="absolute top-8 right-8 md:top-12 md:right-12 opacity-5">
                                    <span className="text-[120px] md:text-[180px] font-manrope font-bold text-foreground leading-none">
                                        {String(activeCapability + 1).padStart(2, '0')}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 py-16 border-t border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { value: "8", label: "Security Capabilities" },
                            { value: "24/7", label: "AI Monitoring" },
                            { value: "99.9%", label: "Threat Detection" },
                            { value: "<4hr", label: "Response SLA" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-2">
                            Ready to explore the platform?
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            Schedule a demo to see our security capabilities in action.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Request Demo
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
