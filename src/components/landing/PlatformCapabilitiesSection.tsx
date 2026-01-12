"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const capabilities = [
    {
        id: 1,
        title: "Endpoint Security",
        description: "Protect endpoints against sophisticated and persistent threats"
    },
    {
        id: 2,
        title: "Cloud Security (CNAPP)",
        description: "Secure cloud workloads, configurations, and cloud identities"
    },
    {
        id: 3,
        title: "Identity & Access Security",
        description: "Enforce least-privilege access and prevent identity abuse"
    },
    {
        id: 4,
        title: "Application Security",
        description: "Secure applications across the entire development lifecycle"
    },
    {
        id: 5,
        title: "Threat Intelligence & Hunting",
        description: "Proactively identify threats using real adversary intelligence"
    },
    {
        id: 6,
        title: "AI Detection & Response",
        description: "Accelerated detection powered by intelligent analytics"
    },
    {
        id: 7,
        title: "Security Automation (SOAR)",
        description: "Automated response workflows to reduce response time and impact"
    },
    {
        id: 8,
        title: "Data Protection",
        description: "Safeguard sensitive data across systems, platforms, and environments"
    }
];

import { ScrollAnimation } from "@/components/ui/scroll-animation";

export default function PlatformCapabilitiesSection() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(1);

    const platformRoutes = [
        '/platform/endpoint-security',
        '/platform/cloud-security',
        '/platform/identity-security',
        '/platform/application-security',
        '/platform/threat-intelligence',
        '/platform/ai-detection',
        '/platform/security-automation',
        '/platform/data-protection',
    ];

    return (
        <section className="relative w-full py-24 bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <ScrollAnimation direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-manrope font-medium text-foreground">
                            A Unified Enterprise Security Platform
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
                            A consolidated security approach that improves visibility, reduces operational complexity, and strengthens resilience across your digital ecosystem.
                        </p>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation direction="up" delay={0.2}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left: Capability List */}
                        <div className="space-y-2">
                            {capabilities.map((cap, i) => {
                                const isActive = i === activeIndex;
                                return (
                                    <div
                                        key={i}
                                        className="group cursor-pointer flex items-center justify-between py-2"
                                        onClick={() => setActiveIndex(i)}
                                        onMouseEnter={() => setActiveIndex(i)}
                                    >
                                        <h3 className={`text-2xl md:text-4xl font-manrope font-medium transition-all duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground/40 hover:text-muted-foreground/70'}`}>
                                            {cap.title}
                                        </h3>
                                        {isActive && (
                                            <ChevronRight className="w-6 h-6 text-foreground opacity-0 animate-fadeIn" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right: Feature Showcase Card */}
                        <div className="relative lg:pl-10">
                            <div className="sticky top-32">
                                <Card className="bg-muted/50 border border-border backdrop-blur-xl p-8 md:p-12 h-[520px] flex flex-col justify-between">
                                    <CardHeader className="p-0">
                                        {/* Content */}
                                        <h3 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground mb-6 animate-fadeIn key={activeIndex}">
                                            {capabilities[activeIndex].title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md animate-fadeIn delay-100 key={activeIndex + 'desc'}">
                                            {capabilities[activeIndex].description}
                                        </p>
                                    </CardContent>

                                    {/* Interactive Bottom Area */}
                                    <CardFooter className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 items-center animate-fadeIn delay-200">
                                        <button
                                            onClick={() => router.push('/book-demo')}
                                            className="bg-foreground text-background px-6 py-3 rounded-full font-manrope font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            Book a Demo
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => router.push(platformRoutes[activeIndex])}
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors group/btn"
                                        >
                                            Explore Feature
                                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </CardFooter>

                                </Card>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
