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
  { name: "Mount Carmel", logo: `${CDN_BASE}/mount-carmel.png`, invertInLight: false, className: "max-h-20" },
  { name: "Presidency", logo: `${CDN_BASE}/logo.png`, invertInLight: true },
  { name: "St Pauls", logo: `${CDN_BASE}/960px-st-pauls-college-bangalore.png`, invertInLight: false },
  { name: "Brindavan", logo: `${CDN_BASE}/brindavan-logo.png`, invertInLight: true },
  { name: "RIBS", logo: `${CDN_BASE}/ribs.png`, invertInLight: false },
  { name: "KGI", logo: `${CDN_BASE}/kgi-light-logo.png`, invertInLight: true },
  { name: "Sapthagiri", logo: `${CDN_BASE}/sapthagiri.png`, invertInLight: false },
  { name: "Yenepoya", logo: `${CDN_BASE}/y-school-of-engineering-technology-logo.png`, invertInLight: false },
  { name: "MSRCASC", logo: `${CDN_BASE}/msrcasc-autonomus-logo-black1-1.png`, invertInLight: false },
  { name: "Dhanwantri", logo: `${CDN_BASE}/dhanwantari.png`, invertInLight: false },
  { name: "Koshys", logo: `${CDN_BASE}/koshys.png`, invertInLight: false },
];

export default function TrustedPartners() {
  return (
    <section className="py-24 bg-background border-t border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 mb-8">Empowering Security Across Institutions</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground tracking-tight">
          Trusted <span className="text-muted-foreground font-medium">Partners</span>
        </h2>

        <div className="relative w-full overflow-hidden">
          {/* Edge Fades */}
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
                  className={cn(
                    "max-h-16 w-auto object-contain transition-all duration-500 relative z-10",
                    "opacity-80 grayscale",
                    
                    partner.invertInLight ? "invert dark:invert-0" : "dark:invert",
                    partner.className
                  )}
                  unoptimized
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
