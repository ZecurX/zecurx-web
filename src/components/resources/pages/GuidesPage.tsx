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
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";

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
        <div className="bg-[#f8fbff] min-h-screen relative overflow-hidden pt-32 pb-24">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
                <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
            </div>

            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <BlurFade delay={0.1}>
                    <div className="flex justify-center mb-6">
                        <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4c69e4] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-inter font-medium tracking-wide">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Resources</span>
                        </Link>
                    </div>
                </BlurFade>

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <BlurFade delay={0.2}>
                        <div className="flex justify-center mb-4">
                            <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                                BEST PRACTICES
                            </span>
                        </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.3}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
                            Security <span className="text-[#4c69e4]">Guides</span>
                        </h1>
                    </BlurFade>
                    
                    <BlurFade delay={0.4}>
                        <p className="text-lg text-slate-600 font-inter leading-relaxed">
                            Practical, step-by-step playbooks designed to help IT teams and security leaders implement best practices, harden systems, and prepare for incident response.
                        </p>
                    </BlurFade>
                </div>

                {/* Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {guideCategories.map((cat, i) => (
                        <BlurFade key={i} delay={0.3 + (i * 0.1)}>
                            <div className="group bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4c69e4]/5 blur-[30px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-[#4c69e4]">
                                        <cat.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-semibold font-manrope text-[#0c1a2e] text-lg mb-1 group-hover:text-[#4c69e4] transition-colors">{cat.label}</h4>
                                    <p className="text-sm text-slate-500 font-inter">{cat.count} guides</p>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                </div>

                {/* Guides List */}
                <div className="space-y-6 max-w-5xl mx-auto">
                    {guides.map((guide, i) => (
                        <BlurFade key={i} delay={0.5 + (i * 0.1)}>
                            <div className="group glass-card rounded-3xl p-8 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] bg-white/50 hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
                                <div className="absolute left-0 top-0 w-1 h-full bg-[#4c69e4]/20 group-hover:bg-[#4c69e4] transition-colors" />
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 text-[11px] font-space-grotesk font-semibold tracking-widest text-[#4c69e4] uppercase bg-blue-50 rounded-full">
                                                {guide.category}
                                            </span>
                                            <span className="px-3 py-1 text-[11px] font-space-grotesk font-semibold tracking-widest text-slate-600 uppercase bg-slate-100 rounded-full">
                                                {guide.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-manrope font-bold text-[#0c1a2e] mb-3 group-hover:text-[#4c69e4] transition-colors">
                                            {guide.title}
                                        </h3>

                                        <p className="text-slate-600 font-inter text-[15px] leading-relaxed mb-6">
                                            {guide.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {guide.topics.map((topic, j) => (
                                                <span key={j} className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-inter text-slate-500 bg-white border border-slate-200 rounded-full shadow-sm">
                                                    <CheckCircle className="w-3.5 h-3.5 text-[#4c69e4]" />
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 mt-4 lg:mt-0">
                                        <button className="relative inline-flex items-center justify-center gap-2 bg-white text-[#0c1a2e] rounded-full px-6 py-3 text-sm font-semibold font-inter cursor-pointer border border-slate-200 hover:border-[#4c69e4] hover:text-[#4c69e4] hover:bg-[#f8fbff] transition-all duration-200 shadow-sm">
                                            <BookOpen className="w-4 h-4" />
                                            Read Guide
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </div>
    );
}
