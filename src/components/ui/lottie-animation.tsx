"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  src: string;
  className?: string;
  speed?: number;
  fallback?: React.ReactNode;
}

export function LottieAnimation({ src, className, speed = 1, fallback = null }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => {});
  }, [src]);

  useEffect(() => {
    if (lottieRef.current && animationData) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, animationData]);

  if (!animationData) return <>{fallback}</>;

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop
      autoplay
      className={className}
    />
  );
}
