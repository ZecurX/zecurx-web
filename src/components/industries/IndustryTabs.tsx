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

const IndustryItem = ({ ind, activeTab, setActiveTab }: { ind: typeof industries[0], activeTab: string, setActiveTab: (id: string) => void }) => {
    const isActive = ind.id === activeTab;
    return (
        <div
            key={ind.id}
            className={cn(
                "group cursor-pointer relative flex items-center justify-between py-4 px-6 rounded-xl transition-all duration-300 border",
                isActive ? "bg-muted/60 shadow-md border-border" : "border-transparent hover:bg-muted/30"
            )}
            onClick={() => setActiveTab(ind.id)}
        >
            {isActive && (
                <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-foreground rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-foreground text-background shadow-lg shadow-foreground/10" : "bg-muted text-muted-foreground group-hover:bg-foreground/5 group-hover:text-foreground"
                )}>
                    <ind.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        "text-base font-manrope font-bold transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        {ind.name}
                    </h3>
                    <p className={cn(
                        "text-xs font-medium transition-colors line-clamp-1",
                        isActive ? "text-foreground/70" : "text-muted-foreground/50"
                    )}>
                        {ind.subtitle}
                    </p>
                </div>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-foreground"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </motion.div>
                )}
            </div>
        </div>
    );
};


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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Industry List */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Enterprise Column */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">
                                Enterprise
                            </h4>
                            <div className="space-y-1">
                                {enterpriseIndustries.map((ind) => (
                                    <IndustryItem 
                                        key={ind.id} 
                                        ind={ind} 
                                        activeTab={activeTab} 
                                        setActiveTab={setActiveTab} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Public & Growth Column */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">
                                Public & Growth
                            </h4>
                            <div className="space-y-1">
                                {publicGrowthIndustries.map((ind) => (
                                    <IndustryItem 
                                        key={ind.id} 
                                        ind={ind} 
                                        activeTab={activeTab} 
                                        setActiveTab={setActiveTab} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="lg:col-span-8 relative">
                        <div className="sticky top-32">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10 bg-background border border-border p-8 md:p-12 rounded-3xl min-h-[500px] flex flex-col justify-between group hover:border-foreground/80/30 transition-colors duration-500"
                                >
                                    {/* Decorative Corner */}
                                    <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                        <activeIndustry.icon className="w-32 h-32 text-foreground stroke-[1px]" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <span className="text-xs font-mono text-foreground/80 uppercase tracking-widest">
                                                // {activeIndustry.id.toUpperCase()}_SECTOR
                                            </span>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-8 leading-tight max-w-2xl">
                                            {activeIndustry.description}
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3 p-6 bg-muted/30 rounded-2xl border border-border/50">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Threat Vector
                                                </div>
                                                <p className="text-base text-foreground leading-relaxed font-medium">
                                                    {activeIndustry.threats}
                                                </p>
                                            </div>

                                            <div className="space-y-3 p-6 bg-foreground/80/5 rounded-2xl border border-foreground/80/20">
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 uppercase tracking-wide mb-2">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    ZecurX Defense
                                                </div>
                                                <p className="text-base text-foreground leading-relaxed font-medium">
                                                    {activeIndustry.outcome}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-6 items-center justify-between relative z-10">
                                        <Button className="rounded-full px-8 h-12 gap-2 text-base bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl">
                                            View Case Studies
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Active Modules</span>
                                                <span className="block text-xl font-manrope font-bold text-foreground">
                                                    {activeIndustry.solutions.length} <span className="text-sm font-normal text-muted-foreground">/ 12</span>
                                                </span>
                                            </div>
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
