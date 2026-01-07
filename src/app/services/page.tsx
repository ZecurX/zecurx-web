"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Target, Eye, Code, Globe, Settings, Users,
    Rocket, Radar, FolderSearch, Lock, ArrowRight, ShieldCheck, Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-inter selection:bg-foreground selection:text-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">

                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 font-manrope text-foreground">
                            Security.<br />
                            <span className="text-muted-foreground">Engineered.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal font-manrope">
                            We don't just find vulnerabilities; we engineer resilience.
                            From offensive simulations to secure architecture, ZecurX delivers
                            precision cybersecurity services.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="w-full h-px bg-border/40 max-w-7xl mx-auto" />

            {/* SERVICES GRID */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32">

                        {/* OFFENSIVE */}
                        <div>
                            <div className="mb-12 border-b border-foreground/10 pb-6">
                                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                                    01 / Offensive Security
                                </h2>
                            </div>
                            <div className="space-y-12">
                                <MinimalServiceCard
                                    href="/services/offensive/penetration-testing"
                                    title="Penetration Testing"
                                    description="Adversary simulation designed to expose real-world risks before attackers leverage them."
                                    icon={Target}
                                />
                                <MinimalServiceCard
                                    href="/services/offensive/vulnerability-management"
                                    title="Vulnerability Management"
                                    description="Continuous asset discovery and risk prioritization for a proactive defense posture."
                                    icon={Eye}
                                />
                            </div>
                        </div>

                        {/* ENGINEERING */}
                        <div>
                            <div className="mb-12 border-b border-foreground/10 pb-6">
                                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                                    02 / Security Engineering
                                </h2>
                            </div>
                            <div className="space-y-12">
                                <MinimalServiceCard
                                    href="/services/engineering/secure-development"
                                    title="Secure Development"
                                    description="Embedding security into the SDLC. Code reviews, threat modeling, and secure design patterns."
                                    icon={Code}
                                />
                                <MinimalServiceCard
                                    href="/services/engineering/web-app-security"
                                    title="Web & App Security"
                                    description="Hardening critical applications against OWASP Top 10 and advanced attack vectors."
                                    icon={Globe}
                                />
                                <MinimalServiceCard
                                    href="/services/engineering/devsecops"
                                    title="DevSecOps Implementation"
                                    description="Automating security controls within CI/CD pipelines for velocity without compromise."
                                    icon={Terminal}
                                />
                                <MinimalServiceCard
                                    href="/services/engineering/consulting"
                                    title="Strategic Consulting"
                                    description="vCISO services, compliance readiness, and security roadmap development."
                                    icon={Users}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TOOLS HIGHLIGHT - Minimal */}
            <section className="py-32 px-6 bg-background relative overflow-hidden">

                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-6 text-foreground">
                                The VulnHunter Suite
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Our proprietary toolkit for automated reconnaissance and asset monitoring.
                            </p>
                        </div>
                        <Link href="/tools">
                            <Button variant="outline" className="rounded-full border-border/50 text-foreground hover:bg-muted h-12 px-8">
                                Explore Tools
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/20 border border-border/20">
                        <ToolItem name="Subdomain Finder" icon={Target} />
                        <ToolItem name="Port Radar" icon={Radar} />
                        <ToolItem name="Directory Scanner" icon={FolderSearch} />
                        <ToolItem name="SSL Analyzer" icon={Lock} />
                    </div>
                </div>
            </section>

            {/* CTA SECTION - Clean */}
            <section className="py-40 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-8">
                        Secure your infrastructure.
                    </h2>
                    <p className="text-xl text-muted-foreground mb-12 font-light">
                        Partner with ZecurX for a security posture that scales with your ambition.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/contact">
                            <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                                Contact Sales
                            </Button>
                        </Link>
                        <Link href="/platform">
                            <Button variant="outline" size="lg" className="rounded-full h-14 px-10 text-lg border-2">
                                View Platform
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function MinimalServiceCard({ href, title, description, icon: Icon }: { href: string, title: string, description: string, icon: any }) {
    return (
        <Link href={href} className="group block">
            <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-md">
                    <h3 className="text-2xl font-manrope font-medium group-hover:text-blue-600 transition-colors flex items-center gap-3">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground transition-colors">
                        {description}
                    </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-border group-hover:border-blue-600 group-hover:bg-blue-50 transition-all">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
            </div>
            <div className="mt-8 h-px w-full bg-border/40 group-hover:bg-blue-600/30 transition-colors" />
        </Link>
    )
}

function ToolItem({ name, icon: Icon }: { name: string, icon: any }) {
    return (
        <div className="bg-background/50 p-8 flex flex-col items-center text-center gap-4 hover:bg-muted/50 transition-colors cursor-default group backdrop-blur-sm">
            <div className="p-3 rounded-full bg-muted text-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-lg font-medium text-foreground">{name}</span>
        </div>
    )
}
