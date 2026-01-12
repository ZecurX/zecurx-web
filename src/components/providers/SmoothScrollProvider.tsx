"use client";

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const raf = useCallback((time: number) => {
        lenisRef.current?.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
    }, []);

    useEffect(() => {
        // Skip smooth scroll on mobile for better performance
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isMobile || prefersReducedMotion) {
            return; // Skip Lenis on mobile or when reduced motion is preferred
        }

        // Initialize Lenis smooth scroll
        lenisRef.current = new Lenis({
            duration: 1.0, // Slightly faster for better perceived performance
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        rafIdRef.current = requestAnimationFrame(raf);

        // Cleanup
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };
    }, [raf]);

    return <>{children}</>;
}
