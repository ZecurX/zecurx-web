"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CDN_BASE = "https://zecurx-web.fsn1.your-objectstorage.com/partners";

interface Partner {
  name: string;
  logo: string;
  invertInLight: boolean;
  scale?: number;
  translateY?: number;
}

const partners: Partner[] = [
  { 
    name: "MSRIT", 
    logo: `${CDN_BASE}/ramaiah-light.png`, 
    invertInLight: true,
    scale: 1.15
  },
  { 
    name: "IIBS", 
    logo: `${CDN_BASE}/iibs-logo-02.png`, 
    invertInLight: true,
    scale: 1.25
  },
  {
    name: "Mount Carmel",
    logo: `${CDN_BASE}/mount-carmel.png`,
    invertInLight: false,
    scale: 1.5
  },
  { 
    name: "Presidency", 
    logo: `${CDN_BASE}/logo.png`, 
    invertInLight: true,
    scale: 1.35
  },
  {
    name: "St Pauls",
    logo: `${CDN_BASE}/960px-st-pauls-college-bangalore.png`,
    invertInLight: false,
    scale: 1.35
  },
  {
    name: "Brindavan",
    logo: `${CDN_BASE}/brindavan-logo.png`,
    invertInLight: true,
    scale: 1.3
  },
  {
    name: "RIBS",
    logo: `${CDN_BASE}/ribs.png`,
    invertInLight: false,
    scale: 1.55,
    translateY: -3
  },
  { 
    name: "KGI", 
    logo: `${CDN_BASE}/kgi-light-logo.png`, 
    invertInLight: true,
    scale: 1.3
  },
  {
    name: "Sapthagiri",
    logo: `${CDN_BASE}/sapthagiri.png`,
    invertInLight: false,
    scale: 1.45
  },
  {
    name: "Yenepoya",
    logo: `${CDN_BASE}/y-school-of-engineering-technology-logo.png`,
    invertInLight: false,
    scale: 1.3
  },
  {
    name: "MSRCASC",
    logo: `${CDN_BASE}/msrcasc-autonomus-logo-black1-1.png`,
    invertInLight: false,
    scale: 1.35
  },
  {
    name: "Dhanwantri",
    logo: `${CDN_BASE}/dhanwantari.png`,
    invertInLight: false,
    scale: 1.35
  },
];

// 6x repetition — guarantees the track is always packed solid with logos
const marqueePartners = Array(6).fill(partners).flat();

export default function TrustedPartners() {
  return (
    <section className="pt-10 md:pt-14 pb-14 md:pb-20 bg-background border-t border-border/40 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/70 mb-4 md:mb-6">
          Empowering Security Across Institutions
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-14 text-foreground tracking-tight">
          Trusted{" "}
          <span className="text-muted-foreground font-medium">Partners</span>
        </h2>
      </div>

      {/* Full-width marquee — edge fades only at the very edges */}
      <div 
        className="w-full overflow-hidden py-4 select-none relative"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, white 3%, white 97%, transparent)",
          maskImage: "linear-gradient(to right, transparent, white 3%, white 97%, transparent)",
        }}
      >
        <motion.div
          aria-label="Trusted by partner logos marquee"
          className="flex w-max items-center will-change-transform transform-gpu"
          initial={false}
          animate={{ x: ["-16.66%", "-33.33%"] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          {marqueePartners.map((partner, i) => {
            const isDuplicate = i >= partners.length;
            const baseScale = partner.scale ?? 1;
            const ty = partner.translateY ?? 0;

            return (
              <div 
                key={`${partner.name}-${i}`} 
                className="flex items-center shrink-0"
              >
                <div
                  className="group relative flex shrink-0 items-center justify-center cursor-pointer"
                  aria-hidden={isDuplicate}
                >
                  <Image
                    src={partner.logo}
                    alt={isDuplicate ? "" : partner.name}
                    width={240}
                    height={120}
                    quality={95}
                    className={cn(
                      "h-14 sm:h-[88px] md:h-[120px] w-auto object-contain transition-all duration-500 ease-out origin-center transform-gpu",
                      "opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110",
                      partner.invertInLight ? "invert dark:invert-0" : "dark:invert"
                    )}
                    style={{
                      transform: `scale(${baseScale}) translateY(${ty}px) translateZ(0)`,
                    }}
                  />
                </div>

                {/* Tight dot separator */}
                <span 
                  className="text-muted-foreground/20 mx-1.5 sm:mx-2 md:mx-3 select-none text-xs sm:text-sm md:text-base shrink-0" 
                  aria-hidden="true"
                >
                  •
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

