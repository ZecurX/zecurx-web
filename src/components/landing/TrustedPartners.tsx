"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import Image from "next/image";

const CDN_BASE = "https://zexc.in-maa-1.linodeobjects.com/partners";

const partners = [
  { name: "MSRIT", light: `${CDN_BASE}/ramaiah-light.png`, dark: `${CDN_BASE}/ramaiah-light.png` },
  { name: "IIBS", light: `${CDN_BASE}/iibs-logo-02.png`, dark: `${CDN_BASE}/iibs-logo-02.png` },
  { name: "Mount Carmel", light: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png`, dark: `${CDN_BASE}/250px-mount_carmel_college_bangalore_logo.png` },
  { name: "Presidency", light: `${CDN_BASE}/logo.png`, dark: `${CDN_BASE}/logo.png` },
  { name: "St Pauls", light: `${CDN_BASE}/960px-st-pauls-college-bangalore.png`, dark: `${CDN_BASE}/stpaulswhite.png` },
  { name: "Brindavan", light: `${CDN_BASE}/brindavan-logo.png`, dark: `${CDN_BASE}/brindavan-logo.png` },
  { name: "St Joseph", light: `${CDN_BASE}/image.png`, dark: `${CDN_BASE}/image.png` },
  { name: "RIBS", light: `${CDN_BASE}/ribs.png`, dark: `${CDN_BASE}/ribs.png` },
  { name: "KGI", light: `${CDN_BASE}/kgi-light-logo.png`, dark: `${CDN_BASE}/kgi-light-logo.png` },
  { name: "Sapthagiri", light: `${CDN_BASE}/sapthagiri.png`, dark: `${CDN_BASE}/sapthagiri.png` },
  { name: "Yenepoya", light: `${CDN_BASE}/y-school-of-engineering-technology-logo.png`, dark: `${CDN_BASE}/y-school-of-engineering-technology-logo.png` },
  { name: "MSRCASC", light: `${CDN_BASE}/msrcasc-autonomus-logo-black1-1.png`, dark: `${CDN_BASE}/msrcasc-autonomus-logo-black1-1.png` },
  { name: "Dhanwantri", light: `${CDN_BASE}/dhawn.png`, dark: `${CDN_BASE}/dhawn.png` },
  { name: "Brand", light: `${CDN_BASE}/brand.png`, dark: `${CDN_BASE}/brand.png` },
];

export default function TrustedPartners() {
  return (
    <section className="py-16 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Trusted{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
            Partners
          </span>
        </h2>

        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <InfiniteSlider gap={24} duration={40} className="w-full">
            {partners.map((partner, i) => (
              <div
                key={i}
                className="h-24 w-56 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-muted/30 border border-border hover:bg-gray-50 dark:hover:bg-muted/50 hover:border-border/80 transition-all cursor-default p-4"
              >
                <Image
                  src={partner.light}
                  alt={partner.name}
                  width={160}
                  height={60}
                  className="max-h-14 w-auto object-contain dark:hidden"
                  unoptimized
                />
                <Image
                  src={partner.dark}
                  alt={partner.name}
                  width={160}
                  height={60}
                  className="max-h-14 w-auto object-contain hidden dark:block"
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
