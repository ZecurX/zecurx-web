"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Search, FolderSearch, Radar, Lock,
    Code2, FileSearch, ArrowRight, Terminal
} from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';

const tools = [
    {
        title: "Subdomain Finder",
        description: "Uncover hidden subdomains with lightning speed. Essential for mapping the attack surface of an organization.",
        icon: Search,
        href: "/tools/subdomain-finder"
    },
    {
        title: "Directory Scanner",
        description: "Discovers hidden website directories and paths. Finds admin panels, backup files, and sensitive configurations.",
        icon: FolderSearch,
        href: "/tools/directory-scanner"
    },
    {
        title: "Port Radar",
        description: "Identifies open network service ports. Determine which services are running and potentially vulnerable.",
        icon: Radar,
        href: "/tools/port-radar"
    },
    {
        title: "TLS/SSL Analyzer",
        description: "Checks certificate security and configuration. Ensures your encryption standards meet modern safety requirements.",
        icon: Lock,
        href: "/tools/ssl-analyzer"
    },
    {
        title: "Param Finder",
        description: "Detects website parameters for testing. Critical for finding XSS, SQLi, and other injection vulnerabilities.",
        icon: Code2,
        href: "/tools/param-finder"
    },
    {
        title: "Header Scanner",
        description: "Analyzes HTTP response security headers. Verifies presence of HSTS, CSP, X-Frame-Options, and more.",
        icon: FileSearch,
        href: "/tools/header-scanner"
    }
];

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-foreground/20">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[40vh] md:min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 md:py-24 pb-12">

                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 md:mb-8 font-manrope text-foreground">
                            VulnHunter<br />
                            <span className="text-muted-foreground">Suite</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal font-manrope">
                            Advanced reconnaissance and asset monitoring tools used by our own red teams.
                            Now available for your security operations.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* TOOLS GRID */}
            <section className="pb-20 md:pb-32 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/20 border border-border/20 rounded-2xl overflow-hidden">
                        {tools.map((tool, idx) => (
                            <motion.a
                                key={idx}
                                href={tool.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="group relative p-6 md:p-10 bg-background hover:bg-muted/30 transition-colors duration-300 flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-8 md:mb-12">
                                    <tool.icon className="w-6 h-6 md:w-8 md:h-8 text-foreground/80 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-foreground transition-all duration-300" />
                                </div>

                                <h3 className="text-xl font-medium text-foreground mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                    {tool.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                                    {tool.description}
                                </p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 border-t border-border/50 bg-muted/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Go Deeper?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of security researchers using ZecurX tools to discover vulnerabilities faster.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                        >
                            Get Enterprise Access
                        </a>
                        <a
                            href="/services#ptaas"
                            className="px-8 py-3 bg-background border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                        >
                            Explore PTaaS
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
