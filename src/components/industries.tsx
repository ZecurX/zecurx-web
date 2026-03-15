"use client";

import Link from "next/link";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  {
    title: "FinTech & Payments",
    tag: "PCI-DSS · RBI Ready",
    href: "/industries",
    borderColors: { colorFrom: "#3b82f6", colorTo: "#06b6d4" },
  },
  {
    title: "AI & ML Startups",
    tag: "LLM · MLOps Security",
    href: "/industries",
    borderColors: { colorFrom: "#8b5cf6", colorTo: "#ec4899" },
  },
  {
    title: "HealthTech & MedTech",
    tag: "DPDP Act · HIPAA Ready",
    href: "/industries",
    borderColors: { colorFrom: "#14b8a6", colorTo: "#22d3ee" },
  },
  {
    title: "SaaS & Developer Tools",
    tag: "CI/CD · OWASP Covered",
    href: "/industries",
    borderColors: { colorFrom: "#6366f1", colorTo: "#818cf8" },
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export function Industries() {
  return (
    <section className="py-24 md:py-32 bg-background" id="industries">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <BlurFade inView={true} delay={0}>
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
              Industries
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground">
              Who we&apos;re{" "}
              <span className="font-newsreader italic text-muted-foreground">
                built for
              </span>
            </h2>
          </div>
        </BlurFade>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind, index) => (
            <BlurFade key={ind.title} inView={true} delay={0.1 * index}>
              <Link href={ind.href} className="block group">
                <MagicCard
                  className="rounded-2xl min-h-[280px] flex flex-col justify-end"
                  gradientFrom={ind.borderColors.colorFrom}
                  gradientTo={ind.borderColors.colorTo}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground">
                      {ind.title}
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      {ind.tag}
                    </span>
                    <span className="block mt-2 text-sm font-medium text-primary group-hover:underline transition-colors">
                      Explore →
                    </span>
                  </div>
                  <BorderBeam
                    colorFrom={ind.borderColors.colorFrom}
                    colorTo={ind.borderColors.colorTo}
                    size={80}
                    duration={8}
                  />
                </MagicCard>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
