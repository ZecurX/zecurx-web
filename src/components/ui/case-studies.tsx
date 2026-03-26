"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
    ShieldCheck, Bug, Scan,
    Cloud, Container, GitBranch,
    Brain, ShieldAlert, Bot,
    FileCheck, Award, Scale,
    LucideIcon,
} from "lucide-react";
import Image from "next/image";

import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

/** Map of string icon names to Lucide components */
const iconMap: Record<string, LucideIcon> = {
    ShieldCheck, Bug, Scan,
    Cloud, Container, GitBranch,
    Brain, ShieldAlert, Bot,
    FileCheck, Award, Scale,
};

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !("matchMedia" in window)) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
        setReduced(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);
    return reduced;
}

/** Parse metric values like "98%", "3.8x", "48h" */
function parseMetricValue(raw: string) {
    const value = (raw ?? "").toString().trim();
    const m = value.match(
        /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
    );
    if (!m) {
        return { prefix: "", end: 0, suffix: value, decimals: 0 };
    }
    const [, prefix, num, suffix] = m;
    const normalized = num.replace(/,/g, "");
    const end = parseFloat(normalized);
    const decimals = normalized.split(".")[1]?.length ?? 0;
    return {
        prefix: prefix ?? "",
        end: isNaN(end) ? 0 : end,
        suffix: suffix ?? "",
        decimals,
    };
}

/** Animated metric */
function MetricStat({
    value,
    label,
    sub,
    duration = 1.6,
}: {
    value: string;
    label: string;
    sub?: string;
    duration?: number;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const { prefix, end, suffix, decimals } = parseMetricValue(value);

    return (
        <div className="flex flex-col gap-1 text-left">
            <p
                className="text-3xl md:text-4xl font-manrope font-bold text-[#0c1a2e] mb-2"
                aria-label={`${label} ${value}`}
            >
                {prefix}
                {reduceMotion ? (
                    <span>
                        {end.toLocaleString(undefined, {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals,
                        })}
                    </span>
                ) : (
                    <CountUp
                        end={end}
                        decimals={decimals}
                        duration={duration}
                        separator=","
                        enableScrollSpy
                        scrollSpyOnce
                    />
                )}
                {suffix}
            </p>
            <p className="font-semibold font-inter text-slate-700 text-left">{label}</p>
            {sub ? (
                <p className="text-slate-500 font-inter text-left text-sm mt-1">{sub}</p>
            ) : null}
        </div>
    );
}

export interface CaseStudy {
    id: number;
    quote: string;
    heading: string;
    name: string;
    role: string;
    image: string;
    icon: string;
    lottie?: string;
    metrics: { value: string; label: string; sub?: string }[];
}

interface CaseStudiesProps {
    title?: string;
    subtitle?: string;
    studies: CaseStudy[];
}

export default function CaseStudies({
    title = "Real results, proven impact",
    subtitle = "See how our security assessments have helped teams ship with confidence.",
    studies,
}: CaseStudiesProps) {
    return (
        <section
            className="py-20 md:py-32 px-6 relative z-10"
            aria-labelledby="case-studies-heading"
        >
            <div className="max-w-[1320px] mx-auto">
                {/* Header */}
                <BlurFade delay={0.1}>
                    <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                        <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                            SUCCESS STORIES
                        </span>
                        <h2
                            id="case-studies-heading"
                            className="text-3xl font-bold md:text-5xl font-manrope text-[#0c1a2e]"
                        >
                            {title}
                        </h2>
                        <p className="text-slate-600 font-inter text-lg">{subtitle}</p>
                    </div>
                </BlurFade>

                {/* Cases */}
                <div className="flex flex-col gap-8 lg:gap-12">
                    {studies.map((study, idx) => {
                        const reversed = idx % 2 === 1;
                        const Icon = iconMap[study.icon] ?? ShieldCheck;
                        return (
                            <BlurFade key={study.id} delay={0.2 + (idx * 0.1)}>
                                <div className="group glass-card relative bg-white/50 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] transition-all duration-500 rounded-3xl overflow-hidden p-6 md:p-10 lg:p-12">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c69e4]/5 blur-[60px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                    
                                        {/* Content Block (Metrics + Quote) */}
                                        <div className={`grid gap-12 lg:grid-cols-2 xl:gap-20 items-center relative z-10 w-full`}>
                                            
                                            {/* Text & Metrics Column */}
                                            <div className={`flex flex-col gap-10 ${reversed ? 'lg:order-2' : ''}`}>
                                                {/* Quote Content */}
                                                <figure className="flex flex-col gap-6 text-left">
                                                    <div className="w-16 h-16 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4c69e4]/5 transition-all duration-500 shadow-sm">
                                                        <Icon className="w-7 h-7 text-[#4c69e4]" />
                                                    </div>
                                                    <blockquote className="text-left">
                                                        <h3 className="text-3xl lg:text-4xl font-bold font-manrope text-[#0c1a2e] leading-tight mb-6 group-hover:text-[#4c69e4] transition-colors duration-300">
                                                            {study.heading}
                                                        </h3>
                                                        <p className="text-slate-600 font-inter text-lg sm:text-xl leading-relaxed mb-8 italic">
                                                            "{study.quote}"
                                                        </p>
                                                        <footer className="flex flex-col">
                                                            <span className="font-semibold font-inter text-[#0c1a2e] text-lg">{study.name}</span>
                                                            <span className="text-base font-inter text-slate-500 mt-1">{study.role}</span>
                                                        </footer>
                                                    </blockquote>
                                                </figure>

                                                {/* Metrics Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-200/60">
                                                    {study.metrics.map((metric, i) => (
                                                        <div key={`${study.id}-${i}`} className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-[0_8px_30px_rgba(30,58,95,0.04)] hover:shadow-[0_12px_40px_rgba(30,58,95,0.08)] hover:-translate-y-1 transition-all duration-300">
                                                            <MetricStat
                                                                value={metric.value}
                                                                label={metric.label}
                                                                sub={metric.sub}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Illustration / Lottie Column */}
                                            <div className={`flex items-center justify-center w-full ${reversed ? 'lg:order-1' : ''}`}>
                                                <div className="relative w-full max-w-[400px] lg:max-w-[500px]">
                                                    {/* Background blob for extra pop */}
                                                    <div className="absolute inset-0 bg-[#4c69e4]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#4c69e4]/10 transition-colors duration-700" />
                                                    
                                                    {study.lottie ? (
                                                        <div className="relative z-10 flex items-center justify-center w-full aspect-square group-hover:scale-[1.02] group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                                                            <LottieAnimation src={study.lottie} className="w-full h-full object-contain drop-shadow-xl" />
                                                        </div>
                                                    ) : (
                                                        <div className="relative z-10 flex items-center justify-center w-full aspect-[4/5] p-2 group-hover:scale-[1.02] group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                                                            <Image
                                                                src={study.image}
                                                                alt={`${study.heading} illustration`}
                                                                width={500}
                                                                height={600}
                                                                className="h-auto w-full rounded-[2.5rem] object-cover drop-shadow-xl border border-white/50"
                                                                loading="lazy"
                                                                decoding="async"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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
