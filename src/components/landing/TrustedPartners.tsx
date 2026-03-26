"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CDN_BASE = "https://zecurx-web.fsn1.your-objectstorage.com/partners";

interface Partner {
  name: string;
  logo: string;
  invertInLight: boolean;
  className?: string;
}

const partners: Partner[] = [
  { name: "MSRIT", logo: `${CDN_BASE}/ramaiah-light.png`, invertInLight: true },
  { name: "IIBS", logo: `${CDN_BASE}/iibs-logo-02.png`, invertInLight: true },
  {
    name: "Mount Carmel",
    logo: `${CDN_BASE}/mount-carmel.png`,
    invertInLight: false,
    className: "max-h-24 scale-[1.3]",
  },
  { name: "Presidency", logo: `${CDN_BASE}/logo.png`, invertInLight: true },
  {
    name: "St Pauls",
    logo: `${CDN_BASE}/960px-st-pauls-college-bangalore.png`,
    invertInLight: false,
  },
  {
    name: "Brindavan",
    logo: `${CDN_BASE}/brindavan-logo.png`,
    invertInLight: true,
  },
  {
    name: "RIBS",
    logo: `${CDN_BASE}/ribs.png`,
    invertInLight: false,
    className: "max-h-24 scale-[1.5] -translate-y-3",
  },
  { name: "KGI", logo: `${CDN_BASE}/kgi-light-logo.png`, invertInLight: true },
  {
    name: "Sapthagiri",
    logo: `${CDN_BASE}/sapthagiri.png`,
    invertInLight: false,
    className: "max-h-24 scale-[1.3]",
  },
  {
    name: "Yenepoya",
    logo: `${CDN_BASE}/y-school-of-engineering-technology-logo.png`,
    invertInLight: false,
  },
  {
    name: "MSRCASC",
    logo: `${CDN_BASE}/msrcasc-autonomus-logo-black1-1.png`,
    invertInLight: false,
  },
  {
    name: "Dhanwantri",
    logo: `${CDN_BASE}/dhanwantari.png`,
    invertInLight: false,
  },
];

export default function TrustedPartners() {
  return (
    <section className="pt-8 md:pt-12 pb-12 md:pb-16 bg-background border-t border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 mb-4 md:mb-8">
          Empowering Security Across Institutions
        </p>
        <h2 className="text-2xl md:text-5xl font-bold mb-8 md:mb-10 text-foreground tracking-tight">
          Trusted{" "}
          <span className="text-muted-foreground font-medium">Partners</span>
        </h2>

        {/* Desktop Carousel - Infinite scroll */}
        <div className="hidden md:block relative w-full overflow-hidden">
          {/* Edge Fades - Desktop only */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

          <InfiniteSlider gap={32} duration={80} className="w-full">
            {partners.map((partner, i) => (
              <div
                key={i}
                className="relative h-36 w-64 shrink-0 flex items-center justify-center group/card transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={240}
                  height={96}
                  quality={75}
                  className={cn(
                    "max-h-16 w-auto object-contain transition-all duration-300 relative z-10",
                    "opacity-50 grayscale",
                    "group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105",
                    partner.invertInLight
                      ? "invert dark:invert-0"
                      : "dark:invert",
                    partner.className,
                  )}
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>

        {/* Mobile Carousel - Horizontal scrollable grid */}
        <div className="md:hidden relative w-full overflow-x-auto overflow-y-hidden -mx-4 px-4">
          <div className="flex gap-4 pb-2">
            {partners.map((partner, i) => (
              <div
                key={i}
                className="relative h-24 w-44 shrink-0 flex items-center justify-center group/card transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={80}
                  quality={75}
                  className={cn(
                    "max-h-12 w-auto object-contain transition-all duration-300 relative z-10",
                    "opacity-50 grayscale",
                    "group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105",
                    partner.invertInLight
                      ? "invert dark:invert-0"
                      : "dark:invert",
                    partner.className,
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
