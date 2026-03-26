"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";
import { WordRotate } from "@/components/ui/word-rotate";

export function AppSecHero() {
  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".hero-word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.5s ease-out forwards";
      }, delay);
    });

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px oklch(0.6 0.1 260 / 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });
  }, []);

  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
          <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
      </div>

      <div className="max-w-[1320px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white font-space-grotesk text-xs font-medium tracking-widest uppercase mb-6 opacity-0"
              style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.1s" }}
            >
              Core Security Service
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0c1a2e] mb-6 leading-[1.05] font-manrope">
              <span className="hero-word" data-delay="300">Application</span>{" "}
              <span className="hero-word text-[#4c69e4]" data-delay="400">Security</span>
            </h1>

            <p 
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-inter opacity-0"
              style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.6s" }}
            >
              We identify and fix real-world vulnerabilities in your{" "}
              <WordRotate
                words={["applications", "APIs", "codebases", "infrastructure"]}
                className="inline-block text-lg md:text-xl text-[#0c1a2e] font-inter font-semibold"
              />{" "}
              before attackers exploit them.
            </p>

            <div 
              className="flex flex-wrap gap-4 opacity-0"
              style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.8s" }}
            >
              <Link
                href="/contact"
                className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
              >
                Get a Security Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
              >
                How We Work
              </Link>
            </div>
          </div>

          <div 
            className="flex justify-center lg:justify-end opacity-0"
            style={{ animation: "word-appear 0.6s ease-out forwards", animationDelay: "0.3s" }}
          >
            <div className="relative glass-card bg-white/50 border border-slate-200/60 rounded-3xl p-8 shadow-[0_18px_44px_rgba(30,58,95,0.05)] w-full max-w-[480px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full pointer-events-none" />
              <LottieAnimation
                src={getCdnUrl("lottie/app_security.json")}
                className="w-full h-auto relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
