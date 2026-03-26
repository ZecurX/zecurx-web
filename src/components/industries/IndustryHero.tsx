"use client";

import React from "react";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

export default function IndustryHero() {
  // badge = 1 word-group, title = 5 words, subtitle ~25 words
  const titleEnd = heroEnd(5, heroEnd(1) + 100);

  return (
    <section className="relative w-full min-h-[70vh] bg-background overflow-hidden flex flex-col justify-center px-4 pt-32 pb-24">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Primary Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center mt-12">
        <div className="text-left flex flex-col items-start max-w-2xl">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-manrope font-bold text-foreground leading-[1.05] mb-8 relative z-20"
            style={{ letterSpacing: "-0.02em" }}
          >
            <HeroWords delay={heroEnd(1) + 100}>Security Built </HeroWords>
            <br />
            <HeroWords delay={heroEnd(3, heroEnd(1) + 100)}>
              <span
                className="text-[#4a69e6]"
                style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2em" }}
              >
                For Your Industry.
              </span>
            </HeroWords>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-inter leading-relaxed max-w-lg">
            <HeroWords delay={titleEnd + 100}>
              We specialize in startups, AI companies, SMEs, and education. Each
              sector has unique challenges — we know them inside out.
            </HeroWords>
          </p>
        </div>
        
        <div className="relative hidden lg:block w-full h-[450px]">
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
           <LottieAnimation
              src={getCdnUrl("lottie/saas.json")}
              className="w-full h-full relative z-10 drop-shadow-2xl"
              speed={0.8}
            />
        </div>
      </div>
    </section>
  );
}
