"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import { useLottieData } from "@/hooks/use-lottie-data";

// Dynamic import with SSR disabled - fixes "document is not defined" error
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  src: string;
  className?: string;
  speed?: number;
  fallback?: React.ReactNode;
}

export function LottieAnimation({ 
  src, 
  className, 
  speed = 1,
  fallback = null 
}: LottieAnimationProps) {
  const { animationData, error, loading } = useLottieData(src);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed, animationData]);

  // Show fallback on error
  if (error) {
    return <>{fallback}</>;
  }

  // Show placeholder while loading
  if (loading || !animationData) {
    return <div className={className} />;
  }

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
