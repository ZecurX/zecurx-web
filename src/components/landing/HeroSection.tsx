"use client";

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function HeroSection() {

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Parallax Effect
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], ["0%", "20%"]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 transition-colors duration-500">

            {/* Background Image / Glow */}
            <div className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none">

                {/* Dashboard Image Backdrop */}
                <div className="absolute max-w-[1400px] left-1/2 -translate-x-1/2 top-0 h-[900px] w-full opacity-100">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/95 via-40% to-background z-20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-20" />

                        {/* Dark Mode Image */}
                        <div className="absolute inset-0 hidden dark:block">
                            <img
                                src="/images/dashboard-hero.png"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover object-top opacity-100"
                            />
                        </div>

                        {/* Light Mode Image */}
                        <div className="absolute inset-0 dark:hidden">
                            <img
                                src="/images/dashboard-hero-light.png"
                                alt="Dashboard Preview"
                                className="w-full h-full object-cover object-top opacity-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-10" />
            </div>

            {/* Content Container */}
            <div className="flex flex-col items-center justify-center space-y-8 z-20 text-center mt-10 max-w-5xl mx-auto">



                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-bold font-manrope tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 mb-6"
                >
                    Security that actually <br className="hidden md:block" />
                    works for you.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="max-w-3xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
                >
                    Unified visibility, automated detection, and seamless response. <br className="hidden md:block" />
                    Protect your infrastructure with the world's most advanced AI security platform.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    className="flex items-center gap-4 mt-8 relative z-30"
                >
                    {/* Primary Button - Request Demo */}
                    <Link href="/book-demo">
                        <button className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-lg">
                            Start for free
                        </button>
                    </Link>

                    {/* Secondary Button - Contact */}
                    <Link href="/contact">
                        <button className="px-8 py-4 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-full hover:bg-foreground/5 transition-colors backdrop-blur-sm cursor-pointer">
                            Book a demo
                        </button>
                    </Link>
                </motion.div>

            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section >
    );
}
