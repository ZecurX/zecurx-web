"use client";
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export default function ReadyToSecureSection() {
    return (
        <section
            className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden bg-white dark:bg-zinc-950"
        >
            {/* Light Mode: Background */}
            <div
                style={{ backgroundImage: "url('/assets/light-bg.png')" }}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat dark:hidden scale-105"
            />
            {/* Light Mode Overlay for brightness */}
            <div className="absolute inset-0 bg-white/10 z-0 dark:hidden" />

            {/* Dark Mode: Background & Overlay */}
            <div
                style={{ backgroundImage: "url('/assets/dark-bg.png')" }}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat hidden dark:block opacity-100 scale-105"
            />
            {/* Reduced overlay opacity for brightness */}
            <div className="absolute inset-0 bg-black/20 z-0 hidden dark:block" />

            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-medium text-zinc-900 dark:text-white tracking-tight"
                >
                    Ready to <br className="hidden md:block" />
                    Secure Your Business?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Button className="h-12 px-8 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                        Talk to a Security Expert
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-12 px-8 rounded-full flex items-center gap-2 group border-zinc-200 hover:bg-zinc-100 dark:bg-white/10 dark:backdrop-blur-sm dark:border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:border-white/20 dark:shadow-lg dark:shadow-black/20"
                    >
                        Request Assessment
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
