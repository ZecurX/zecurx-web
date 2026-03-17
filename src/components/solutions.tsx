"use client";

import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";
import {
  HighlightText,
  type DescriptionPart,
} from "@/components/ui/highlight-text";
const SOLUTIONS: {
  id: string;
  title: string;
  description: DescriptionPart[];
  href: string;
  lottie: string;
}[] = [
  {
    id: "vulnerability-management",
    title: "Vulnerability Management",
    description: [
      "A quarterly pen test finds 40 issues. Your team fixes 12. Next quarter, there are 60. The backlog ",
      { text: "only grows", highlight: true },
      ". You need a system that triages, tracks, and closes the loop — ",
      { text: "continuously", highlight: true },
      ".",
    ],
    href: "/solutions/vulnerability-management",
    lottie: getCdnUrl("lottie/vulnman.json"),
  },
  {
    id: "secure-sdlc",
    title: "Secure SDLC",
    description: [
      "Developers push 50 commits a day. Security reviews happen once a sprint. That gap is where ",
      { text: "vulnerabilities live", highlight: true },
      ". Build the gates into the pipeline — not around it.",
    ],
    href: "/solutions/secure-sdlc",
    lottie: getCdnUrl("lottie/sdlc.json"),
  },
  {
    id: "zero-trust-architecture",
    title: "Zero Trust Architecture",
    description: [
      "The perimeter disappeared the day your team went remote. VPNs don't cut it when every device, identity, and API call is a ",
      { text: "potential entry point", highlight: true },
      ". Trust nothing. Verify everything.",
    ],
    href: "/solutions/zero-trust-architecture",
    lottie: getCdnUrl("lottie/zerotrust.json"),
  },
  {
    id: "security-observability",
    title: "Security Observability",
    description: [
      "Something happened at 3 AM. Your SIEM has 10,000 alerts. None of them are useful. The signal is there — buried under ",
      { text: "noise nobody reads", highlight: true },
      ". See what matters, when it matters.",
    ],
    href: "/solutions/security-observability",
    lottie: getCdnUrl("lottie/obsv.json"),
  },
];

export function Solutions() {
  return (
    <section
      id="solutions"
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f0f8ff 0%, #E8F2FE 10%, #DBEAFE 25%, #BFDBFE 40%, #BFDBFE 100%)",
      }}
    >

      {/* Decorative blurred orb — top left like reference */}
      <div
        className="absolute -left-20 top-1/3 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8 max-w-[1320px]">
        {/* Header */}
        <BlurFade inView={true} delay={0} className="mb-12 md:mb-14 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-manrope font-semibold text-slate-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            One platform. Every <span className="text-[#4b6ffa]">layer</span> secured.
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-700/80 max-w-2xl mx-auto leading-relaxed">
            End-to-end security solutions that scale with your team.
            Proactive protection across your entire stack — from code to cloud.
          </p>
          <div className="mt-5">
            <Link
              href="#contact"
              className="inline-flex items-center px-6 py-2.5 rounded-full border-2 border-slate-800 text-slate-800 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </BlurFade>

        {/* 2x2 Glass Cards Grid — fills remaining viewport space */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {SOLUTIONS.map((solution, i) => {
            const isEven = i % 2 === 0;
            return (
              <BlurFade key={solution.id} inView={true} delay={i * 0.15} duration={0.6}>
                <Link
                  href={solution.href}
                  className={`group glass-card relative flex flex-row items-center gap-5 p-5 lg:p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-2px] h-full ${isEven ? "" : "md:flex-row-reverse"}`}
                >
                  {/* Lottie — takes up half the card */}
                  <div className="flex-shrink-0 w-[45%] aspect-square flex items-center justify-center">
                    <LottieAnimation
                      src={solution.lottie}
                      className="w-full h-full"
                      speed={0.5}
                    />
                  </div>

                  {/* Text — takes up the other half */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg md:text-xl lg:text-2xl font-manrope font-bold text-blue-600 leading-tight"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {solution.title}
                    </h3>
                    <HighlightText
                      parts={solution.description}
                      className="text-sm md:text-[15px] text-slate-700/80 leading-relaxed mt-2"
                    />
                  </div>
                </Link>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
