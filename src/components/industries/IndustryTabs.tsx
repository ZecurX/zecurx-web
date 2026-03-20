"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Brain, Building2, GraduationCap, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LottieAnimation } from "@/components/ui/lottie-animation";

const industries = [
    {
        id: "saas-startups",
        name: "SaaS & Startups",
        subtitle: "Seed to Series B",
        icon: Rocket,
        lottie: "/lottie/saas.json",
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
        lottie: "/lottie/aiml.json",
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
        lottie: "/lottie/tools-pack.json",
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
        lottie: "/lottie/health.json",
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
                "group cursor-pointer relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border mb-2",
                isActive 
                    ? "bg-[#e6f0ff] border-[#d1e3ff]" 
                    : "border-transparent hover:bg-muted/30"
            )}
            onClick={() => setActiveTab(ind.id)}
        >
            {isActive && (
                <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-[#2563eb] rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                    isActive ? "bg-[#2563eb] text-white shadow-sm" : "bg-[#f1f5f9] text-slate-500 group-hover:bg-[#e2e8f0]"
                )}>
                    <ind.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "text-[16px] font-bold truncate transition-colors",
                        isActive ? "text-[#0f172a]" : "text-slate-600 group-hover:text-foreground"
                    )}>
                        {ind.name}
                    </h3>
                    <p className={cn(
                        "text-[13px] truncate transition-colors font-medium mt-0.5",
                        isActive ? "text-[#3b82f6]" : "text-slate-400"
                    )}>
                        {ind.subtitle}
                    </p>
                </div>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#3b82f6] flex-shrink-0"
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

                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-foreground tracking-tight">
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
                                    initial={{ opacity: 0, x: 10, y: 5 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    exit={{ opacity: 0, x: -10, y: -5 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="relative z-10 bg-[#f4f8ff] border border-blue-100 shadow-sm p-8 md:p-12 rounded-[2rem] min-h-[520px] flex flex-col"
                                >
                                    <div className="relative z-10 flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-[#dce8ff] text-[#2563eb] flex items-center justify-center border border-[#c1d8ff]">
                                                        <activeIndustry.icon className="w-6 h-6" />
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-[#0f172a] font-manrope">
                                                        {activeIndustry.name}
                                                    </h3>
                                                </div>

                                                <p className="text-[17px] text-slate-600 leading-relaxed max-w-2xl font-medium">
                                                    {activeIndustry.description}
                                                </p>
                                            </div>
                                            <div className="w-40 h-28 hidden md:flex items-center justify-end flex-shrink-0 opacity-80">
                                                <LottieAnimation src={activeIndustry.lottie} speed={0.8} className="w-full h-full object-contain" />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                                            {/* Challenges */}
                                            <div className="space-y-5 bg-[#f8f9fa] p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                                                <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Common Challenges
                                                </h4>
                                                <ul className="space-y-4">
                                                    {activeIndustry.challenges.map((challenge, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600 font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#fca5a5] mt-2 flex-shrink-0" />
                                                            {challenge}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Solutions */}
                                            <div className="space-y-5 bg-[#eaf2ff] p-6 rounded-2xl border border-blue-100 shadow-sm">
                                                <h4 className="text-[13px] font-bold text-[#2563eb] uppercase tracking-wider flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    How We Help
                                                </h4>
                                                <ul className="space-y-4">
                                                    {activeIndustry.solutions.map((solution, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-[15px] text-[#0f172a] font-medium">
                                                            <CheckCircle2 className="w-5 h-5 text-[#2563eb] mt-[2px] flex-shrink-0" />
                                                            <span>{solution.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer / CTA */}
                                    <div className="pt-6 flex flex-wrap gap-4 items-center justify-between relative z-10">
                                        <Button asChild className="rounded-full px-8 h-12 gap-2 text-[15px] font-semibold bg-[#2563eb] hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 transition-all">
                                            <Link href={activeIndustry.href}>
                                                {activeIndustry.cta}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>

                                        <Link href="/services" className="text-[15px] font-semibold text-[#0f172a] hover:text-[#2563eb] transition-colors">
                                            View All Services
                                        </Link>
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
