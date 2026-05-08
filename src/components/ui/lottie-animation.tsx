"use client";

import { useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

interface LottieAnimationProps {
  src: string;
  className?: string;
  speed?: number;
  fallback?: React.ReactNode;
}

type LottieComponent = React.ComponentType<{
  lottieRef?: React.RefObject<LottieRefCurrentProps>;
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}>;

export function LottieAnimation({ src, className, speed = 1, fallback = null }: LottieAnimationProps) {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // Load lottie-react and animation data in parallel on client only
    Promise.all([
      import("lottie-react").then((m) => m.default),
      fetch(src).then((r) => r.json()),
    ])
      .then(([LottieLib, data]) => {
        setLottie(() => LottieLib as LottieComponent);
        setAnimationData(data);
      })
      .catch(() => {});
  }, [src]);

  useEffect(() => {
    if (lottieRef.current && animationData) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, animationData]);

  if (!Lottie || !animationData) return <>{fallback}</>;

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
