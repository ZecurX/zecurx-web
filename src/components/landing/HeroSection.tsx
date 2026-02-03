"use client";

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

import { TextAnimate } from "@/components/ui/text-animate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ShinyButton } from "@/components/ui/shiny-button";
import FluidBackground from "@/components/ui/fluid-background";
import { cn } from "@/lib/utils";

export default function HeroSection() {

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Parallax Effect
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], ["0%", "20%"]);
    const imageRotate = useTransform(scrollY, [0, 500], [12, 0]);
    const imageY = useTransform(scrollY, [0, 500], [0, -50]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full min-h-[110vh] bg-background overflow-hidden flex items-center justify-center px-4 pt-20 transition-colors duration-500">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <FluidBackground />
                <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Left: Content */}
                <div className="flex flex-col items-start space-y-8 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">Next-Gen Security</span>
                    </div>

                    <div className="overflow-hidden">
                        <TextAnimate 
                            animation="blurInUp" 
                            by="word" 
                            className="text-6xl sm:text-7xl md:text-8xl font-bold font-manrope tracking-tight leading-[1] text-foreground"
                        >
                            Security that evolves with you.
                        </TextAnimate>
                    </div>

                    <ScrollAnimation direction="up" delay={0.2}>
                        <p className="max-w-xl text-xl text-muted-foreground font-light leading-relaxed">
                            We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems with practical, real-world security testing.
                        </p>
                    </ScrollAnimation>

                    <ScrollAnimation direction="up" delay={0.3}>
                        <div className="flex items-center gap-4 mt-4">
                            <Link href="/book-demo">
                                <ShimmerButton className="shadow-xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                        Start for free
                                    </span>
                                </ShimmerButton>
                            </Link>

                            <Link href="/contact">
                                <ShinyButton className="bg-background/50 text-foreground border-border h-[44px] rounded-full backdrop-blur-md">
                                    Book a demo
                                </ShinyButton>
                            </Link>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Right: 3D Floating Dashboard - REMOVED */}
                <div className="relative h-[600px] w-full perspective-1000 hidden lg:block">
                    {/* Image and floating cards removed as requested */}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section >
    );
}

