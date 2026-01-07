"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    AlertTriangle,
    Search,
    Building2,
    FileCode,
    BarChart3,
    Calendar,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Research Categories
const researchCategories = [
    { icon: AlertTriangle, label: "Threat Landscape Analysis", count: 12 },
    { icon: Search, label: "Vulnerability Research", count: 8 },
    { icon: Building2, label: "Industry Security Reports", count: 6 },
    { icon: FileCode, label: "Technical Analysis", count: 10 },
];

// Sample Research Reports
const reports = [
    {
        title: "2024 Global Threat Landscape Report",
        description: "Comprehensive analysis of emerging cyber threats, attack vectors, and threat actor methodologies observed throughout 2024.",
        type: "Annual Report",
        date: "Q4 2024",
        featured: true
    },
    {
        title: "Ransomware Evolution: Tactics & Countermeasures",
        description: "In-depth research on the evolution of ransomware attacks and effective defense strategies.",
        type: "Threat Research",
        date: "Dec 2024",
        featured: false
    },
    {
        title: "Critical Infrastructure Security Assessment",
        description: "Security analysis of industrial control systems and operational technology environments.",
        type: "Industry Report",
        date: "Nov 2024",
        featured: false
    },
    {
        title: "API Security Vulnerability Analysis",
        description: "Research findings on common API vulnerabilities and exploitation techniques in modern applications.",
        type: "Technical Analysis",
        date: "Oct 2024",
        featured: false
    },
    {
        title: "Cloud Misconfigurations: Risk Assessment",
        description: "Analysis of prevalent cloud security misconfigurations and their potential impact on organizations.",
        type: "Cloud Security",
        date: "Sep 2024",
        featured: false
    },
];

export default function ResearchPage() {
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
                            Research<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-cyan-300">& Insights</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-3xl mx-auto">
                            Data-driven reports and proprietary threat intelligence findings that reveal the current state of the cyber landscape and predict future attack methodologies.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Categories Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {researchCategories.map((cat, i) => (
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
                                <p className="text-sm text-muted-foreground">{cat.count} reports</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Featured Report */}
                    {reports.filter(r => r.featured).map((report, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-3xl bg-muted/50 border border-border p-8 md:p-12 mb-12"
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-foreground/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 text-xs font-medium bg-foreground/10 text-foreground/80 rounded-full">
                                        Featured
                                    </span>
                                    <span className="text-sm text-muted-foreground">{report.date}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-manrope font-semibold text-foreground mb-4">
                                    {report.title}
                                </h2>

                                <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                                    {report.description}
                                </p>

                                <Button className="h-12 px-6 rounded-full gap-2">
                                    View Full Report
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Reports List */}
                    <div className="space-y-4">
                        {reports.filter(r => !r.featured).map((report, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                                            {report.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {report.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-manrope font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                                        {report.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-6" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
