"use client";

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis smooth scroll
        lenisRef.current = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.5,
            wheelMultiplier: 1,
            autoResize: true,
        });

        // Animation frame loop
        let frameId: number;
        function raf(time: number) {
            lenisRef.current?.raf(time);
            frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            lenisRef.current?.destroy();
        };
    }, []);

    return <>{children}</>;
}
