"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function CallingLottie() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/lottie/calling.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => { /* Lottie fetch error silently handled */ });
  }, []);

  if (!animationData) return null;

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
