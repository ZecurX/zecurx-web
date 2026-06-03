"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  HighlightText,
  type DescriptionPart,
} from "@/components/ui/highlight-text";
import vulnManagementData from "../../public/lottie/vulnman.json";
import secureSdlcData from "../../public/lottie/sdlc.json";
import zeroTrustData from "../../public/lottie/zerotrust.json";
import observabilityData from "../../public/lottie/obsv.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LottieData = Record<string, unknown>;

const SOLUTIONS: {
  id: string;
  title: string;
  description: DescriptionPart[];
  href: string;
  lottie: LottieData;
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
    href: "/",
    lottie: vulnManagementData,
  },
  {
    id: "secure-sdlc",
    title: "Secure SDLC",
    description: [
      "Developers push 50 commits a day. Security reviews happen once a sprint. That gap is where ",
      { text: "vulnerabilities live", highlight: true },
      ". Build the gates into the pipeline — not around it.",
    ],
    href: "/",
    lottie: secureSdlcData,
  },
  {
    id: "zero-trust-architecture",
    title: "Zero Trust Architecture",
    description: [
      "The perimeter disappeared the day your team went remote. VPNs don't cut it when every device, identity, and API call is a ",
      { text: "potential entry point", highlight: true },
      ". Trust nothing. Verify everything.",
    ],
    href: "/",
    lottie: zeroTrustData,
  },
  {
    id: "security-observability",
    title: "Security Observability",
    description: [
      "Something happened at 3 AM. Your SIEM has 10,000 alerts. None of them are useful. The signal is there — buried under ",
      { text: "noise nobody reads", highlight: true },
      ". See what matters, when it matters.",
    ],
    href: "/",
    lottie: observabilityData,
  },
];

function SolutionLottie({
  animationData,
  className,
  speed = 1,
}: {
  animationData: LottieData;
  className?: string;
  speed?: number;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [speed, animationData]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop
      autoplay
      className={className}
    />
  );
}

export function Solutions() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden py-20 md:py-24"
      style={{
        background:
          "linear-gradient(180deg, #f0f8ff 0%, #E8F2FE 10%, #DBEAFE 25%, #BFDBFE 40%, #BFDBFE 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full md:h-96 md:w-96"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container relative mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
        <BlurFade inView={true} delay={0} className="mb-12 text-center md:mb-14">
          <h2
            className="font-manrope text-3xl font-semibold text-slate-900 md:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            One platform. Every <span className="text-[#4b6ffa]">layer</span> secured.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700/80 md:text-lg">
            End-to-end security solutions that scale with your team. Proactive
            protection across your entire stack — from code to cloud.
          </p>
          <div className="mt-5">
            <Link
              href="#contact"
              className="inline-flex items-center rounded-full border-2 border-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
            >
              Get Started
            </Link>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {SOLUTIONS.map((solution, i) => {
            const isEven = i % 2 === 0;

            return (
              <BlurFade key={solution.id} inView={true} delay={i * 0.15} duration={0.6}>
                <Link
                  href={solution.href}
                  className="group glass-card relative flex h-full flex-col gap-3 rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px] md:grid md:grid-cols-[45%_1fr] md:items-center md:gap-5 lg:gap-6 lg:p-6"
                >
                  <div
                    className={`flex items-center gap-3 md:block ${
                      isEven ? "" : "md:order-2"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center md:h-auto md:w-full md:aspect-square">
                      <SolutionLottie
                        animationData={solution.lottie}
                        className="h-full w-full"
                        speed={0.5}
                      />
                    </div>
                    <h3
                      className="font-manrope text-lg font-bold leading-tight text-blue-600 md:hidden"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {solution.title}
                    </h3>
                  </div>

                  <div className={`min-w-0 ${isEven ? "" : "md:order-1"}`}>
                    <h3
                      className="hidden font-manrope font-bold leading-tight text-blue-600 md:block md:text-xl lg:text-2xl"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {solution.title}
                    </h3>
                    <HighlightText
                      parts={solution.description}
                      className="text-sm leading-relaxed text-slate-700/80 md:mt-2 md:text-[15px]"
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
