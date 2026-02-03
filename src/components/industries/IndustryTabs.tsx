"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Brain, Building2, GraduationCap, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const industries = [
    {
        id: "saas-startups",
        name: "SaaS & Startups",
        subtitle: "Seed to Series B",
        icon: Rocket,
        description: "Security that enables speed, not slows you down. Get audit-ready without dedicated security hires.",
        challenges: [
            "Need SOC 2 / ISO 27001 for enterprise deals",
            "No dedicated security team or budget",
            "Shipping fast with limited security review",
            "Cloud misconfigurations from rapid deployment"
        ],
        solutions: [
            { title: "Application Security", desc: "Web, API & mobile penetration testing" },
            { title: "Cloud Security", desc: "AWS, GCP & Azure security assessments" },
            { title: "Secure Code Review", desc: "Manual review + SAST analysis" },
            { title: "DevSecOps", desc: "CI/CD security & Kubernetes hardening" }
        ],
        cta: "Get Startup Pack",
        href: "/contact"
    },
    {
        id: "ai-companies",
        name: "AI Companies",
        subtitle: "LLM & ML Products",
        icon: Brain,
        description: "Specialized security for AI-powered applications. Protect your models, data pipelines, and user trust.",
        challenges: [
            "Prompt injection and jailbreak vulnerabilities",
            "Training data poisoning risks",
            "Model theft and IP protection",
            "Regulatory uncertainty around AI"
        ],
        solutions: [
            { title: "AI Security", desc: "LLM threat modeling & abuse testing" },
            { title: "Secure Code Review", desc: "Manual review + SAST analysis" },
            { title: "Application Security", desc: "Web, API & mobile penetration testing" },
            { title: "Secure Development", desc: "Build secure MVPs & prototypes" }
        ],
        cta: "Get AI Security Pack",
        href: "/contact"
    },
    {
        id: "smes",
        name: "SMEs",
        subtitle: "Growing Businesses",
        icon: Building2,
        description: "Enterprise-grade security without enterprise complexity. Practical protection for established businesses.",
        challenges: [
            "Growing attack surface with business expansion",
            "Compliance requirements from partners",
            "Limited internal security expertise",
            "Balancing security spend with growth"
        ],
        solutions: [
            { title: "Application Security", desc: "Web, API & mobile penetration testing" },
            { title: "Cloud Security", desc: "AWS, GCP & Azure security assessments" },
            { title: "DevSecOps", desc: "CI/CD security & Kubernetes hardening" },
            { title: "Secure Code Review", desc: "Manual review + SAST analysis" }
        ],
        cta: "Get SME Essentials",
        href: "/contact"
    },
    {
        id: "edtech",
        name: "EdTech & Colleges",
        subtitle: "Education Sector",
        icon: GraduationCap,
        description: "Protect student data, research IP, and institutional reputation. Security for open academic environments.",
        challenges: [
            "Student PII and FERPA compliance",
            "Research data and IP protection",
            "Open network environments",
            "Limited security budgets"
        ],
        solutions: [
            { title: "Application Security", desc: "Web, API & mobile penetration testing" },
            { title: "Secure Code Review", desc: "Manual review + SAST analysis" },
            { title: "Cloud Security", desc: "AWS, GCP & Azure security assessments" },
            { title: "Secure Development", desc: "Build secure MVPs & prototypes" }
        ],
        cta: "Get Education Pack",
        href: "/contact"
    }
];

const IndustryItem = ({ ind, activeTab, setActiveTab }: { ind: typeof industries[0], activeTab: string, setActiveTab: (id: string) => void }) => {
    const isActive = ind.id === activeTab;
    return (
        <div
            className={cn(
                "group cursor-pointer relative flex items-center justify-between py-5 px-6 rounded-2xl transition-all duration-300 border",
                isActive ? "bg-muted/60 shadow-md border-border" : "border-transparent hover:bg-muted/30"
            )}
            onClick={() => setActiveTab(ind.id)}
        >
            {isActive && (
                <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <ind.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        "text-lg font-manrope font-bold transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        {ind.name}
                    </h3>
                    <p className={cn(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground/60"
                    )}>
                        {ind.subtitle}
                    </p>
                </div>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-primary"
                    >
                        <ArrowRight className="w-5 h-5" />
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

    useEffect(() => {
        if (initialTab) {
            const element = document.getElementById("industry-tabs");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [initialTab]);

    const activeIndustry = industries.find(i => i.id === activeTab) || industries[0];

    return (
        <section id="industry-tabs" className="relative w-full py-24 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">
                        Security for Your Industry
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg font-light">
                        We specialize in helping these sectors ship secure products without slowing down.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-4 flex flex-col gap-2">
                        {industries.map((ind) => (
                            <IndustryItem 
                                key={ind.id} 
                                ind={ind} 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                            />
                        ))}
                    </div>

                    <div className="lg:col-span-8 relative">
                        <div className="sticky top-32">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10 bg-gradient-to-br from-muted/30 to-background border border-border p-8 md:p-10 rounded-3xl min-h-[520px] flex flex-col"
                                >
                                    <div className="absolute top-8 right-8 opacity-5">
                                        <activeIndustry.icon className="w-32 h-32 text-foreground stroke-[0.5px]" />
                                    </div>
                                    
                                    <div className="relative z-10 flex-1">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <activeIndustry.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-manrope font-bold text-foreground">
                                                    {activeIndustry.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                                            {activeIndustry.description}
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                                                    Common Challenges
                                                </h4>
                                                <ul className="space-y-2">
                                                    {activeIndustry.challenges.map((challenge, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0" />
                                                            {challenge}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    How We Help
                                                </h4>
                                                <ul className="space-y-2">
                                                    {activeIndustry.solutions.map((solution, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm">
                                                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                            <span className="text-foreground">{solution.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50 flex flex-wrap gap-4 items-center justify-between relative z-10">
                                        <Button asChild className="rounded-full px-8 h-12 gap-2 text-base">
                                            <Link href={activeIndustry.href}>
                                                {activeIndustry.cta}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>

                                        <Button asChild variant="ghost" className="rounded-full px-6 h-12 gap-2">
                                            <Link href="/services">
                                                View All Services
                                            </Link>
                                        </Button>
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
