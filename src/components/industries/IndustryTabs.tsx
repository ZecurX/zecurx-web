"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Landmark, GraduationCap, Server, Activity, ShieldCheck, AlertTriangle, ArrowRight, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const industries = [
    {
        id: "tech",
        name: "Technology",
        subtitle: "Tech & SaaS",
        icon: Server,
        description: "High-growth tech companies require secure architecture that scales with innovation.",
        threats: "API attacks, Cloud misconfigurations, Supply chain vulnerabilities",
        solutions: [
            { title: "DevSecOps Integration", desc: "Security embedded into CI/CD pipelines." },
            { title: "Cloud Native Protection", desc: "Runtime protection for containers & K8s." },
            { title: "API Security", desc: "Automated discovery and abuse prevention." }
        ],
        outcome: "Secure innovation at scale with zero friction."
    },
    {
        id: "bfsi",
        name: "Financial Services",
        subtitle: "Banking & fintech",
        icon: Building2,
        description: "Financial institutions face sophisticated fraud and strict compliance mandates.",
        threats: "Financial fraud, Identity theft, Advanced persistent threats (APTs)",
        solutions: [
            { title: "Zero Trust Architecture", desc: "Identity-centric access controls." },
            { title: "Fraud Detection AI", desc: "Real-time transaction analysis." },
            { title: "Data Loss Prevention", desc: "Protecting sensitive financial data." }
        ],
        outcome: "70% reduction in account takeover attempts."
    },
    {
        id: "healthcare",
        name: "Healthcare",
        subtitle: "HIPAA compliance",
        icon: Activity,
        description: "Protecting patient lives implies protecting patient data and connected devices.",
        threats: "PHI theft, Ransomware, IoMT vulnerabilities",
        solutions: [
            { title: "IoMT Security", desc: "Securing connected medical devices." },
            { title: "Ransomware Defense", desc: "Immutable backups and rapid recovery." },
            { title: "HIPAA Compliance", desc: "Automated compliance auditing." }
        ],
        outcome: "Ensured continuity of critical care systems."
    },
    {
        id: "gov",
        name: "Government",
        subtitle: "Critical infrastructure",
        icon: Landmark,
        description: "Defending national interests against state-sponsored actors and cyber warfare.",
        threats: "Nation-state espionage, Critical infrastructure attacks, Insider threats",
        solutions: [
            { title: "Sovereign Cloud Security", desc: "Data residency and strict access control." },
            { title: "Threat Intelligence", desc: "Global situational awareness." },
            { title: "Cross-Agency Defense", desc: "Unified threat visibility." }
        ],
        outcome: "Resilient public services and data sovereignty."
    },
    {
        id: "edu",
        name: "Education",
        subtitle: "Research protection",
        icon: GraduationCap,
        description: "Open academic environments are prime targets for intellectual property theft.",
        threats: "DDoS attacks, Research data theft, Student data privacy",
        solutions: [
            { title: "Network Segmentation", desc: "Isolating research from guest networks." },
            { title: "Identity Management", desc: "Securing student and faculty access." },
            { title: "DDoS Mitigation", desc: "Ensuring uptime during critical periods." }
        ],
        outcome: "Protected $50M+ in proprietary research data."
    },
    {
        id: "startups",
        name: "Startups",
        subtitle: "Scalable security",
        icon: Rocket,
        description: "Fast-moving startups need security that enables speed rather than slowing it down.",
        threats: "Data leaks, Compliance blockers, resource constraints",
        solutions: [
            { title: "Automated Compliance", desc: "SOC2/ISO readiness in weeks." },
            { title: "Cloud Security Posture", desc: "Fix misconfigurations automatically." },
            { title: "Endpoint Protection", desc: "Lightweight agents for remote teams." }
        ],
        outcome: "SOC2 readiness achieved in record time."
    }
];

import { useSearchParams } from "next/navigation";


