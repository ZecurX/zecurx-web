"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    ArrowLeft,
    Shield,
    Cloud,
    Lock,
    Server,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Whitepaper Categories
const categories = [
    { label: "Zero Trust Security", count: 8 },
    { label: "Cloud Compliance", count: 6 },
    { label: "Threat Intelligence", count: 5 },
    { label: "Data Protection", count: 4 },
    { label: "Incident Response", count: 3 },
];

// Sample Whitepapers
const whitepapers = [
    {
        title: "The Complete Guide to Zero Trust Architecture",
        description: "A comprehensive framework for implementing zero trust security principles across your organization's infrastructure.",
        pages: 48,
        category: "Zero Trust Security",
        icon: Lock
    },
    {
        title: "Cloud Security Posture Management Best Practices",
        description: "Strategic insights into securing multi-cloud environments and maintaining continuous compliance.",
        pages: 32,
        category: "Cloud Compliance",
        icon: Cloud
    },
    {
        title: "Advanced Threat Detection & Response Strategies",
        description: "Methodologies for identifying and responding to sophisticated cyber threats in enterprise environments.",
        pages: 40,
        category: "Threat Intelligence",
        icon: Shield
    },
    {
        title: "Data Protection in Hybrid Environments",
        description: "Protecting sensitive data across on-premise and cloud infrastructure with encryption and access controls.",
        pages: 28,
        category: "Data Protection",
        icon: Server
    },
];

export default function WhitepapersPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full min-h-[40vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Resources</span>
                        </Link>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Technical<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-cyan-300">Whitepapers</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-3xl mx-auto">
                            Deep-dive technical documents and strategic reports that provide comprehensive insights into complex security challenges, architecture best practices, and industry compliance.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-32">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                    CATEGORIES
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((cat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                                        >
                                            <span className="text-sm font-medium text-foreground">{cat.label}</span>
                                            <span className="text-xs text-muted-foreground">{cat.count}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="grid md:grid-cols-2 gap-6">
                                {whitepapers.map((paper, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                                <paper.icon className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{paper.pages} pages</span>
                                        </div>

                                        <span className="text-xs text-muted-foreground mb-2 block">{paper.category}</span>

                                        <h3 className="text-xl font-manrope font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                                            {paper.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                            {paper.description}
                                        </p>

                                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
