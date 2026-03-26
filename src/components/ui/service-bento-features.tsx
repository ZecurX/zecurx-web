"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import {
    Shield, Key, Search, Bug, Code, CheckCircle,
    Cloud, Lock, Container, GitBranch, FileCode, KeyRound,
    AlertTriangle, Unlock, Link, Dice5,
    Target, Building, ShieldCheck, Brain, Bot, Fingerprint,
    BarChart3, FileText, Settings, Users,
    ClipboardCheck, FileCheck, Scale, Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Shield, Key, Search, Bug, Code, CheckCircle,
    Cloud, Lock, Container, GitBranch, FileCode, KeyRound,
    AlertTriangle, Unlock, Link, Dice5,
    Target, Building, ShieldCheck, Brain, Bot, Fingerprint,
    BarChart3, FileText, Settings, Users,
    ClipboardCheck, FileCheck, Scale, Heart,
};

export interface BentoItem {
    title: string;
    desc: string;
    icon: string;
    /** Column span in the 6-col grid: 2, 3, or 6 */
    span?: 2 | 3 | 6;
    /** Optional badge text */
    badge?: string;
    /** Visual variant */
    variant?: "default" | "stat" | "chart" | "highlight";
    /** Stat value for the "stat" variant */
    statValue?: string;
    /** Lottie animation path */
    lottie?: string;
}

interface ServiceBentoFeaturesProps {
    label: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    items: BentoItem[];
}

export default function ServiceBentoFeatures({
    label,
    title,
    titleAccent,
    subtitle,
    items,
}: ServiceBentoFeaturesProps) {
    return (
        <section className="py-20 md:py-32 px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <BlurFade delay={0.1}>
                    <div className="max-w-2xl mb-16">
                        <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-4">
                            {label}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6 leading-tight">
                            {title}{" "}
                            <span className="text-[#4c69e4]">{titleAccent}</span>
                        </h2>
                        <p className="text-lg text-slate-600 font-inter leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                </BlurFade>

                {/* Bento grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                    {items.map((item, i) => {
                        const Icon = iconMap[item.icon] ?? Shield;
                        const span = item.span ?? (i < 3 ? 2 : 3);
                        const variant = item.variant ?? "default";

                        // Dynamic column span class
                        const spanClass =
                            span === 6
                                ? "col-span-1 sm:col-span-2 lg:col-span-6"
                                : span === 3
                                    ? "col-span-1 sm:col-span-1 lg:col-span-3"
                                    : "col-span-1 sm:col-span-1 lg:col-span-2";

                        if (variant === "stat") {
                            return (
                                <BlurFade key={i} delay={0.2 + (i * 0.1)} className={`relative flex ${spanClass}`}>
                                    <div className="group glass-card w-full relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                        <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                                            <div className="flex h-24 w-full justify-center items-center mb-2">
                                                <span className="text-6xl md:text-7xl font-manrope font-bold tracking-tight text-[#0c1a2e]">
                                                    {item.statValue ?? "100%"}
                                                </span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-manrope font-bold text-[#0c1a2e] mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 font-inter text-sm max-w-[240px] mx-auto">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </BlurFade>
                            );
                        }

                        if (variant === "chart") {
                            return (
                                <BlurFade key={i} delay={0.2 + (i * 0.1)} className={`relative ${spanClass}`}>
                                    <div className="group glass-card w-full h-full relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                        <div className="relative z-10 p-8 flex flex-col items-center text-center h-full">
                                            <div className="w-20 h-20 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="w-8 h-8 text-[#4c69e4]" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-manrope font-bold text-[#0c1a2e] mb-3">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 font-inter text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </BlurFade>
                            );
                        }

                        if (variant === "highlight") {
                            return (
                                <BlurFade key={i} delay={0.2 + (i * 0.1)} className={`relative ${spanClass}`}>
                                    <div className="group glass-card w-full h-full relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c69e4]/5 blur-[60px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                        <div className="grid pt-6 sm:grid-cols-[1.3fr_1fr] gap-8 h-full relative z-10">
                                            <div className="flex flex-col justify-between p-8 space-y-8">
                                                <div className="w-14 h-14 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="w-6 h-6 text-[#4c69e4]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl lg:text-[28px] font-manrope font-bold text-[#0c1a2e] mb-4 leading-tight">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-slate-600 font-inter leading-relaxed">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="rounded-tl-3xl relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-slate-200/60 bg-[#f8fbff]/80 p-6 py-12 sm:ml-6 flex items-center justify-center min-h-[240px]">
                                                <div className="absolute left-4 top-4 flex gap-1.5">
                                                    <span className="block w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                    <span className="block w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                    <span className="block w-2.5 h-2.5 rounded-full bg-slate-200" />
                                                </div>
                                                {item.lottie ? (
                                                    <div className="relative w-full max-w-[280px] flex items-center justify-center">
                                                        <LottieAnimation src={item.lottie} className="w-full h-auto" />
                                                    </div>
                                                ) : (
                                                    <div className="relative flex items-center justify-center size-28 sm:size-36 rounded-full bg-white border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                        <Icon className="size-12 sm:size-16 text-[#4c69e4]/40" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </BlurFade>
                            );
                        }

                        // Default card
                        return (
                            <BlurFade key={i} delay={0.2 + (i * 0.1)} className={`relative ${spanClass}`}>
                                <div className="group glass-card w-full h-full relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                    
                                    <div className="w-14 h-14 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                        <Icon className="w-6 h-6 text-[#4c69e4]" />
                                    </div>
                                    
                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-manrope font-bold text-[#0c1a2e] group-hover:text-[#4c69e4] transition-colors">
                                                {item.title}
                                            </h3>
                                            {item.badge && (
                                                <span className="text-[11px] font-space-grotesk font-semibold uppercase tracking-widest text-[#4c69e4] bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-600 font-inter text-[15px] leading-relaxed flex-1">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </BlurFade>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
