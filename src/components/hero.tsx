"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { WordRotate } from "@/components/ui/word-rotate";
import { getCdnUrl } from "@/lib/cdn";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function Hero() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch(getCdnUrl("hero-lottie.json"))
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  return (
    <section className="relative flex items-center overflow-hidden bg-background contain-paint">
      {/* Organic blue-white blobs — optimized to 3 layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto', contain: 'strict' }}>
        {/* Top-left blue blob */}
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(74, 111, 250, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            willChange: 'transform',
          }}
        />
        {/* Center-right blue blob */}
        <div
          className="absolute top-1/3 right-[5%] w-[700px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.14) 0%, transparent 65%)",
            filter: "blur(70px)",
            willChange: 'transform',
          }}
        />
        {/* Center white patch */}
        <div
          className="absolute top-[8%] left-[35%] w-[500px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, transparent 60%)",
            filter: "blur(40px)",
            willChange: 'transform',
          }}
        />
      </div>

      {/* Dot matrix pattern */}
      <DotPattern
        width={18}
        height={18}
        cr={1.1}
        randomOpacity
        className="text-slate-400"
      />

      {/* Content — two columns */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-8 pt-28 sm:pt-32 md:pt-44 pb-12 sm:pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — text content */}
          <div>
            {/* Headline - Mobile: 32px, scales up smoothly */}
            <BlurFade delay={0.1} inView={true} direction="up">
              <h1
                className="text-[2rem] sm:text-[2.5rem] md:text-5xl lg:text-6xl font-manrope font-bold text-foreground leading-[1.15] sm:leading-[1.1]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Security that{" "}
                <span className="text-[#4c69e4]" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.15em' }}>moves</span>
                <br />
                as fast as you do.
              </h1>
            </BlurFade>

            {/* Subtitle - Clear supporting copy */}
            <BlurFade delay={0.25} inView={true} direction="up">
              <p className="mt-5 sm:mt-6 md:mt-7 text-base sm:text-lg md:text-xl text-muted-foreground font-inter leading-relaxed max-w-lg">
                Pentesting, security training, cloud audits, and compliance
                readiness — built for{" "}
                <WordRotate
                  words={["startups", "AI teams", "enterprises", "fintechs"]}
                  className="inline-block text-base sm:text-lg md:text-xl text-foreground font-inter font-medium"
                />
                .
              </p>
            </BlurFade>

            {/* CTAs - Large touch targets (min 44px), proper spacing */}
            <BlurFade delay={0.4} inView={true} direction="up">
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <Link href="/contact" className="group/cta pb-[5px] inline-block">
                  <button
                    className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 sm:px-8 py-4 sm:py-3.5 text-base sm:text-sm font-semibold font-inter cursor-pointer border border-transparent shadow-[0px_0px_0px_0px_#92c4fd] group-hover/cta:translate-y-[-5px] group-hover/cta:shadow-[0px_5px_0px_0px_#92c4fd] group-active/cta:translate-y-[-3px] group-active/cta:shadow-[0px_3px_0px_0px_#92c4fd] transition-transform duration-200"
                    style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                  >
                    Book a Security Consultation
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </button>
                </Link>
                <Link href="/how-we-work" className="w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto border border-slate-200 bg-white text-foreground rounded-full px-7 sm:px-8 py-4 sm:py-3.5 text-base sm:text-sm font-inter font-medium cursor-pointer transition-colors duration-200 hover:border-slate-300 hover:bg-white"
                  >
                    See How We Work
                  </button>
                </Link>
              </div>
            </BlurFade>

          </div>

          {/* Right — Lottie animation - Smaller on mobile, not dominating */}
          <BlurFade delay={0.3} inView={true} direction="up">
            <div className="flex items-center justify-center lg:justify-end mt-4 sm:mt-0">
              <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[500px] aspect-square">
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