export default function IndustryTabs() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(initialTab && industries.find(i => i.id === initialTab) ? initialTab : industries[0].id);

    // Effect to scroll to section if deep link present
    useEffect(() => {
        if (initialTab) {
            const element = document.getElementById("industry-tabs");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [initialTab]);

    // Helper to get active industry object
    const activeIndustry = industries.find(i => i.id === activeTab) || industries[0];

    const enterpriseIndustries = industries.slice(0, 3);
    const publicGrowthIndustries = industries.slice(3, 6);

    const IndustryItem = ({ ind }: { ind: typeof industries[0] }) => {
        const isActive = ind.id === activeTab;
        return (
            <div
                key={ind.id}
                className="group cursor-pointer relative flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300 hover:bg-muted/30"
                onClick={() => setActiveTab(ind.id)}
            >
                {isActive && (
                    <motion.div
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-muted/50 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}

                <div className="relative z-10 flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isActive ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground group-hover:bg-blue-600/20 group-hover:text-blue-600"
                    )}>
                        <ind.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={cn(
                            "text-base md:text-lg font-manrope font-semibold transition-colors",
                            isActive ? "text-foreground" : "text-card-foreground/80 group-hover:text-foreground"
                        )}>
                            {ind.name}
                        </h3>
                        <p className={cn(
                            "text-xs md:text-sm font-medium transition-colors",
                            isActive ? "text-muted-foreground" : "text-muted-foreground/70"
                        )}>
                            {ind.subtitle}
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <section id="industry-tabs" className="relative w-full py-24 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-manrope font-medium text-foreground">
                        Tailored Defense for Every Sector
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
                        Select your industry to see how ZecurX addresses your specific challenges with precision-engineered security solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Industry List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Enterprise Column */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 px-4">
                                Enterprise
                            </h4>
                            <div className="space-y-2">
                                {enterpriseIndustries.map((ind) => (
                                    <IndustryItem key={ind.id} ind={ind} />
                                ))}
                            </div>
                        </div>

                        {/* Public & Growth Column */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 px-4">
                                Public & Growth
                            </h4>
                            <div className="space-y-2">
                                {publicGrowthIndustries.map((ind) => (
                                    <IndustryItem key={ind.id} ind={ind} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="relative lg:pl-16">
                        <div className="sticky top-32">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative z-10 bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm overflow-hidden"
                                >
                                    {/* Abstract Background Icon */}
                                    <activeIndustry.icon className="absolute -top-6 -right-6 w-64 h-64 text-foreground/[0.04] -rotate-12 pointer-events-none select-none" />

                                    {/* Main Description */}
                                    <h3 className="text-2xl md:text-3xl font-manrope font-semibold text-foreground mb-8 leading-snug relative z-10">
                                        {activeIndustry.description}
                                    </h3>

                                    {/* Details Grid */}
                                    <div className="grid gap-6 relative z-10">
                                        <div className="group">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                                Primary Threats
                                            </div>
                                            <p className="text-base text-muted-foreground leading-relaxed pl-6 border-l-2 border-border/50">
                                                {activeIndustry.threats}
                                            </p>
                                        </div>

                                        <div className="group">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                The ZecurX Outcome
                                            </div>
                                            <p className="text-base text-muted-foreground leading-relaxed pl-6 border-l-2 border-emerald-500/30">
                                                {activeIndustry.outcome}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-4 items-center justify-between relative z-10">
                                        <Button variant="outline" className="rounded-full px-6 h-10 gap-2 text-sm hover:bg-foreground hover:text-background transition-colors border-foreground/20">
                                            View Case Studies
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>

                                        <div className="flex flex-col gap-0.5 text-right">
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Active Modules</span>
                                            <span className="text-lg font-manrope font-bold text-foreground">
                                                {activeIndustry.solutions.length} <span className="text-xs font-normal text-muted-foreground">/ 12</span>
                                            </span>
                                        </div>
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
