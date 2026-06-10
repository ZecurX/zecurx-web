"use client";

import { useEffect, useState, useCallback } from "react";

interface UseLottieDataOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function useLottieData(src: string, options: UseLottieDataOptions = {}) {
  const { maxRetries = 3, retryDelay = 500 } = options;
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnimation = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      
      const response = await fetch(src);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setAnimationData(data);
      setLoading(false);
    } catch (err) {
      console.warn(`Lottie fetch failed (attempt ${retryCount + 1}/${maxRetries}):`, src);
      
      if (retryCount < maxRetries - 1) {
        // Retry with exponential backoff
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * retryDelay);
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }, [src, retryCount, maxRetries, retryDelay]);

  useEffect(() => {
    setRetryCount(0);
    setAnimationData(null);
    setError(false);
    setLoading(true);
  }, [src]);

  useEffect(() => {
    fetchAnimation();
  }, [fetchAnimation]);

  return { animationData, error, loading };
}
