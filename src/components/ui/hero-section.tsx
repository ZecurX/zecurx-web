"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ServicesHeroSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Memoized hover handlers to ensure stable references for cleanup
  const handleMouseEnter = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    target.style.textShadow = "0 0 20px oklch(0.6 0.1 260 / 0.5)";
  }, []);

  const handleMouseLeave = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    target.style.textShadow = "none";
  }, []);

  useEffect(() => {
    fetch("/lottie/service-main.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => { /* Lottie fetch error silently handled */ });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get words within our container ref (not global document query)
    const words = containerRef.current.querySelectorAll<HTMLElement>(".hero-word");
    
    // Animate words with staggered delays
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      const timeoutId = setTimeout(() => {
        word.style.animation = "word-appear 0.5s ease-out forwards";
      }, delay);
      timeoutsRef.current.push(timeoutId);
    });

    // Add hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", handleMouseEnter);
      word.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup function to prevent memory leaks
    return () => {
      // Clear all pending timeouts
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      
      // Remove event listeners
      words.forEach((word) => {
        word.removeEventListener("mouseenter", handleMouseEnter);
        word.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground font-manrope overflow-hidden relative w-full">


      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-8 py-12 md:px-16 md:py-20">
        {/* Top tagline */}
        <div className="text-center pt-16">
          <h2 className="text-xs md:text-sm font-inter font-semibold uppercase tracking-[0.2em] text-black">
            <span className="hero-word" data-delay="0">
              Welcome
            </span>{" "}
            <span className="hero-word" data-delay="80">
              to
            </span>{" "}
            <span className="hero-word" data-delay="160">
              <b>ZecurX</b>
            </span>{" "}
            <span className="hero-word" data-delay="240">
              —
            </span>{" "}
            <span className="hero-word" data-delay="320">
              Real-world
            </span>{" "}
            <span className="hero-word" data-delay="400">
              security
            </span>{" "}
            <span className="hero-word" data-delay="480">
              for
            </span>{" "}
            <span className="hero-word" data-delay="560">
              modern teams.
            </span>
          </h2>
          <div className="mt-4 w-16 h-px opacity-30 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Main area - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full mt-8 md:mt-12 mb-16 px-4 md:px-0">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-manrope font-bold text-foreground leading-[1.05]" style={{ letterSpacing: "-0.02em" }}>
              <div className="mb-4 md:mb-6">
                <span className="hero-word" data-delay="700">Build,</span>{" "}
                <span className="hero-word" data-delay="780">secure,</span>{" "}
                <span className="hero-word" data-delay="860">and</span>{" "}
                <span className="hero-word" data-delay="940">scale</span>{" "}
                <span className="hero-word" data-delay="1020">with</span>{" "}
                <span className="hero-word text-[#496ae8]" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.2em' }} data-delay="1100">confidence.</span>
              </div>
              <div className="text-lg md:text-xl font-inter leading-relaxed text-muted-foreground mt-5 md:mt-7 max-w-lg mx-auto lg:mx-0">
                <span className="hero-word" data-delay="1250">Practical,</span>{" "}
                <span className="hero-word" data-delay="1330">real-world</span>{" "}
                <span className="hero-word" data-delay="1410">security</span>{" "}
                <span className="hero-word" data-delay="1490">for</span>{" "}
                <span className="hero-word text-foreground font-medium" data-delay="1570">startups,</span>{" "}
                <span className="hero-word text-foreground font-medium" data-delay="1650">SMEs,</span>{" "}
                <span className="hero-word text-foreground font-medium" data-delay="1730">and</span>{" "}
                <span className="hero-word text-foreground font-medium" data-delay="1810">AI</span>{" "}
                <span className="hero-word text-foreground font-medium" data-delay="1890">teams.</span>
              </div>
            </h1>

            {/* CTA Buttons */}
            <div
              className="mt-10 md:mt-14 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 opacity-0"
              style={{
                animation: "word-appear 0.5s ease-out forwards",
                animationDelay: "2s",
              }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 bg-[#496ae8] text-white font-inter font-semibold rounded-full hover:opacity-90 transition-all text-base md:text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#capabilities"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-slate-200 text-foreground font-inter font-medium rounded-full hover:bg-muted/50 transition-all hover:border-slate-300 text-base md:text-lg"
              >
                Explore capabilities
              </Link>
            </div>
          </div>

          {/* Right: Lottie Animation */}
          <div 
            className="flex justify-center lg:justify-end opacity-0"
            style={{
              animation: "word-appear 0.5s ease-out forwards",
              animationDelay: "2.2s",
            }}
          >
            <div className="w-full max-w-[500px] aspect-square">
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
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <div className="mb-4 w-16 h-px opacity-30 mx-auto bg-gradient-to-r from-transparent via-muted-foreground to-transparent" />
          <h2 className="text-xs md:text-sm font-inter font-medium uppercase tracking-[0.2em] text-[#496ae8]">
            <span className="hero-word" data-delay="2200">
              Application Security
            </span>{" "}
            <span className="hero-word" data-delay="2280">
              ·
            </span>{" "}
            <span className="hero-word" data-delay="2360">
              Cloud & DevSecOps
            </span>{" "}
            <span className="hero-word" data-delay="2440">
              ·
            </span>{" "}
            <span className="hero-word" data-delay="2520">
              AI Security
            </span>{" "}
            <span className="hero-word" data-delay="2600">
              ·
            </span>{" "}
            <span className="hero-word" data-delay="2680">
              Compliance
            </span>
          </h2>
          <div
            className="mt-6 flex justify-center space-x-4 opacity-0"
            style={{
              animation: "word-appear 0.5s ease-out forwards",
              animationDelay: "2.3s",
            }}
          >
            <div className="w-1 h-1 rounded-full opacity-40 bg-muted-foreground" />
            <div className="w-1 h-1 rounded-full opacity-60 bg-primary" />
            <div className="w-1 h-1 rounded-full opacity-40 bg-muted-foreground" />
          </div>
        </div>
      </div>


    </div>
  );
}
