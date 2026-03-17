"use client";

import { Card, CardContent } from "@/components/ui/card";
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
        <section className="py-20 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="max-w-2xl mb-16">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">
                        {label}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                        {title}{" "}
                        <span className="text-muted-foreground">{titleAccent}</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Bento grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
                                <Card key={i} className={`relative flex overflow-hidden ${spanClass}`}>
                                    <CardContent className="relative m-auto size-fit pt-6 pb-8">
                                        <div className="relative flex h-24 w-full justify-center items-center">
                                            <span className="mx-auto block w-fit text-6xl md:text-7xl font-semibold tracking-tighter text-foreground">
                                                {item.statValue ?? "100%"}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 text-center text-xl sm:text-2xl font-semibold text-foreground whitespace-nowrap">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-center text-sm mt-2 max-w-[240px] mx-auto">
                                            {item.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        }

                        if (variant === "chart") {
                            return (
                                <Card key={i} className={`relative overflow-hidden ${spanClass}`}>
                                    <CardContent className="pt-6 pb-8">
                                        <div className="pt-2 lg:px-2 flex justify-center pb-4">
                                            <div className="relative flex items-center justify-center size-20 rounded-full bg-primary/5 border border-primary/10">
                                                <Icon className="size-8 text-primary/60" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-4 space-y-2 text-center">
                                            <h3 className="text-lg sm:text-xl font-semibold text-foreground transition whitespace-nowrap">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }

                        if (variant === "highlight") {
                            return (
                                <Card key={i} className={`relative overflow-hidden ${spanClass}`}>
                                    <CardContent className="grid pt-6 sm:grid-cols-[1.3fr_1fr] gap-8">
                                        <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                            <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                                <Icon className="m-auto size-5 text-primary" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-2 pb-6">
                                                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-foreground transition tracking-tight whitespace-nowrap">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm sm:text-base max-w-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rounded-tl-2xl relative -mb-6 -mr-6 mt-6 h-fit border-l border-t bg-muted/20 p-6 py-12 sm:ml-6 flex items-center justify-center min-h-[200px]">
                                            <div className="absolute left-3 top-2 flex gap-1">
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                            </div>
                                            <div className="relative flex items-center justify-center size-28 sm:size-36 rounded-full bg-background border shadow-sm">
                                                <Icon className="size-12 sm:size-16 text-primary/40" strokeWidth={1} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }

                        // Default card
                        return (
                            <Card key={i} className={`relative overflow-hidden ${spanClass}`}>
                                <CardContent className="pt-6 pb-8">
                                    <div className="relative mx-auto flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6">
                                        <Icon className="m-auto size-5 text-primary" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg sm:text-xl font-semibold text-foreground whitespace-nowrap">
                                                {item.title}
                                            </h3>
                                            {item.badge && (
                                                <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
