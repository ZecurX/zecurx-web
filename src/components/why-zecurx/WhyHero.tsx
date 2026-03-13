"use client";

import React from "react";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";

export default function WhyHero() {
  const titleEnd = heroEnd(5, heroEnd(1) + 100);

  return (
    <section className="relative w-full min-h-[60vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
      {/* Modern Grid Texture */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle Top Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-xl mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            <HeroWords>Our Approach</HeroWords>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-manrope font-bold tracking-tight text-foreground mb-8 relative z-20 leading-[1.1]">
            <HeroWords delay={heroEnd(1) + 100}>Security That </HeroWords>
            <br />
            <HeroWords delay={heroEnd(3, heroEnd(1) + 100)}>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40">
                Ships With You.
              </span>
            </HeroWords>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-manrope font-light leading-relaxed max-w-3xl mx-auto">
            <HeroWords delay={titleEnd + 100}>
              We don&apos;t sell tools or dashboards. We test like real
              attackers, report like developers expect, and help you fix what
              matters most.
            </HeroWords>
          </p>
        </div>
      </div>
    </section>
  );
}
