"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Target, Eye, Code, Globe, Settings, Users,
    Rocket, Radar, FolderSearch, Lock, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';

export default function ServicesPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

    useEffect(() => {
        // Handle hash scrolling on mount with retry mechanism
        const handleHashScroll = () => {
            if (window.location.hash) {
                const id = window.location.hash.substring(1);

                // Try immediately and then with delays to account for hydration/animations
                const scrollToElement = () => {
                    const element = document.getElementById(id);
                    if (element) {
                        // Use 'auto' for instant jump on page load to avoid "laggy" feel
                        element.scrollIntoView({ behavior: 'auto', block: 'start' });
                        return true;
                    }
                    return false;
                };

                // Attempt scroll sequence
                if (!scrollToElement()) {
                    setTimeout(() => {
                        if (!scrollToElement()) {
                            setTimeout(() => {
                                if (!scrollToElement()) {
                                    // Final desperate attempt
                                    setTimeout(scrollToElement, 1000);
                                }
                            }, 300);
                        }
                    }, 100);
                }
            }
        };

        handleHashScroll();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashScroll);
        return () => window.removeEventListener('hashchange', handleHashScroll);
    }, []);

    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Comprehensive <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                                Cybersecurity Expertise
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            From offensive security to secure engineering and AI-driven training,
                            ZecurX delivers end-to-end solutions to protect your digital assets.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SERVICES SECTIONS */}
            <div ref={containerRef} className="pb-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* OFFENSIVE COLUMN */}
                    <motion.div style={{ y: y1 }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8"
                        >
                            Offensive
                        </motion.h2>
                        <div className="space-y-6">
                            <ServiceCard
                                href="/services/offensive/penetration-testing"
                                icon={Target}
                                title="Penetration Testing"
                                description="Red team assessments and simulated attacks."
                                delay={0.1}
                            />
                            <ServiceCard
                                href="/services/offensive/vulnerability-management"
                                icon={Eye}
                                title="Vulnerability Management"
                                description="Continuous scanning and asset identification."
                                delay={0.2}
                            />
                        </div>
                    </motion.div>

                    {/* ENGINEERING COLUMN */}
                    <motion.div style={{ y: y2 }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8"
                        >
                            Engineering
                        </motion.h2>
                        <div className="space-y-6">
                            <ServiceCard
                                href="/services/engineering/secure-development"
                                icon={Code}
                                title="Secure Development"
                                description="Security by design principles."
                                delay={0.1}
                            />
                            <ServiceCard
                                href="/services/engineering/web-app-security"
                                icon={Globe}
                                title="Web & App Security"
                                description="Application hardening and protection."
                                delay={0.2}
                            />
                            <ServiceCard
                                href="/services/engineering/devsecops"
                                icon={Settings}
                                title="DevSecOps"
                                description="Automated security in CI/CD pipelines."
                                delay={0.3}
                            />
                            <ServiceCard
                                href="/services/engineering/consulting"
                                icon={Users}
                                title="Consulting"
                                description="Strategic security advisory."
                                delay={0.4}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* TOOLS TEASER SECTION */}
            <section className="py-24 relative overflow-hidden bg-muted/20">
                <div className="absolute inset-0 bg-primary/5 -skew-y-2 transform origin-top-left" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 rounded-3xl bg-background/50 border border-border/50 p-12 backdrop-blur-sm shadow-xl">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-500 mb-6">
                                <Rocket className="w-3 h-3" />
                                <span>Advanced Capabilities</span>
                            </div>
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Powered by ZecurX <span className="text-primary">Cyber Tools</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Augment your security operations with the VulnHunter Suite. From subdomain discovery to port scanning, our automated tools give you the hacker's perspective.
                            </p>
                            <a
                                href="/tools"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 duration-200"
                            >
                                <span className="mr-1">Explore Cyber Tools</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            {/* Abstract Visual Representation of Tools */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: "Subdomain Finder", icon: Target },
                                    { name: "Port Radar", icon: Radar },
                                    { name: "Directory Scanner", icon: FolderSearch },
                                    { name: "SSL Analyzer", icon: Lock }
                                ].map((tool, i) => (
                                    <div key={i} className="p-5 rounded-xl bg-background/80 border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                            <tool.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">{tool.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 border-t border-border/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Secure Your Future?</h2>
                    <p className="text-muted-foreground mb-8">
                        Explore our customized solutions tailored to your organization's unique security needs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                        >
                            Contact Sales
                        </a>
                        <a
                            href="/platform"
                            className="px-8 py-3 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
                        >
                            View Platform
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

import Link from 'next/link';

function ServiceCard({ href, icon: Icon, title, description, delay }: { href: string, icon: any, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Link
                href={href}
                className="block group relative p-8 rounded-2xl bg-muted/5 border border-border/50 hover:bg-muted/10 hover:border-blue-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-xl bg-background border border-border group-hover:border-blue-500/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-8 h-8 text-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-500 transition-colors">
                            {title}
                        </h3>
                        <p className="text-base text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
