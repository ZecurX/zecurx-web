"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { BenefitItem } from '@/components/services/ui/BenefitList';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';

export default function PenetrationTestingPage() {
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
                                Offensive Security / 01
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                            Advanced Penetration Testing
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            Go beyond compliance scanning. We simulate sophisticated, real-world attacks to identify exploitable vulnerabilities and validate your defense mechanisms before an adversary does.
                        </p>
                        
                        <div className="mt-10">
                            <ServiceHeroEmailCapture serviceName="Penetration Testing" />
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
                                Think Like an Attacker. <br />
                                Defend Like a Pro.
                            </h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    Modern threats are dynamic and persistent. Static scanners and automated tools miss the nuanced, logic-based vulnerabilities that sophisticated attackers exploit.
                                </p>
                                <p>
                                    ZecurX&apos;s Offensive Security team leverages the latest threat intelligence and TTPs (Tactics, Techniques, and Procedures) used by active APT groups. Our goal isn&apos;t just to find bugs, but to demonstrate business impact and provide a roadmap to resilience.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            <StatMetric value="500+" label="Vulnerabilities Exploited" />
                            <StatMetric value="100%" label="Compliance Aligned" />
                            <StatMetric value="24/7" label="Adversary Simulation" />
                            <StatMetric value="0" label="False Positives" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Capabilities</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">Comprehensive Assessment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="External Penetration Testing"
                            description="Simulate an attack from the internet. We identify exposures in your perimeter that could allow initial access."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={2}
                            title="Internal Penetration Testing"
                            description="Assume breach. We simulate an insider threat or compromised host to assess lateral movement and privilege escalation risks."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={3}
                            title="Red Team Operations"
                            description="Full-scope adversarial simulation testing people, processes, and technology against a targeted objective."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={4}
                            title="Wireless Security Assessment"
                            description="Identify rogue access points, weak encryption, and risks associated with your corporate wireless networks."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={5}
                            title="Web & Mobile App Testing"
                            description="Deep-dive manual testing of application logic, APIs, and authentication mechanisms (OWASP Top 10 +)."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={6}
                            title="Compliance Validation"
                            description="Technical assessments tailored to meet PCI-DSS, HIPAA, SOC2, and ISO 27001 requirements."
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>

            {/* WHY ZECURX SECTION */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-5">
                            <span className="block text-xs font-mono text-primary uppercase tracking-widest mb-4">Why Us</span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-bold text-foreground mb-8">The ZecurX Difference</h2>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed">
                                We don't just report problems. We partner with your engineering teams to fix them at the root cause.
                            </p>
                        </div>
                        <div className="lg:col-span-7">
                            <ul className="grid gap-8">
                                <BenefitItem
                                    title="Manual + Automated"
                                    description="We combine industry-leading automation with expert human intuition to find logic flaws tools miss."
                                />
                                <BenefitItem
                                    title="Business Logic Focus"
                                    description="We contextualize vulnerabilities based on your specific business risks, not just CVSS scores."
                                />
                                <BenefitItem
                                    title="Actionable Reporting"
                                    description="Our reports speak to both executives (risk, impact) and developers (reproduction steps, code fixes)."
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to validate your defenses?"
                description="See how our advanced penetration testing and adversary emulation can uncover critical risks before they become breaches."
                primaryLabel="Request a Quote"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
