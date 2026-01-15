"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';

export default function WebAppSecurityPage() {
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
                                Engineering / 03
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                            Fortify Your Digital <br />
                            <span className="text-foreground/80">Front Door</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            Comprehensive application hardening and real-time protection for web and mobile platforms. Defend against OWASP Top 10 exploits, bot attacks, and zero-day threats.
                        </p>
                        
                        <div className="mt-10">
                            <ServiceHeroEmailCapture serviceName="Web & App Security" />
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
                                Application Security at Scale
                            </h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    Applications are the primary gateway to your data and the most targeted attack surface. Simple firewalls are no longer enough to stop sophisticated application-layer attacks.
                                </p>
                                <p>
                                    ZecurX delivers multi-layered protection. From WAF implementation and API security gatekeeping to runtime application self-protection (RASP), we ensure your apps remain resilient under fire without compromising performance or user experience.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            <StatMetric value="Top 10" label="OWASP Mitigation" />
                            <StatMetric value="99.9%" label="Uptime Maintained" />
                            <StatMetric value="<10ms" label="Latency Impact" />
                            <StatMetric value="Zero" label="Day Protection" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Defense Suite</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">Application Protection</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="WAF Implementation"
                            description="Deploy and tune Web Application Firewalls to block SQLi, XSS, and common exploits with minimal false positives."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={2}
                            title="API Security"
                            description="Discover rogue APIs, enforce strong authentication, and rate limit abuse to protect your backend services."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={3}
                            title="Bot Management"
                            description="Distinguish human users from malicious bots to prevent credential stuffing, scraping, and inventory hoarding."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={4}
                            title="Mobile App Shielding"
                            description="Code obfuscation, anti-tampering, and integrity checks for iOS and Android applications."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={5}
                            title="DDoS Protection"
                            description="Layer 7 application-level DDoS mitigation to ensure service availability during sophisticated attacks."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={6}
                            title="CDN Security"
                            description="Secure content delivery configurations to protect data in transit and at the edge."
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to fortify your applications?"
                description="Defend your digital front door with comprehensive WAF, API security, and mobile protection solutions."
                primaryLabel="Get Protected"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
