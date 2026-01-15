"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';

export default function ConsultingPage() {
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
                                Engineering / 04
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                            Strategic Security <br />
                            <span className="text-foreground/80">Advisory & Governance</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            Navigate the complex cybersecurity landscape with confidence. We align your security strategy with business objectives, ensuring resilience, compliance, and sustained trust.
                        </p>
                        
                        <div className="mt-10">
                            <ServiceHeroEmailCapture serviceName="Strategic Consulting" />
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
                                Leadership in a High-Risk World
                            </h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    Cybersecurity is no longer just an IT issue; it’s a board-level imperative. Organizations struggle with balancing risk, compliance, and innovation while facing an evolving threat landscape.
                                </p>
                                <p>
                                    ZecurX acts as your trusted advisor. From vCISO services to comprehensive gap analysis and regulatory compliance mapping, we provide the leadership and expertise needed to mature your security posture and protect shareholder value.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            <StatMetric value="ISO" label="27001 Readiness" />
                            <StatMetric value="SOC2" label="Audit Preparation" />
                            <StatMetric value="GRC" label="Strategy Alignment" />
                            <StatMetric value="C-Suite" label="Reporting" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Advisory</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">Strategic Services</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="Virtual CISO (vCISO)"
                            description="On-demand executive security leadership to guide strategy, budget, and policy without the full-time cost."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={2}
                            title="Gap Analysis & Risk Assessment"
                            description="Holistic evaluation of your current security maturity against industry frameworks (NIST, CIS, ISO)."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={3}
                            title="Compliance & GRC"
                            description="Readiness assessments and roadmap development for SOC2, HIPAA, GDPR, PCI-DSS, and ISO 27001."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={4}
                            title="Third-Party Risk Management"
                            description="Evaluate and monitor the security posture of your vendors and supply chain partners."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={5}
                            title="Policy Development"
                            description="Creation and review of information security policies, incident response plans, and governance documents."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={6}
                            title="Security Culture & Awareness"
                            description="Design and delivery of security training programs to build a risk-aware culture across your organization."
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to gain a strategic advantage?"
                description="Align your security strategy with your business goals. Let's discuss how our advisory services can elevate your organization's resilience."
                primaryLabel="Book a Consultation"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
