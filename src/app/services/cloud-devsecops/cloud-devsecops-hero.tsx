"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Cloud, Shield, GitBranch, Container, Lock, Terminal } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

// Inline SVG fallback — renders if Lottie fails to load
function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto select-none">
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border border-[#4c69e4]/10 animate-[spin_30s_linear_infinite]" />
      <div className="absolute inset-4 rounded-full border border-dashed border-[#4c69e4]/15 animate-[spin_20s_linear_infinite_reverse]" />

      {/* Center cloud icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#1e3a5f] to-[#0c1a2e] shadow-[0_0_60px_rgba(76,105,228,0.3)] flex items-center justify-center">
          <Cloud className="w-14 h-14 text-[#4c69e4]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Orbiting nodes */}
      {[
        { icon: Shield,    label: "CSPM",      angle:   0, textColor: "text-[#4c69e4]"   },
        { icon: GitBranch, label: "CI/CD",     angle:  60, textColor: "text-emerald-400" },
        { icon: Container, label: "K8s",       angle: 120, textColor: "text-sky-400"     },
        { icon: Lock,      label: "Vault",     angle: 180, textColor: "text-amber-400"   },
        { icon: Terminal,  label: "IaC",       angle: 240, textColor: "text-purple-400"  },
        { icon: Shield,    label: "Zero-Trust",angle: 300, textColor: "text-red-400"     },
      ].map(({ icon: Icon, label, angle, textColor }) => {
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
            <div className="w-10 h-10 rounded-xl bg-[#0c1a2e] border border-white/10 shadow-md flex items-center justify-center">
              <Icon className={`w-5 h-5 ${textColor}`} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-inter font-medium text-slate-400">{label}</span>
          </div>
        );
      })}

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const r = 42;
          const x = 50 + r * Math.sin(rad);
          const y = 50 - r * Math.cos(rad);
          return (
            <line key={angle} x1="50" y1="50" x2={x} y2={y}
              stroke="#4c69e4" strokeWidth="0.5" />
          );
        })}
      </svg>
    </div>
  );
}

export function CloudDevSecOpsHero() {
  const [lottieError, setLottieError] = useState(false);

  return (
    <section className="relative pt-10 md:pt-14 pb-16 px-6 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* ── LEFT ── */}
        <div className="text-center md:text-left">
          <span className="inline-block px-3 py-1 text-xs bg-[#1e3a5f] text-white rounded-md mb-6 uppercase tracking-widest ">
            INFRASTRUCTURE SECURITY
          </span>

          <h1 className="text-5xl md:text-[3.5rem] font-bold font-manrope text-[#0c1a2e] leading-tight mb-6">
            Cloud & <br />
            <span className="text-[#4c69e4]">DevSecOps</span>
          </h1>

          <p className="text-lg text-slate-600 font-inter mb-8 max-w-lg leading-relaxed">
            We embed security directly into cloud environments and CI/CD pipelines — 
            hardening your cloud posture, securing your delivery pipeline, and ensuring 
            every line of infrastructure-as-code is safe before it reaches production.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
            {["AWS CSAA", "GCP PCSE", "AZ-500", "CIS Benchmarks", "CERT-In Empanelled"].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 text-xs font-inter font-medium text-slate-600 bg-white border border-slate-200 rounded-full shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-3.5 text-[15px] font-semibold font-inter border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-1px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
            >
              Get Posture Snapshot
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-3.5 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
            >
              All Services
            </Link>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex justify-center">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 shadow-[0_8px_40px_rgba(76,105,228,0.08)] w-full max-w-md">
            {!lottieError ? (
              <LottieAnimation
                src={getCdnUrl("lottie/cloud.json")}
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