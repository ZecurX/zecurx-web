"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

export function SOCDetectionHero() {
  const [lottieError, setLottieError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle mouse movement for the grid effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-20 pb-12 px-6 bg-white overflow-hidden"
    >
      {/* Interactive Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(#4c69e4 1px, transparent 1px), linear-gradient(90deg, #4c69e4 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          opacity: 0.15,
        }}
      />
      {/* Base Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0c1a2e 1px, transparent 1px), linear-gradient(90deg, #0c1a2e 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h1 className="text-[2.8rem] md:text-[4rem] font-bold font-manrope text-[#0c1a2e] leading-[1] tracking-tighter mb-8">
              SOC, Detection <br />
              <span className="text-[#4c69e4]">& Response</span>
            </h1>

            <p className="text-base text-slate-600 font-inter mb-8 max-w-lg leading-relaxed font-normal">
              Continuous monitoring, threat hunting, and rapid containment.
              Active, not reactive. When attackers move in minutes, your SOC
              must move faster.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "24/7/365 Monitoring",
                "MTTD < 15 Minutes",
                "CERT-In Ready",
                "SIEM + EDR Integrated",
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 rounded hover:border-[#4c69e4]/30 transition-colors"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#0c1a2e] text-white rounded px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#4c69e4] transition-all"
              >
                Activate SOC <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/services"
                className="text-[#0c1a2e] text-sm font-bold uppercase tracking-widest border-b-2 border-[#0c1a2e]/20 hover:border-[#4c69e4] transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-end">
            <div className="relative w-full max-w-[340px]">
              <div className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
                {!lottieError ? (
                  <LottieAnimation
                    src={getCdnUrl("lottie/sdlc.json")}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-slate-50 rounded-xl">
                    <Radar className="w-12 h-12 text-[#4c69e4]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
