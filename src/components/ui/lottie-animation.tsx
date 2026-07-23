"use client";

import { useEffect, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import { loadLottieData } from "@/lib/lottie-registry";

interface LottieAnimationProps {
  src: string;
  className?: string;
  speed?: number;
  fallback?: React.ReactNode;
}

type LottieComponent = React.ComponentType<{
  lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
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
    let cancelled = false;

    async function load() {
      try {
        // Load lottie-react dynamically (client only)
        const lottieModule = await import("lottie-react");
        const LottieLib = lottieModule.default as LottieComponent;

        if (cancelled) return;

        // Try static import first (bundled at build time, no network request)
        let data = await loadLottieData(src);

        // Fall back to runtime fetch for files not in the static registry
        if (!data) {
          console.warn(`[LottieAnimation] Static import unavailable for "${src}", trying fetch...`);
          const response = await fetch(src);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          data = await response.json();
        }

        if (cancelled) return;

        setLottie(() => LottieLib);
        setAnimationData(data);
      } catch (err) {
        console.error(`[LottieAnimation] Failed to load "${src}":`, err);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
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
