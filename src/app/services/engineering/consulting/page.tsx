"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Users, Briefcase, FileText, PieChart, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCTA from '@/components/services/ServiceCTA';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';

export default function ConsultingPage() {
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
                            <Users className="w-3 h-3" />
                            <span>Engineering Services</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Strategic Security <br />
                            <span className="text-foreground">Advisory & Governance</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Navigate the complex cybersecurity landscape with confidence. We align your security strategy with business objectives, ensuring resilience, compliance, and sustained trust.
                        </p>
                        
                        <ServiceHeroEmailCapture serviceName="Strategic Consulting" />
                    </motion.div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-20 border-t border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Leadership in a High-Risk World
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Cybersecurity is no longer just an IT issue; it’s a board-level imperative. Organizations struggle with balancing risk, compliance, and innovation while facing an evolving threat landscape.
                                </p>
                                <p>
                                    ZecurX acts as your trusted advisor. From vCISO services to comprehensive gap analysis and regulatory compliance mapping, we provide the leadership and expertise needed to mature your security posture and protect shareholder value.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard number="ISO" label="27001 Readiness" />
                            <StatCard number="SOC2" label="Audit Preparation" />
                            <StatCard number="GRC" label="Strategy Alignment" />
                            <StatCard number="C-Suite" label="Reporting" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Advisory Services</h2>
                        <p className="text-muted-foreground">
                            Tailored consulting engagements to address specific organizational security challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={UserCheck}
                            title="Virtual CISO (vCISO)"
                            description="On-demand executive security leadership to guide strategy, budget, and policy without the full-time cost."
                        />
                        <CapabilityCard
                            icon={PieChart}
                            title="Gap Analysis & Risk Assessment"
                            description="Holistic evaluation of your current security maturity against industry frameworks (NIST, CIS, ISO)."
                        />
                        <CapabilityCard
                            icon={ShieldCheck}
                            title="Compliance & GRC"
                            description="Readiness assessments and roadmap development for SOC2, HIPAA, GDPR, PCI-DSS, and ISO 27001."
                        />
                        <CapabilityCard
                            icon={Briefcase}
                            title="Third-Party Risk Management"
                            description="Evaluate and monitor the security posture of your vendors and supply chain partners."
                        />
                        <CapabilityCard
                            icon={FileText}
                            title="Policy Development"
                            description="Creation and review of information security policies, incident response plans, and governance documents."
                        />
                        <CapabilityCard
                            icon={Users}
                            title="Security Culture & Awareness"
                            description="Design and delivery of security training programs to build a risk-aware culture across your organization."
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <ServiceCTA
                title="Ready to gain a strategic advantage?"
                description="Align your security strategy with your business goals. Let's discuss how our advisory services can elevate your organization's resilience."
                ctaLabel="Book a Consultation"
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
            <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
