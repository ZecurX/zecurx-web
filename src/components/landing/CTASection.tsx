"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Ripple } from "@/components/ui/ripple";
import { BlurFade } from "@/components/ui/blur-fade";

export default function CTASection() {
  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden contain-paint"
      style={{ background: "linear-gradient(180deg, #BFDBFE 0%, #d7e9ff 45%, #eaf3ff 100%)" }}
    >
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#BFDBFE]/45 to-transparent pointer-events-none" />
      {/* Animated grid pattern overlay */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.12}
        duration={3}
        className="absolute inset-0 h-full w-full fill-blue-500/10 stroke-blue-500/15 [mask-image:radial-gradient(560px_circle_at_center,white,transparent)]"
      />

      {/* Subtle radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59, 130, 246, 0.2) 0%, transparent 72%)",
          filter: "blur(80px)",
        }}
      />

      {/* Ripple effect behind CTA content */}
      <Ripple
        mainCircleSize={180}
        mainCircleOpacity={0.06}
        numCircles={6}
        className="absolute inset-0 pointer-events-none text-blue-500/40"
      />

      <div className="relative max-w-3xl mx-auto text-center px-6">
        <div className="glass-card rounded-3xl px-6 py-10 md:px-12 md:py-14 border border-white/70 shadow-[0_18px_44px_rgba(30,58,95,0.10)]">
          <BlurFade delay={0} inView>
            <h2
              className="text-4xl md:text-5xl font-manrope font-medium text-slate-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ready to ship securely?
            </h2>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <p className="mt-6 text-lg text-slate-700 font-inter max-w-xl mx-auto">
              Book a security consultation. We&apos;ll map your top risk areas and
              next-step priorities with our team.
            </p>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="group/cta pb-[5px] inline-block">
                <button
                  className="relative inline-flex items-center bg-[#4a69e6] text-white rounded-full px-8 py-3.5 text-sm font-semibold font-inter cursor-pointer border border-transparent shadow-[0px_0px_0px_0px_#92c4fd] group-hover/cta:translate-y-[-5px] group-hover/cta:shadow-[0px_5px_0px_0px_#92c4fd] group-active/cta:translate-y-[-3px] group-active/cta:shadow-[0px_3px_0px_0px_#92c4fd] transition-transform duration-200"
                  style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                >
                  Book a Security Consultation
                </button>
              </Link>
              <Link href="/how-we-work">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-slate-300 text-slate-800 rounded-full px-8 py-3.5 text-base font-medium font-inter transition-all duration-300 hover:bg-white/80 hover:border-slate-400 cursor-pointer"
                >
                  See How We Work
                </motion.button>
              </Link>
            </div>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <p className="mt-4 text-sm text-slate-600">
              No commitment required. Talk to an expert.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
