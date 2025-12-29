"use client";

import React, { useRef } from 'react';
import { imgEllipse106 } from './assets';
import HeroVideoCard from './HeroVideoCard';
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    return (
        <section ref={ref} className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20">

            {/* --- Parallax Image Background --- */}
            <motion.div
                style={{ y: yBg, opacity: opacityBg }}
                className="absolute inset-0 z-0"
            >
                <img
                    src="/hero-bg.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-80"
                />
            </motion.div>

            {/* Content Container */}
            <div className="flex flex-col items-center justify-center space-y-8 z-10 text-center mt-20">

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-8 relative z-20"
                >
                    Security & Technology <br className="hidden md:block" />
                    That Grows With You.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="max-w-3xl text-lg md:text-xl text-gray-400 font-manrope font-light leading-relaxed"
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
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                            <span className="text-white text-xl">↗</span>
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
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />
        </section >
    );
}
