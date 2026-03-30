"use client";

import React from "react";
import dynamic from "next/dynamic";
import { getCdnUrl } from "@/lib/cdn";
import { useLottieData } from "@/hooks/use-lottie-data";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function CallingLottie() {
  const { animationData, loading } = useLottieData(getCdnUrl("lottie/calling.json"));

  if (loading || !animationData) {
    return <div className="w-full max-w-[500px] aspect-square" />;
  }

  return (
    <div className="w-full flex justify-center items-center pointer-events-none">
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-auto max-w-[500px] object-contain"
      />
    </div>
  );
}
