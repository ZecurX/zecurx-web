"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Target, ShieldAlert, Wifi, Globe, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCTA from '@/components/services/ServiceCTA';

export default function PenetrationTestingPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-foreground/20 text-xs font-medium text-foreground mb-6">
                            <Target className="w-3 h-3" />
                            <span>Offensive Security</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Advanced Penetration Testing & <br />
                            Adversary Emulation
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Go beyond compliance scanning. We simulate sophisticated, real-world attacks to identify exploitable vulnerabilities and validate your defense mechanisms before an adversary does.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-20 border-t border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Think Like an Attacker. <br />
                                Defend Like a Pro.
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Modern threats are dynamic and persistent. Static scanners and automated tools miss the nuanced, logic-based vulnerabilities that sophisticated attackers exploit.
                                </p>
                                <p>
                                    ZecurX's Offensive Security team leverages the latest threat intelligence and TTPs (Tactics, Techniques, and Procedures) used by active APT groups. Our goal isn't just to find bugs, but to demonstrate business impact and provide a roadmap to resilience.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard number="500+" label="Vulnerabilities Exploited" />
                            <StatCard number="100%" label="Compliance Aligned" />
                            <StatCard number="24/7" label="Adversary Simulation" />
                            <StatCard number="0" label="False Positives" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Assessment Capabilities</h2>
                        <p className="text-muted-foreground">
                            Our suite of testing services covers every attack surface, from your external perimeter to internal assets and human elements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={Globe}
                            title="External Penetration Testing"
                            description="Simulate an attack from the internet. We identify exposures in your perimeter that could allow initial access."
                        />
                        <CapabilityCard
                            icon={Lock}
                            title="Internal Penetration Testing"
                            description="Assume breach. We simulate an insider threat or compromised host to assess lateral movement and privilege escalation risks."
                        />
                        <CapabilityCard
                            icon={ShieldAlert}
                            title="Red Team Operations"
                            description="Full-scope adversarial simulation testing people, processes, and technology against a targeted objective."
                        />
                        <CapabilityCard
                            icon={Wifi}
                            title="Wireless Security Assessment"
                            description="Identify rogue access points, weak encryption, and risks associated with your corporate wireless networks."
                        />
                        <CapabilityCard
                            icon={Target}
                            title="Web & Mobile App Testing"
                            description="Deep-dive manual testing of application logic, APIs, and authentication mechanisms (OWASP Top 10 +)."
                        />
                        <CapabilityCard
                            icon={CheckCircle}
                            title="Compliance Validation"
                            description="Technical assessments tailored to meet PCI-DSS, HIPAA, SOC2, and ISO 27001 requirements."
                        />
                    </div>
                </div>
            </section>

            {/* WHY ZECURX SECTION */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-8">The ZecurX Difference</h2>
                            <ul className="space-y-6">
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
                        <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-muted/10 p-8">
                            <div className="absolute inset-0 bg-foreground/5 pattern-dots pointer-events-none" />
                            <h3 className="text-xl font-bold text-foreground mb-4 relative z-10">Sample Finding</h3>
                            <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs text-muted-foreground relative z-10 shadow-sm">
                                <p className="text-red-500 font-bold mb-2">CRITICAL: IDOR in User Profile</p>
                                <p className="mb-2">GET /api/v1/users/12345/financials</p>
                                <p className="text-green-600 mb-2">HTTP/1.1 200 OK</p>
                                <p>{`{ "cc_number": "4567-xxxx-xxxx-xxxx", "balance": 50000 }`}</p>
                                <div className="mt-4 pt-4 border-t border-dashed border-border">
                                    <p className="font-semibold text-foreground">Impact:</p>
                                    <p>Full account takeover and PII leakage enabled by changing user_id parameter.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Ready to validate your defenses?"
                description="See how our advanced penetration testing and adversary emulation can uncover critical risks before they become breaches."
                ctaLabel="Request a Quote"
                ctaHref="/contact"
            />

            <Footer />
        </main>
    );
}

function StatCard({ number, label }: { number: string, label: string }) {
    return (
        <div className="p-6 rounded-xl bg-muted/10 border border-border/50 text-center">
            <div className="text-3xl font-bold text-foreground mb-1">{number}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    );
}

function CapabilityCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-2xl bg-background border border-border hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}

function BenefitItem({ title, description }: { title: string, description: string }) {
    return (
        <li className="flex gap-4">
            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
                <CheckCircle className="w-4 h-4" />
            </div>
            <div>
                <h4 className="text-lg font-semibold text-foreground mb-1">{title}</h4>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </li>
    );
}
