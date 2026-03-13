"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ServicesHeroSection() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".hero-word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.5s ease-out forwards";
      }, delay);
    });

    // Mouse gradient
    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + "px";
        gradient.style.top = e.clientY - 192 + "px";
        gradient.style.opacity = "1";
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = "0";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px oklch(0.6 0.1 260 / 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });

    // Click ripple effect
    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      ripple.style.width = "4px";
      ripple.style.height = "4px";
      ripple.style.background = "oklch(0.6 0.1 260 / 0.6)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "pulse-glow 1s ease-out forwards";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener("click", onClick);

    // Floating elements on scroll
    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document
          .querySelectorAll<HTMLElement>(".floating-element")
          .forEach((el, index) => {
            setTimeout(() => {
              el.style.animationPlayState = "running";
            }, index * 200);
          });
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground font-manrope overflow-hidden relative w-full">
      {/* SVG Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="services-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/[0.06]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#services-grid)" />
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          className="grid-line text-foreground"
          style={{ animationDelay: "0.5s" }}
        />
        <line
          x1="0"
          y1="80%"
          x2="100%"
          y2="80%"
          className="grid-line text-foreground"
          style={{ animationDelay: "1s" }}
        />
        <line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          className="grid-line text-foreground"
          style={{ animationDelay: "1.5s" }}
        />
        <line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          className="grid-line text-foreground"
          style={{ animationDelay: "2s" }}
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="grid-line text-foreground"
          style={{ animationDelay: "2.5s", opacity: 0.05 }}
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          className="grid-line text-foreground"
          style={{ animationDelay: "3s", opacity: 0.05 }}
        />
        <circle
          cx="20%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3s" }}
        />
        <circle
          cx="80%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.2s" }}
        />
        <circle
          cx="20%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.4s" }}
        />
        <circle
          cx="80%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.6s" }}
        />
        <circle
          cx="50%"
          cy="50%"
          r="1.5"
          className="detail-dot"
          style={{ animationDelay: "4s" }}
        />
      </svg>

      {/* Corner elements */}
      <div
        className="corner-element top-8 left-8"
        style={{ animationDelay: "2s" }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 opacity-30 bg-primary" />
      </div>
      <div
        className="corner-element top-8 right-8"
        style={{ animationDelay: "2.1s" }}
      >
        <div className="absolute top-0 right-0 w-2 h-2 opacity-30 bg-primary" />
      </div>
      <div
        className="corner-element bottom-8 left-8"
        style={{ animationDelay: "2.2s" }}
      >
        <div className="absolute bottom-0 left-0 w-2 h-2 opacity-30 bg-primary" />
      </div>
      <div
        className="corner-element bottom-8 right-8"
        style={{ animationDelay: "2.3s" }}
      >
        <div className="absolute bottom-0 right-0 w-2 h-2 opacity-30 bg-primary" />
      </div>

      {/* Floating elements */}
      <div
        className="floating-element"
        style={{ top: "25%", left: "15%", animationDelay: "2.5s" }}
      />
      <div
        className="floating-element"
        style={{ top: "60%", left: "85%", animationDelay: "2.8s" }}
      />
      <div
        className="floating-element"
        style={{ top: "40%", left: "10%", animationDelay: "3.1s" }}
      />
      <div
        className="floating-element"
        style={{ top: "75%", left: "90%", animationDelay: "3.4s" }}
      />

      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-8 py-12 md:px-16 md:py-20">
        {/* Top tagline */}
        <div className="text-center pt-16">
          <h2 className="text-xs md:text-sm font-manrope font-semibold uppercase tracking-[0.2em] text-primary">
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

        {/* Main headline */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-newsreader font-medium leading-tight tracking-tight text-foreground">
            <div className="mb-4 md:mb-6">
              <span className="hero-word" data-delay="700">
                Build,
              </span>{" "}
              <span className="hero-word" data-delay="780">
                secure,
              </span>{" "}
              <span className="hero-word" data-delay="860">
                and
              </span>{" "}
              <span className="hero-word" data-delay="940">
                scale
              </span>{" "}
              <span className="hero-word" data-delay="1020">
                with
              </span>{" "}
              <span
                className="hero-word italic text-muted-foreground"
                data-delay="1100"
              >
                confidence.
              </span>
            </div>
            <div className="text-xl md:text-2xl lg:text-3xl font-manrope font-light leading-relaxed text-muted-foreground">
              <span className="hero-word" data-delay="1250">
                Practical,
              </span>{" "}
              <span className="hero-word" data-delay="1330">
                real-world
              </span>{" "}
              <span className="hero-word" data-delay="1410">
                security
              </span>{" "}
              <span className="hero-word" data-delay="1490">
                for
              </span>{" "}
              <span className="hero-word" data-delay="1570">
                startups,
              </span>{" "}
              <span className="hero-word" data-delay="1650">
                SMEs,
              </span>{" "}
              <span className="hero-word" data-delay="1730">
                and
              </span>{" "}
              <span className="hero-word" data-delay="1810">
                AI
              </span>{" "}
              <span className="hero-word" data-delay="1890">
                teams.
              </span>
            </div>
            <div className="text-xl md:text-2xl lg:text-3xl font-manrope font-light leading-relaxed text-muted-foreground">
              <span className="hero-word" data-delay="2600">
                Practical,
              </span>{" "}
              <span className="hero-word" data-delay="2750">
                real-world
              </span>{" "}
              <span className="hero-word" data-delay="2900">
                security
              </span>{" "}
              <span className="hero-word" data-delay="3050">
                for
              </span>{" "}
              <span className="hero-word" data-delay="3200">
                startups,
              </span>{" "}
              <span className="hero-word" data-delay="3350">
                SMEs,
              </span>{" "}
              <span className="hero-word" data-delay="3500">
                and
              </span>{" "}
              <span className="hero-word" data-delay="3650">
                AI
              </span>{" "}
              <span className="hero-word" data-delay="3800">
                teams.
              </span>
            </div>
          </h1>

          {/* CTA Buttons */}
          <div
            className="mt-10 md:mt-14 flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0"
            style={{
              animation: "word-appear 0.5s ease-out forwards",
              animationDelay: "2s",
            }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-manrope font-semibold rounded-full hover:opacity-90 transition-all text-base md:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#capabilities"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-border text-foreground font-manrope font-semibold rounded-full hover:bg-muted/50 transition-all text-base md:text-lg"
            >
              Explore capabilities
            </Link>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <div className="mb-4 w-16 h-px opacity-30 mx-auto bg-gradient-to-r from-transparent via-muted-foreground to-transparent" />
          <h2 className="text-xs md:text-sm font-manrope font-light uppercase tracking-[0.2em] text-muted-foreground">
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

      {/* Mouse-following gradient */}
      <div
        ref={gradientRef}
        className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl transition-all duration-500 ease-out opacity-0 z-0"
        style={{
          background:
            "radial-gradient(circle, oklch(0.25 0.1 260 / 0.08) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
