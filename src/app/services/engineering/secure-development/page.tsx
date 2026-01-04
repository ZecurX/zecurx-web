"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Code, ShieldCheck, GitBranch, Cpu, Lock, FileCode, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCTA from '@/components/services/ServiceCTA';

export default function SecureDevelopmentPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-500 mb-6">
                            <Code className="w-3 h-3" />
                            <span>Engineering Services</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Secure by Design. <br />
                            <span className="text-blue-500">Resilient by Default.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Embed security into the DNA of your applications. We help you shift left, reducing remediation costs and building trust from the first line of code.
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
                                Flawless Code, Faster Delivery
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Trying to "bolt on" security at the end of the development lifecycle is costly and ineffective. Modern agility demands that security travels at the speed of DevOps.
                                </p>
                                <p>
                                    ZecurX integrates robust security practices into every phase of your SDLC. From threat modeling during architecture design to automated SAST/DAST in your CI pipelines, we ensure your software is hardened against attacks before it ever reaches production.
                                </p>
                            </div>
                        </div>
                        <div className="relative p-6 rounded-2xl border border-border bg-muted/20">
                            {/* Simple Visual for SDLC */}
                            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground mb-4">
                                <span>PLAN</span>
                                <span>CODE</span>
                                <span>BUILD</span>
                                <span>TEST</span>
                                <span>DEPLOY</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                                <div className="absolute inset-0 bg-blue-500/20" />
                                <div className="absolute top-0 bottom-0 left-[20%] right-[60%] bg-blue-500" />
                            </div>
                            <div className="mt-8 grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded bg-background border border-border">
                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                    <span className="font-semibold text-foreground">Threat Modeling</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded bg-background border border-border">
                                    <FileCode className="w-5 h-5 text-blue-500" />
                                    <span className="font-semibold text-foreground">Secure Code Review</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">SDLC Integration Service</h2>
                        <p className="text-muted-foreground">
                            We partner with your engineering teams to build a secure software factory.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={Cpu}
                            title="Threat Modeling"
                            description="Identify architectural flaws and design vulnerabilities before a single line of code is written."
                        />
                        <CapabilityCard
                            icon={GitBranch}
                            title="Secure Code Review"
                            description="Manual and automated analysis of source code to identify logic errors and security anti-patterns."
                        />
                        <CapabilityCard
                            icon={Lock}
                            title="Secrets Management"
                            description="Implement robust strategies for handling API keys, credentials, and certificates in code and CI systems."
                        />
                        <CapabilityCard
                            icon={Code}
                            title="Security Engineering"
                            description="Hands-on implementation of security controls, authentication libraries, and encryption standards."
                        />
                        <CapabilityCard
                            icon={ShieldCheck}
                            title="Compliance as Code"
                            description="Automate regulatory compliance checks within your deployment pipelines."
                        />
                        <CapabilityCard
                            icon={FileCode}
                            title="Developer Training"
                            description="Upskill your team with practical secure coding workshops tailored to your tech stack."
                        />
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Ready to shift security left?"
                description="Empower your engineering teams to build secure, resilient software without slowing down innovation."
                ctaLabel="Schedule a Consultation"
                ctaHref="/contact"
            />

            <Footer />
        </main>
    );
}

function CapabilityCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-2xl bg-background border border-border hover:border-blue-500/30 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
