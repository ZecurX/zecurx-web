"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

export function OffensiveHero() {
  return (
    <section className="relative pt-22 md:pt-30 pb-12 px-6 overflow-hidden">

      {/* background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4c69e4]/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT */}
        <div className="text-center md:text-left">
          <span className="inline-block px-3 py-1 text-xs bg-[#1e2d5f] text-white rounded-md mb-6 uppercase tracking-widest">
            RED TEAMING
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0c1a2e] leading-tight mb-6">
            Offensive Security &<br />
            <span className="text-[#4c69e4]">Penetration Testing</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            We simulate real-world adversaries across applications, infrastructure, 
            and human layers to uncover critical vulnerabilities before they are exploited.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/contact"
              className="bg-[#4c69e4] text-white px-6 py-3 rounded-full flex items-center gap-2"
            >
              Get Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="border px-6 py-3 rounded-full"
            >
              All Services
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="bg-white/60 border rounded-3xl p-6 shadow w-full max-w-md">
            <LottieAnimation
              src={getCdnUrl("lottie/soc_pentest.json")}
              className="w-full h-auto"
            />
          </div>
        </div>

      </div>
    </section>
  );
}