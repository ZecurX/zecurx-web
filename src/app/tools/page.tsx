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
        href: "#"
    },
    {
        title: "Directory Scanner",
        description: "Discovers hidden website directories and paths. Finds admin panels, backup files, and sensitive configurations.",
        icon: FolderSearch,
        href: "#"
    },
    {
        title: "Port Radar",
        description: "Identifies open network service ports. Determine which services are running and potentially vulnerable.",
        icon: Radar,
        href: "#"
    },
    {
        title: "TLS/SSL Analyzer",
        description: "Checks certificate security and configuration. Ensures your encryption standards meet modern safety requirements.",
        icon: Lock,
        href: "#"
    },
    {
        title: "Param Finder",
        description: "Detects website parameters for testing. Critical for finding XSS, SQLi, and other injection vulnerabilities.",
        icon: Code2,
        href: "#"
    },
    {
        title: "Header Scanner",
        description: "Analyzes HTTP response security headers. Verifies presence of HSTS, CSP, X-Frame-Options, and more.",
        icon: FileSearch,
        href: "#"
    }
];

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
                            <Terminal className="w-3 h-3" />
                            <span>VulnHunter Suite</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Tools for the Modern <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                                Ethical Hacker
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Fueling the next generation of security researchers with intelligent automated reconnaissance and analysis tools.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* TOOLS GRID */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="group relative p-8 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-colors duration-300 flex flex-col"
                            >
                                <div className="mb-6 inline-flex p-3 rounded-lg bg-background border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                    <tool.icon className="w-6 h-6 text-primary" />
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-grow">
                                    {tool.description}
                                </p>

                                <a
                                    href={tool.href}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/link"
                                >
                                    Launch Tool
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </a>
                            </motion.div>
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
