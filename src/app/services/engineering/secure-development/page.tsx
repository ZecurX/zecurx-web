"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';

export default function SecureDevelopmentPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-block mb-6">
                            <span className="text-xs font-mono font-medium text-primary tracking-widest uppercase border-b border-primary/20 pb-1">
                                Engineering / 01
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                            Secure by Design. <br />
                            <span className="text-foreground/80">Resilient by Default.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            Embed security into the DNA of your applications. We help you shift left, reducing remediation costs and building trust from the first line of code.
                        </p>
                        
                        <div className="mt-10">
                            <ServiceHeroEmailCapture serviceName="Secure Development" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-8">
                                Flawless Code, Faster Delivery
                            </h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    Trying to &quot;bolt on&quot; security at the end of the development lifecycle is costly and ineffective. Modern agility demands that security travels at the speed of DevOps.
                                </p>
                                <p>
                                    ZecurX integrates robust security practices into every phase of your SDLC. From threat modeling during architecture design to automated SAST/DAST in your CI pipelines, we ensure your software is hardened against attacks before it ever reaches production.
                                </p>
                            </div>
                        </div>
                        
                        {/* SDLC Visual replaced with Metrics for consistency with other pages, or custom text-based visual? 
                            The user wants "Pixel-Perfect" and "No Icons".
                            I'll use StatMetric or a clean text list.
                            The previous file had a custom SDLC visual. I'll replace it with StatMetrics for consistency or a clean text visual.
                            I'll use a clean text visual.
                        */}
                        <div className="relative p-8 rounded-3xl border border-border bg-muted/5">
                            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground mb-6 tracking-widest">
                                <span>PHASE_01 // PLAN</span>
                                <span>PHASE_05 // DEPLOY</span>
                            </div>
                            <div className="h-1 bg-border rounded-full overflow-hidden relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-foreground/10 to-foreground/50 w-3/4" />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-baseline gap-4 p-4 rounded-xl bg-background border border-border/50">
                                    <span className="font-mono text-xs text-primary">01</span>
                                    <span className="font-semibold text-foreground">Threat Modeling & Design Review</span>
                                </div>
                                <div className="flex items-baseline gap-4 p-4 rounded-xl bg-background border border-border/50">
                                    <span className="font-mono text-xs text-primary">02</span>
                                    <span className="font-semibold text-foreground">Secure Code Review & SAST</span>
                                </div>
                                <div className="flex items-baseline gap-4 p-4 rounded-xl bg-background border border-border/50">
                                    <span className="font-mono text-xs text-primary">03</span>
                                    <span className="font-semibold text-foreground">Automated DAST & Compliance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Services</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">SDLC Integration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="Threat Modeling"
                            description="Identify architectural flaws and design vulnerabilities before a single line of code is written."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={2}
                            title="Secure Code Review"
                            description="Manual and automated analysis of source code to identify logic errors and security anti-patterns."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={3}
                            title="Secrets Management"
                            description="Implement robust strategies for handling API keys, credentials, and certificates in code and CI systems."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={4}
                            title="Security Engineering"
                            description="Hands-on implementation of security controls, authentication libraries, and encryption standards."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={5}
                            title="Compliance as Code"
                            description="Automate regulatory compliance checks within your deployment pipelines."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={6}
                            title="Developer Training"
                            description="Upskill your team with practical secure coding workshops tailored to your tech stack."
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to shift security left?"
                description="Empower your engineering teams to build secure, resilient software without slowing down innovation."
                primaryLabel="Schedule a Consultation"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
