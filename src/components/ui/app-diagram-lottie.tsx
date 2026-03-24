"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCdnUrl } from "@/lib/cdn";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function AppDiagramLottie() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch(getCdnUrl("lottie/App Diagram.json"))
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => { /* Lottie fetch error silently handled */ });
  }, []);

  if (!animationData) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-muted-foreground font-inter">
        Loading Diagram...
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
