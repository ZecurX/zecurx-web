"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* ---- Background effects ---- */}

      {/* Single radial glow — accent-tinted, subtle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.70 0.14 230 / 0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* Animated particles */}
      <Particles
        className="absolute inset-0"
        quantity={70}
        color="#38bdf8"
        size={0.4}
        staticity={50}
        ease={50}
      />

      {/* ---- Content — centered ---- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
        {/* Pill badge */}
        <BlurFade delay={0} inView={true} direction="up">
          <div className="inline-flex mb-8">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <AnimatedShinyText className="text-xs text-muted-foreground font-inter font-medium">
                Trusted by 50+ companies across India
              </AnimatedShinyText>
            </div>
          </div>
        </BlurFade>

        {/* Headline */}
        <BlurFade delay={0.1} inView={true} direction="up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-manrope font-semibold tracking-tight text-foreground leading-[1.05]">
            Find vulnerabilities
            <br />
            <span className="text-muted-foreground">before attackers do.</span>
          </h1>
        </BlurFade>

        {/* Subtitle */}
        <BlurFade delay={0.25} inView={true} direction="up">
          <p className="mt-7 text-lg md:text-xl text-muted-foreground font-inter leading-relaxed max-w-2xl mx-auto">
            Penetration testing, cloud security audits, and compliance readiness
            for{" "}
            <WordRotate
              words={["startups", "AI teams", "enterprises", "fintechs"]}
              className="inline-block text-lg md:text-xl text-foreground font-inter font-medium"
            />
            .
          </p>
        </BlurFade>

        {/* CTAs */}
        <BlurFade delay={0.4} inView={true} direction="up">
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <ShimmerButton
                background="oklch(0.70 0.14 230)"
                shimmerColor="#38bdf8"
                borderRadius="100px"
                className="px-7 py-3.5 text-sm font-semibold font-inter"
              >
                <span className="group flex items-center gap-2">
                  Get a Free Assessment
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </ShimmerButton>
            </Link>
            <Link href="/how-we-work">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="border border-border text-foreground rounded-full px-7 py-3.5 text-sm font-inter font-medium cursor-pointer transition-colors duration-200 hover:border-foreground/30 hover:bg-card"
              >
                See How We Work
              </motion.button>
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
