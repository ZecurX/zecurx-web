"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ToolsPackLottie() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/lottie/tools-pack.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Error loading Tools Pack Lottie:", err));
  }, []);

  if (!animationData) return null;

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
