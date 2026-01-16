"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Shield,
    Server,
    Code,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Guide Categories
const guideCategories = [
    { icon: Shield, label: "System Hardening", count: 12 },
    { icon: Code, label: "Secure Coding", count: 8 },
    { icon: AlertTriangle, label: "Incident Response", count: 6 },
    { icon: Server, label: "Infrastructure Security", count: 10 },
];

// Sample Guides
const guides = [
    {
        title: "Linux Server Hardening Checklist",
        description: "Step-by-step guide to securing Linux servers with essential configurations and security controls.",
        category: "System Hardening",
        difficulty: "Intermediate",
        topics: ["SSH Configuration", "Firewall Rules", "User Management", "Logging"]
    },
    {
        title: "Secure Code Review Best Practices",
        description: "Comprehensive methodology for identifying vulnerabilities during code review processes.",
        category: "Secure Coding",
        difficulty: "Advanced",
        topics: ["OWASP Top 10", "Static Analysis", "Dependency Scanning", "Code Patterns"]
    },
    {
        title: "Incident Response Playbook",
        description: "Structured approach to detecting, responding to, and recovering from security incidents.",
        category: "Incident Response",
        difficulty: "Intermediate",
        topics: ["Detection", "Containment", "Eradication", "Recovery"]
    },
    {
        title: "Cloud Security Configuration Guide",
        description: "Best practices for securing cloud infrastructure across AWS, Azure, and GCP environments.",
        category: "Infrastructure Security",
        difficulty: "Advanced",
        topics: ["IAM Policies", "Network Security", "Encryption", "Monitoring"]
    },
    {
        title: "API Security Implementation Guide",
        description: "Practical steps for implementing robust API security measures in modern applications.",
        category: "Secure Coding",
        difficulty: "Intermediate",
        topics: ["Authentication", "Rate Limiting", "Input Validation", "Encryption"]
    },
];

export default function GuidesPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 border-b border-white/[0.08]">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-xs font-mono tracking-widest uppercase bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.05] hover:bg-white/[0.1]">
                            <ArrowLeft className="w-3 h-3" />
                            <span>Resources / Guides</span>
                        </Link>

                        <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground mb-8 leading-[1.1]">
                            Security <br />
                            Guides.
                        </h1>

                        <p className="text-center text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Practical, step-by-step playbooks designed to help IT teams and security leaders implement best practices, harden systems, and prepare for incident response.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Categories */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {guideCategories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-5 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-4 group-hover:border-foreground/30 transition-colors">
                                    <cat.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{cat.label}</h4>
                                <p className="text-sm text-muted-foreground">{cat.count} guides</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Guides List */}
                    <div className="space-y-6">
                        {guides.map((guide, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                                                {guide.category}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs bg-foreground/10 text-foreground/80 rounded">
                                                {guide.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-manrope font-semibold text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                                            {guide.title}
                                        </h3>

                                        <p className="text-muted-foreground mb-4">
                                            {guide.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {guide.topics.map((topic, j) => (
                                                <span key={j} className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Button variant="outline" className="rounded-full gap-2 flex-shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                        Read Guide
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
