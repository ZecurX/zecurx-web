"use client";

import React from 'react';
import { motion } from "framer-motion";

export default function ResourcesHero() {
    return (
        <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">

            {/* Modern Grid Texture */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Subtle Top Glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Headline - Matching Homepage Typography */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                        Resources<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">& Insights</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-3xl mx-auto">
                        Stay informed with expert insights, technical research, real-world case studies, and educational resources from ZecurX cybersecurity professionals.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
