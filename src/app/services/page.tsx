"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Target, Eye, Search, ShieldAlert, Code, Globe,
    Settings, Users, Brain, Rocket, UserPlus,
    Award, Smartphone, Layers, ShieldCheck, CheckCircle,
    Radar, FolderSearch, Lock, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer'; // Assuming Footer is here, based on file structure

// Service Data
const serviceCategories = [
    {
        title: "Offensive Security Services",
        id: "offensive",
        description: "Proactive identification and mitigation of vulnerabilities through real-world attack simulations.",
        services: [
            {
                title: "Penetration Testing as a Service (PTaaS)",
                id: "ptaas",
                description: "End-to-end offensive testing of web apps, APIs, cloud, networks, IoT, and Active Directory environments. Delivered with real-time dashboards, PoC videos, and remediation guidance.",
                icon: Target,
                benefits: [
                    "Real vulnerability exploitation",
                    "Executive + technical reporting",
                    "On-demand retesting cycles",
                    "Faster compliance alignment (ISO/NIST/OWASP)"
                ]
            },
            {
                title: "Red Team Assessments",
                id: "red-team",
                description: "Simulated multi-layered attacks to test detection, response, and security awareness across the organization.",
                icon: ShieldAlert, // Using ShieldAlert for Red Team
                benefits: [
                    "Real-world adversarial emulation",
                    "Breach impact visualization",
                    "Internal threat hunting triggers",
                    "Customized TTPs (MITRE ATT&CK)"
                ]
            },
            {
                title: "Vulnerability & Risk Audits",
                id: "vuln-audits",
                description: "Comprehensive audits of infrastructure, applications, and assets using OWASP, NIST, and ISO standards.",
                icon: Search,
                benefits: [
                    "Asset-level risk scoring",
                    "Gap analysis & compliance mapping",
                    "Prioritized remediation checklist",
                    "Internal audit readiness"
                ]
            },
            {
                title: "Security Operations & Threat Hunting",
                id: "threat-hunting",
                description: "Behavior-based threat detection, continuous monitoring, and proactive response planning.",
                icon: ShieldCheck,
                benefits: [
                    "Detect APTs, insider threats, and anomalies",
                    "Use of AI and log analytics",
                    "Integration with SIEM/SOAR",
                    "Monthly Threat Intel Reports"
                ]
            }
        ]
    },
    {
        title: "Secure Development Services",
        id: "engineering",
        description: "Embedding security into the software development lifecycle to build resilient applications.",
        services: [
            {
                title: "Secure Web & App Development",
                id: "secure-dev",
                description: "Custom enterprise solutions developed with DevSecOps pipelines and security-first coding principles.",
                icon: Globe,
                benefits: [
                    "Role-based access & hardened endpoints",
                    "Secure architecture design",
                    "CI/CD & code integrity pipelines",
                    "Scalable & API-friendly infrastructure"
                ]
            },
            {
                title: "Security-Centric Code Review",
                id: "code-review",
                description: "Manual + automated review of source code to identify logic, injection, and memory issues.",
                icon: Code,
                benefits: [
                    "SAST & DAST integration",
                    "OWASP Top 10 & CWE aligned",
                    "Remediation walkthroughs",
                    "Shift-left security enhancement"
                ]
            },
            {
                title: "Secure Cloud Solutions",
                id: "cloud-security",
                description: "Cloud-native app design, deployment hardening, and continuous security review on AWS, Azure, and GCP.",
                icon: Layers, // Cloud concept
                benefits: [
                    "Identity & secrets management",
                    "Infrastructure-as-code security",
                    "Multi-tenant isolation",
                    "Cloud compliance mapping"
                ]
            },
            {
                title: "Enterprise Dashboards & Portals",
                id: "enterprise-portals",
                description: "Role-based portals for internal teams, students, or enterprise clients — analytics, control, and security baked-in.",
                icon: Settings,
                benefits: [
                    "Real-time access control",
                    "Data visualization + audit trails",
                    "Integration with SSO, LDAP",
                    "Academic + business use cases"
                ]
            }
        ]
    },
    {
        title: "AI-Driven Training Services",
        id: "training",
        description: "Empowering teams with cutting-edge cybersecurity skills through AI-enhanced learning.",
        services: [
            {
                title: "160-Hour Enterprise Cybersecurity Training",
                id: "training-160h",
                description: "Offline + cloud lab training combining AI, offensive security, and certification preparation.",
                icon: Brain,
                benefits: [
                    "Hands-on lab modules",
                    "CTFs + real attack simulations",
                    "License-verifiable certification",
                    "Trainer-led sessions with ranks"
                ]
            },
            {
                title: "Faculty Development Program (FDP)",
                id: "fdp",
                description: "Upskilling academic staff in cybersecurity teaching, red teaming, and secure programming.",
                icon: UserPlus,
                benefits: [
                    "Includes certification for faculty",
                    "5-member package with post-training support",
                    "Covers offensive + defensive modules"
                ]
            },
            {
                title: "Custom Workshops & Seminars",
                id: "workshops",
                description: "On-site or online workshops covering offensive security, hacking awareness, and digital trust.",
                icon: Users,
                benefits: [
                    "Customized for students or corporates",
                    "Live hacking demos",
                    "Delivered by certified trainers"
                ]
            },
            {
                title: "Certification Programs: zxCPEH, zxCPPT",
                id: "certifications",
                description: "ZecurX's proprietary certifications, aligned with industry demands, with real-time verification.",
                icon: Award,
                benefits: [
                    "Practical CTF-based assessments",
                    "License ID tracking on ZecurX",
                    "Globally competitive content"
                ]
            }
        ]
    }
];

export default function ServicesPage() {
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
            <div className="pb-24 space-y-24">
                {serviceCategories.map((category, categoryIdx) => (
                    <section key={categoryIdx} id={category.id} className="relative scroll-mt-28">
                        <div className="max-w-7xl mx-auto px-6">
                            {/* Category Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="mb-12"
                            >
                                <h2 className="text-3xl font-bold text-foreground mb-4">{category.title}</h2>
                                <p className="text-muted-foreground max-w-2xl">{category.description}</p>
                            </motion.div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {category.services.map((service, serviceIdx) => (
                                    <motion.div
                                        key={serviceIdx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: serviceIdx * 0.1 }}
                                        id={service.id}
                                        className="group relative p-8 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-colors duration-300 scroll-mt-32"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 rounded-lg bg-background border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                                <service.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Benefits</h4>
                                            <ul className="space-y-2">
                                                {service.benefits.map((benefit, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle className="w-4 h-4 text-green-500/80 mt-0.5 flex-shrink-0" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
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
