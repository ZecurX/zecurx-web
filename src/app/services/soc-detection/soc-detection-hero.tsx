"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Radar, Activity, Eye, Zap, Server } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

// Fallback illustration (SOC themed)
function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto select-none">

      {/* Rotating rings */}
      <div className="absolute inset-0 rounded-full border border-[#4c69e4]/10 animate-[spin_30s_linear_infinite]" />
      <div className="absolute inset-4 rounded-full border border-dashed border-[#4c69e4]/15 animate-[spin_20s_linear_infinite_reverse]" />

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#2a0c0c] to-[#0c1a2e] shadow-[0_0_60px_rgba(76,105,228,0.25)] flex items-center justify-center">
          <Radar className="w-14 h-14 text-[#4c69e4]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Orbit nodes */}
      {[
        { icon: Eye, label: "24/7 Monitoring", angle: 0, color: "text-[#4c69e4]" },
        { icon: Activity, label: "Threat Detection", angle: 60, color: "text-orange-400" },
        { icon: ShieldAlert, label: "Incident Response", angle: 120, color: "text-yellow-400" },
        { icon: Zap, label: "MTTD < 15m", angle: 180, color: "text-red-400" },
        { icon: Server, label: "SIEM + EDR", angle: 240, color: "text-sky-400" },
        { icon: Radar, label: "Threat Hunting", angle: 300, color: "text-purple-400" },
      ].map(({ icon: Icon, label, angle, color }) => {
        const rad = (angle * Math.PI) / 180;
        const r = 42;
        const x = 50 + r * Math.sin(rad);
        const y = 50 - r * Math.cos(rad);

        return (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0c1a2e] border border-white/10 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-inter text-slate-400">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SOCDetectionHero() {
  const [lottieError, setLottieError] = useState(false);

  return (
    <section className="relative pt-10 md:pt-14 pb-16 px-6 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT */}
        <div className="text-center md:text-left">

          <span className="inline-block px-3 py-1 text-xs bg-[#1e2d5f] text-white rounded-md mb-6 uppercase tracking-widest">
            SECURITY OPERATIONS
          </span>

          <h1 className="text-5xl md:text-[3.5rem] font-bold font-manrope text-[#0c1a2e] leading-tight mb-6">
            SOC , Detection <br />
            <span className="text-[#4c69e4]">& Response</span>
          </h1>

          <p className="text-lg text-slate-600 font-inter mb-8 max-w-lg leading-relaxed">
            Continuous monitoring, threat hunting, and rapid containment — active, not reactive.
            When attackers move in minutes, your SOC must move faster.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
            {[
              "24/7/365 Monitoring",
              "MTTD < 15 Minutes",
              "CERT-In Ready",
              "SIEM + EDR Integrated",
              "Threat Hunting (MITRE ATT&CK)"
            ].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 text-xs font-inter text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-3.5 text-[15px] font-semibold hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] transition-all"
            >
              Activate 24/7 SOC
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-3.5 text-[15px] font-semibold hover:bg-slate-50"
            >
              Explore All Services
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 shadow-[0_8px_40px_rgba(239,68,68,0.08)] w-full max-w-md">

            {!lottieError ? (
              <LottieAnimation
                src={getCdnUrl("lottie/sdlc.json")}
                className="w-full h-auto"
              />
            ) : (
              <HeroIllustration />
            )}

          </div>
        </div>

      </div>
    </section>
  );
}