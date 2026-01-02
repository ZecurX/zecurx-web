"use client";

import React from 'react';
import HeroVideoCard from './HeroVideoCard';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {

    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 transition-colors duration-500">

            {/* Modern Grid Texture */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            
            {/* Subtle Top Glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="flex flex-col items-center justify-center space-y-8 z-10 text-center mt-20">

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/50 mb-8 relative z-20"
                >
                    Security & Technology <br className="hidden md:block" />
                    That Grows With You.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="max-w-3xl text-lg md:text-xl text-muted-foreground font-manrope font-light leading-relaxed"
                >
                    AI-driven cybersecurity services, secure software engineering, and enterprise-ready security architectures — built to protect critical assets, reduce risk, and enable confident growth.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                    className="flex flex-col md:flex-row items-center gap-6 mt-8"
                >
                    {/* Primary Button */}
                    <Button
                        size="lg"
                        className="pl-8 pr-2 py-2 h-auto gap-6 rounded-full text-lg hover:scale-105 transition-transform duration-300 group"
                    >
                        Talk to a Security Expert
                        <div className="w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                            <span className="text-xl">↗</span>
                        </div>
                    </Button>

                    {/* Secondary Button */}
                    <Button variant="secondary" size="lg" className="rounded-full text-base font-medium">
                        Explore ZecurX Academy →
                    </Button>
                </motion.div>

            </div>

            {/* Video Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                className="z-10 mt-12 w-full max-w-5xl"
            >
                <HeroVideoCard />
            </motion.div>


            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section >
    );
}
