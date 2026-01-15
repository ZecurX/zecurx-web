"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";

const colleges = [
  "MSRIT",
  "IIBS",
  "Mount Carmel",
  "Presidency",
  "St Paul",
  "Brindavan College",
  "St Joseph University",
  "RIBS",
  "Nagarjuna Degree College",
  "Sapthagiri College of Engineering",
  "Yenepoya",
  "Koshys",
  "MSRCASC",
  "Dhanwantri College"
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
        
        <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <InfiniteSlider gap={24} duration={40} className="w-full">
            {colleges.map((college, i) => (
                <div
                key={i}
                className="h-24 w-56 shrink-0 flex items-center justify-center rounded-xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-border/80 transition-all cursor-default"
                >
                <span className="font-semibold text-sm text-foreground/80 text-center px-4 leading-tight">
                    {college}
                </span>
                </div>
            ))}
            </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
