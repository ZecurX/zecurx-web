"use client";

import React from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Ripple } from "@/components/ui/ripple";
import { BlurFade } from "@/components/ui/blur-fade";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-card">
      {/* Animated grid pattern overlay */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className="absolute inset-0 h-full w-full fill-primary/20 stroke-primary/20 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
      />

      {/* Subtle radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.70 0.14 230 / 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Ripple effect behind CTA content */}
      <Ripple
        mainCircleSize={180}
        mainCircleOpacity={0.1}
        numCircles={6}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative max-w-3xl mx-auto text-center px-6">
        <BlurFade delay={0} inView>
          <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground tracking-tight">
            Ready to ship securely?
          </h2>
        </BlurFade>

        <BlurFade delay={0.1} inView>
          <p className="mt-6 text-lg text-muted-foreground font-inter max-w-xl mx-auto">
            Get a free security assessment. We&apos;ll identify your top
            vulnerabilities in 72 hours.
          </p>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="mt-10">
            <Link href="/contact" className="inline-block">
              <ShimmerButton
                background="oklch(0.70 0.14 230)"
                shimmerColor="#38bdf8"
                borderRadius="100px"
                className="px-8 py-4 text-base font-semibold"
              >
                Get Your Free Assessment
              </ShimmerButton>
            </Link>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. No obligation.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
