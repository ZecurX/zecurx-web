"use client";

import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  {
    title: "FinTech & Payments",
    tag: "PCI-DSS · RBI Ready",
    href: "/industries",
    lottie: getCdnUrl("lottie/fintech.json"),
    borderColors: { colorFrom: "#3b82f6", colorTo: "#06b6d4" },
  },
  {
    title: "AI & ML Startups",
    tag: "LLM · MLOps Security",
    href: "/industries",
    lottie: getCdnUrl("lottie/aiml.json"),
    borderColors: { colorFrom: "#8b5cf6", colorTo: "#ec4899" },
  },
  {
    title: "HealthTech & MedTech",
    tag: "DPDP Act · HIPAA Ready",
    href: "/industries",
    lottie: getCdnUrl("lottie/health.json"),
    borderColors: { colorFrom: "#14b8a6", colorTo: "#22d3ee" },
  },
  {
    title: "SaaS & Developer Tools",
    tag: "CI/CD · OWASP Covered",
    href: "/industries",
    lottie: getCdnUrl("lottie/saas.json"),
    borderColors: { colorFrom: "#6366f1", colorTo: "#818cf8" },
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export function Industries() {
  return (
    <section className="py-20 md:py-24 bg-[#BFDBFE]" id="industries">
      <div className="container mx-auto px-6 lg:px-8 max-w-[1320px]">
        {/* Header */}
        <BlurFade inView={true} delay={0}>
          <div className="flex flex-col items-center text-center mb-14 md:mb-16">
            <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-4">
              INDUSTRIES
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-manrope font-medium text-foreground"
              style={{ letterSpacing: "-0.015em" }}
            >
              Who we&apos;re <span className="text-[#4b6ffa]">built</span> for
            </h2>
          </div>
        </BlurFade>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map((ind, index) => (
            <BlurFade key={ind.title} inView={true} delay={0.1 * index}>
              <Link href={ind.href} className="block group">
                <div className="glass-card rounded-2xl min-h-[340px] flex flex-col justify-between relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
                  {/* Lottie Animation */}
                  <div className="flex items-center justify-center pt-10 px-6">
                    <LottieAnimation
                      src={ind.lottie}
                      className="w-[130px] h-[130px]"
                      speed={0.5}
                    />
                  </div>
                  <div className="p-6 pt-4">
                    <h3
                      className="text-xl font-semibold text-[#0f172a]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {ind.title}
                    </h3>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-space-grotesk">
                      {ind.tag}
                    </span>
                    <span className="block mt-3 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
