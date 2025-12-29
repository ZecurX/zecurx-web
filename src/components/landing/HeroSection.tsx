"use client";

import React, { useRef, useState, useEffect } from 'react';
import { imgEllipse106 } from './assets';
import HeroVideoCard from './HeroVideoCard';
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    return (
        <section ref={ref} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 transition-colors duration-500">



            {/* --- Parallax Image Background --- */}
            <motion.div
                style={{ y: yBg, opacity: opacityBg }}
                className="absolute inset-0 z-0"
            >
                {mounted && (
                    <img
                        src={theme === "light" ? "/assets/light-bg.png" : "/assets/dark-bg.png"}
                        alt="Hero 
                        Background"
                        className={cn(
                            "w-full h-full object-cover opacity-80",
                            theme === "light" ? "object-center scale-110" : "object-center"
                        )}
                    />
                )}
            </motion.div>

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
