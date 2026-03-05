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

/** A decorative wave SVG for stat cards */
function WaveSVG({ index = 0 }: { index?: number }) {
    const flipX = index % 2 === 0;
    const flipY = Math.floor(index / 2) % 2 === 0;
    const transform = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1}) translate(${flipX ? -254 : 0}, ${flipY ? -104 : 0})`;

    return (
        <svg
            className="text-muted/60 absolute inset-0 size-full"
            viewBox="0 0 254 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                transform={transform}
                d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                fill="currentColor"
            />
        </svg>
    );
}

/** A decorative mini chart SVG for chart-variant cards */
function MiniChartSVG({ index = 0 }: { index?: number }) {
    const chartPaths = [
        "M0 60C10 55 20 40 40 35C60 30 80 45 100 42C120 39 140 20 160 15C180 10 200 25 220 30C240 35 260 18 280 12C300 6 320 22 340 28C360 34 370 40 386 45",
        "M0 45C30 45 60 15 90 20C120 25 150 65 180 60C210 55 240 20 270 25C300 30 330 60 360 55C370 53 380 48 386 45",
        "M0 70C40 70 60 30 100 35C140 40 160 65 200 60C240 55 260 25 300 30C340 35 360 60 386 55",
        "M0 25C40 20 60 60 100 55C140 50 160 10 200 15C240 20 260 55 300 50C340 45 360 20 386 15",
        "M0 50C60 10 100 10 160 50C220 80 260 10 320 50C350 70 370 70 386 60",
        "M0 40C20 20 40 60 60 40C80 20 100 60 120 40C140 20 160 60 180 40C200 20 220 60 240 40C260 20 280 60 300 40C320 20 340 60 360 40C370 30 380 30 386 40",
        "M0 65C30 50 50 20 90 25C130 30 150 75 190 70C230 65 250 20 290 25C330 30 350 75 386 70"
    ];

    const pathValue = chartPaths[index % chartPaths.length];
    const fillPath = `M0 80 ${pathValue.replace(/^M0/, 'L0')} V80H0Z`;
    const gradientId = `bentoPaint-${index}`;

    return (
        <svg
            className="w-full text-primary/10"
            viewBox="0 0 386 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={fillPath}
                fill={`url(#${gradientId})`}
            />
            <path
                className="text-primary"
                d={pathValue}
                stroke="currentColor"
                strokeWidth="2"
            />
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" className="text-primary/20" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" className="text-transparent" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function NetworkSVG({ index = 0 }: { index?: number }) {
    const flipY = index % 2 === 0 ? 1 : -1;
    const transform = `scale(1, ${flipY}) translate(0, ${flipY === -1 ? -80 : 0})`;
    return (
        <svg className="w-full text-primary" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={transform}>
                <path d="M40 50 L100 20 L200 60 L300 30 L350 45" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
                <path d="M40 50 L120 70 L220 20 L280 65 L350 45" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" />
                <circle cx="40" cy="50" r="3" fill="currentColor" />
                <circle cx="100" cy="20" r="4.5" fill="currentColor" className="text-primary/80" />
                <circle cx="200" cy="60" r="6" fill="currentColor" />
                <circle cx="300" cy="30" r="4.5" fill="currentColor" className="text-primary/80" />
                <circle cx="350" cy="45" r="3" fill="currentColor" />
                <circle cx="120" cy="70" r="3" fill="currentColor" className="text-primary/50" />
                <circle cx="220" cy="20" r="3" fill="currentColor" className="text-primary/50" />
                <circle cx="280" cy="65" r="2.5" fill="currentColor" className="text-primary/50" />
                <circle cx="200" cy="60" r="16" fill="currentColor" className="text-primary/10" />
                <circle cx="100" cy="20" r="12" fill="currentColor" className="text-primary/10" />
            </g>
        </svg>
    );
}

function CodeLinesSVG({ index = 0 }: { index?: number }) {
    const opacity1 = (index % 3) === 0 ? "0.8" : "0.3";
    const opacity2 = (index % 3) === 1 ? "0.8" : "0.3";
    const opacity3 = (index % 3) === 2 ? "0.8" : "0.3";
    return (
        <svg className="w-full text-primary" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="10" width="346" height="60" rx="6" fill="currentColor" className="text-primary/5 stroke-border" strokeWidth="1" />
            <circle cx="36" cy="22" r="3" fill="currentColor" className="text-primary/30" />
            <circle cx="50" cy="22" r="3" fill="currentColor" className="text-primary/30" />
            <circle cx="64" cy="22" r="3" fill="currentColor" className="text-primary/30" />
            <rect x="36" y="36" width="120" height="4" rx="2" fill="currentColor" fillOpacity={opacity1} />
            <rect x="36" y="48" width="220" height="4" rx="2" fill="currentColor" fillOpacity={opacity2} />
            <rect x="52" y="60" width="160" height="4" rx="2" fill="currentColor" fillOpacity={opacity3} />
            <rect x="180" y="36" width="80" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
    );
}

function PulseShieldSVG() {
    return (
        <svg className="w-full text-primary" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 L386 40" stroke="currentColor" strokeWidth="1" className="text-primary/20" strokeDasharray="4 4" />
            <rect x="0" y="39" width="386" height="2" fill="currentColor" className="text-primary/10" />
            <g transform="translate(193, 40)">
                <circle cx="0" cy="0" r="34" fill="currentColor" className="text-primary/5" />
                <circle cx="0" cy="0" r="24" fill="currentColor" className="text-primary/10" />
                <path d="M0 -14 L14 -7 L14 5 C14 12 7 18 0 22 C-7 18 -14 12 -14 5 L-14 -7 L0 -14 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" className="text-primary/20" />
                <path d="M0 -9 L9 -4.5 L9 3 C9 7.5 4.5 11 0 13.5 C-4.5 11 -9 7.5 -9 3 L-9 -4.5 L0 -9 Z" fill="currentColor" />
            </g>
            <circle cx="100" cy="40" r="3" fill="currentColor" className="text-primary/40" />
            <circle cx="286" cy="40" r="3" fill="currentColor" className="text-primary/40" />
        </svg>
    );
}

function BinaryStreamSVG({ index = 0 }: { index?: number }) {
    const streams = ["01001011 01100101", "01010011 01100101", "01110010 01100101", "11001010 10101100", "00110101 10011010", "10111000 00101101"];
    const s1 = streams[(index) % streams.length];
    const s2 = streams[(index + 1) % streams.length];
    const s3 = streams[(index + 2) % streams.length];
    const s4 = streams[(index + 3) % streams.length];
    const s5 = streams[(index + 4) % streams.length];
    return (
        <svg className="w-full text-primary font-mono" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="30" y="30" fill="currentColor" fontSize="12" className="text-primary/40" letterSpacing="3">{s1}</text>
            <text x="170" y="50" fill="currentColor" fontSize="12" className="text-primary/70" letterSpacing="3">{s2}</text>
            <text x="290" y="25" fill="currentColor" fontSize="12" className="text-primary/30" letterSpacing="3">{s3}</text>
            <text x="70" y="65" fill="currentColor" fontSize="12" className="text-primary/50" letterSpacing="3">{s4}</text>
            <text x="260" y="70" fill="currentColor" fontSize="12" className="text-primary/40" letterSpacing="3">{s5}</text>
        </svg>
    );
}

function DigitalLockSVG({ index = 0 }: { index?: number }) {
    return (
        <svg className="w-full text-primary" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id={`gridp-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary/20" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#gridp-${index})`} />
            <g transform="translate(193, 40)">
                <rect x="-16" y="-4" width="32" height="24" rx="4" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="2" />
                <path d="M-8 -4 V-12 C-8 -17 8 -17 8 -12 V-4" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="0" cy="8" r="3" fill="currentColor" />
                <path d="M0 11 V16" stroke="currentColor" strokeWidth="2" />
                <circle cx="0" cy="2" r="34" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-primary/30" fill="none" />
            </g>
        </svg>
    );
}

function DynamicVisual({ index = 0 }: { index?: number }) {
    const visualType = index % 5;
    if (visualType === 0) return <NetworkSVG index={index} />;
    if (visualType === 1) return <CodeLinesSVG index={index} />;
    if (visualType === 2) return <PulseShieldSVG />;
    if (visualType === 3) return <BinaryStreamSVG index={index} />;
    if (visualType === 4) return <DigitalLockSVG index={index} />;
    return <MiniChartSVG index={index} />;
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
                        const globalIndex = i + (titleAccent?.charCodeAt(0) || 0) + (subtitle?.length || 0);
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
                                    <CardContent className="relative m-auto size-fit pt-6">
                                        <div className="relative flex h-24 w-56 items-center">
                                            <WaveSVG index={globalIndex} />
                                            <span className="mx-auto block w-fit text-5xl font-semibold text-foreground">
                                                {item.statValue ?? "100%"}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 text-center text-2xl font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-center text-sm mt-2 max-w-[240px]">
                                            {item.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        }

                        if (variant === "chart") {
                            return (
                                <Card key={i} className={`relative overflow-hidden ${spanClass}`}>
                                    <CardContent className="pt-6">
                                        <div className="pt-2 lg:px-2">
                                            <DynamicVisual index={globalIndex} />                                        </div>
                                        <div className="relative z-10 mt-6 space-y-2 text-center">
                                            <h3 className="text-lg font-semibold text-foreground transition">
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
                                    <CardContent className="grid pt-6 sm:grid-cols-2">
                                        <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                            <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                                <Icon className="m-auto size-5" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-foreground transition">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                                            <div className="absolute left-3 top-2 flex gap-1">
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                                <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10" />
                                            </div>
                                            <div className="pt-4">
                                                <DynamicVisual index={globalIndex} />                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }

                        // Default card
                        return (
                            <Card key={i} className={`relative overflow-hidden ${spanClass}`}>
                                <CardContent className="pt-6">
                                    <div className="relative mx-auto flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5 mb-6">
                                        <Icon className="m-auto size-5 text-muted-foreground" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-foreground">
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
