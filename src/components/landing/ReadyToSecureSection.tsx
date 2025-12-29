"use client";
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from "@/components/ui/button";

export default function ReadyToSecureSection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for reading direction (scrolling down -> move up)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden bg-background text-foreground"
        >
            {/* Parallax Background */}
            <motion.div
                style={{ y, backgroundImage: "url('/assets/ready-bg.png')" }}
                className="absolute inset-0 z-0 bg-cover bg-center scale-110 opacity-40 dark:opacity-100"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 dark:bg-black/40 z-0" />

            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-medium text-foreground tracking-tight"
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
                    <Button className="h-12 px-8 rounded-full text-sm">
                        Talk to a Security Expert
                    </Button>
                    <Button variant="secondary" className="h-12 px-8 rounded-full flex items-center gap-2 group bg-muted text-foreground hover:bg-muted/80">
                        Request Assessment
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
