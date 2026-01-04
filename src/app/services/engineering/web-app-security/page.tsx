"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Globe, Shield, Zap, Lock, Smartphone, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCTA from '@/components/services/ServiceCTA';

export default function WebAppSecurityPage() {
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
                            <Globe className="w-3 h-3" />
                            <span>Engineering Services</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Fortify Your Digital <br />
                            <span className="text-blue-500">Front Door</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Comprehensive application hardening and real-time protection for web and mobile platforms. Defend against OWASP Top 10 exploits, bot attacks, and zero-day threats.
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
                                Application Security at Scale
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Applications are the primary gateway to your data and the most targeted attack surface. Simple firewalls are no longer enough to stop sophisticated application-layer attacks.
                                </p>
                                <p>
                                    ZecurX delivers multi-layered protection. From WAF implementation and API security gatekeeping to runtime application self-protection (RASP), we ensure your apps remain resilient under fire without compromising performance or user experience.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard number="Top 10" label="OWASP Mitigation" />
                            <StatCard number="99.9%" label="Uptime Maintained" />
                            <StatCard number="<10ms" label="Latency Impact" />
                            <StatCard number="Zero" label="Day Protection" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Application Defense Suite</h2>
                        <p className="text-muted-foreground">
                            Holistic protection strategies for modern web, mobile, and API-driven architectures.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={Shield}
                            title="WAF Implementation"
                            description="Deploy and tune Web Application Firewalls to block SQLi, XSS, and common exploits with minimal false positives."
                        />
                        <CapabilityCard
                            icon={Zap}
                            title="API Security"
                            description="Discover rogue APIs, enforce strong authentication, and rate limit abuse to protect your backend services."
                        />
                        <CapabilityCard
                            icon={Activity}
                            title="Bot Management"
                            description="Distinguish human users from malicious bots to prevent credential stuffing, scraping, and inventory hoarding."
                        />
                        <CapabilityCard
                            icon={Smartphone}
                            title="Mobile App Shielding"
                            description="Code obfuscation, anti-tampering, and integrity checks for iOS and Android applications."
                        />
                        <CapabilityCard
                            icon={Lock}
                            title="DDoS Protection"
                            description="Layer 7 application-level DDoS mitigation to ensure service availability during sophisticated attacks."
                        />
                        <CapabilityCard
                            icon={Globe}
                            title="CDN Security"
                            description="Secure content delivery configurations to protect data in transit and at the edge."
                        />
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Ready to fortify your applications?"
                description="Defend your digital front door with comprehensive WAF, API security, and mobile protection solutions."
                ctaLabel="Get Protected"
                ctaHref="/contact"
            />

            <Footer />
        </main>
    );
}

function StatCard({ number, label }: { number: string, label: string }) {
    return (
        <div className="p-6 rounded-xl bg-muted/10 border border-border/50 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">{number}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
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
