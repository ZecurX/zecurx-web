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
        <div className="flex flex-col gap-2 text-left p-6">
            <p
                className="text-2xl font-medium text-foreground sm:text-4xl"
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
            <p className="font-medium text-foreground text-left">{label}</p>
            {sub ? (
                <p className="text-muted-foreground text-left text-sm">{sub}</p>
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
            className="py-20 md:py-32 bg-background"
            aria-labelledby="case-studies-heading"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
                    <h2
                        id="case-studies-heading"
                        className="text-3xl font-bold md:text-5xl text-foreground"
                    >
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-lg">{subtitle}</p>
                </div>

                {/* Cases */}
                <div className="flex flex-col gap-20">
                    {studies.map((study, idx) => {
                        const reversed = idx % 2 === 1;
                        const Icon = iconMap[study.icon] ?? ShieldCheck;
                        return (
                            <div
                                key={study.id}
                                className="grid gap-12 lg:grid-cols-3 xl:gap-24 items-center border-b border-border/40 pb-12"
                            >
                                {/* Left: Image + Quote */}
                                <div
                                    className={[
                                        "flex flex-col sm:flex-row gap-10 lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16 text-left",
                                        reversed
                                            ? "lg:order-2 lg:border-r-0 lg:border-l border-border/40 lg:pl-12 xl:pl-16 lg:pr-0"
                                            : "border-border/40",
                                    ].join(" ")}
                                >
                                    <Image
                                        src={study.image}
                                        alt={`${study.heading} illustration`}
                                        width={300}
                                        height={400}
                                        className="aspect-[29/35] h-auto w-full max-w-60 rounded-2xl object-cover ring-1 ring-border hover:scale-[1.02] transition-all duration-300"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <figure className="flex flex-col justify-between gap-8 text-left">
                                        <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed text-left">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-foreground leading-relaxed text-left">
                                                {study.heading}
                                                <span className="block text-muted-foreground text-sm sm:text-base lg:text-lg mt-3 font-normal">
                                                    {study.quote}
                                                </span>
                                            </h3>
                                        </blockquote>
                                    </figure>
                                </div>

                                {/* Right: Metrics */}
                                <div
                                    className={[
                                        "grid grid-cols-1 gap-10 self-center text-left",
                                        reversed ? "lg:order-1" : "",
                                    ].join(" ")}
                                >
                                    {study.metrics.map((metric, i) => (
                                        <MetricStat
                                            key={`${study.id}-${i}`}
                                            value={metric.value}
                                            label={metric.label}
                                            sub={metric.sub}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
