"use client";

import React from "react";
import dynamic from "next/dynamic";
import { getCdnUrl } from "@/lib/cdn";
import { useLottieData } from "@/hooks/use-lottie-data";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function AppDiagramLottie() {
  const { animationData, loading, error } = useLottieData(getCdnUrl("lottie/App Diagram.json"));

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-muted-foreground font-inter">
        Loading Diagram...
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-muted-foreground font-inter">
        Failed to load diagram
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center" style={{ filter: "hue-rotate(-42deg) saturate(86%) brightness(92%)" }}>
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-auto max-h-[85vh] object-contain"
      />
    </div>
  );
}
