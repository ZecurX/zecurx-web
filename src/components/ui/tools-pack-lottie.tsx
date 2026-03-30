"use client";

import React from "react";
import dynamic from "next/dynamic";
import { getCdnUrl } from "@/lib/cdn";
import { useLottieData } from "@/hooks/use-lottie-data";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ToolsPackLottie() {
  const { animationData, loading } = useLottieData(getCdnUrl("lottie/tools-pack.json"));

  if (loading || !animationData) {
    return <div className="w-full max-w-[600px] aspect-square" />;
  }

  return (
    <div className="w-full flex justify-center items-center pointer-events-none">
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-auto max-w-[600px] object-contain drop-shadow-2xl"
      />
    </div>
  );
}
