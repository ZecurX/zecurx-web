"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type Easing } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EASE_OUT_EXPO: Easing = [0.16, 1, 0.3, 1];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: EASE_OUT_EXPO,
    },
  },
};

// Animated Grid Pattern Component (inline for simplicity)
function AnimatedGridPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div 
        className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default function HeroSectionV3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-24"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[80px] opacity-30 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen" />
        
        {/* Grid Pattern */}
        <AnimatedGridPattern className="opacity-100 dark:opacity-100" />
        
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-manrope tracking-tighter leading-[0.9] text-foreground"
          >
            <span className="block">Security that helps</span>
            <span className="block mt-2 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 dark:from-white dark:via-white/80 dark:to-white/50 bg-clip-text text-transparent">
              you ship faster.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 md:mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-balance"
          >
            ZecurX helps startups and AI teams secure applications, cloud infrastructure, and AI systems.
          </motion.p>

            {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group relative h-12 px-8 rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
            >
              <Link href="/contact">
                <span className="relative z-10">Start Protecting</span>
                <ArrowRight className="w-4 h-4 relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground to-foreground/90 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full border-border/50 hover:bg-muted/50 hover:border-border transition-all"
            >
              <Link href="/book-demo">
                Talk to Experts
              </Link>
            </Button>
          </motion.div>

          {/* Stats Row - REMOVED */}
          
        </motion.div>

        {/* Dashboard Preview - REMOVED */}
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
