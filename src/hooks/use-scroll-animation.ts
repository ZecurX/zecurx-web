"use client";

import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

type ScrollOffsetValue = string | number | [number, number];

interface ScrollFadeOptions {
    offset?: ScrollOffsetValue[];
    fadeRange?: [number, number];
}

export function useScrollFade(options: ScrollFadeOptions = {}) {
    const ref = useRef<HTMLDivElement>(null);
    const { offset = ["start end", "end start"], fadeRange = [0, 0.3] } = options;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: offset as ("start end" | "end start")[],
    });

    const opacity = useTransform(scrollYProgress, fadeRange, [0, 1]);
    const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

    return { ref, opacity: smoothOpacity, scrollYProgress };
}

interface ScrollParallaxOptions {
    offset?: ScrollOffsetValue[];
    yRange?: [number, number];
    scaleRange?: [number, number];
}

export function useScrollParallax(options: ScrollParallaxOptions = {}) {
    const ref = useRef<HTMLDivElement>(null);
    const {
        offset = ["start start", "end start"],
        yRange = [0, 200],
        scaleRange = [1, 0.95],
    } = options;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: offset as ("start start" | "end start")[],
    });

    const y = useTransform(scrollYProgress, [0, 1], yRange);
    const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

    return { ref, y, scale, opacity, scrollYProgress };
}

export function useTextReveal(containerRef: RefObject<HTMLDivElement | null>) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "end 0.5"],
    });

    return { scrollYProgress };
}

export function useCountUp(
    end: number,
    scrollYProgress: MotionValue<number>,
    startThreshold = 0.3
) {
    const count = useTransform(scrollYProgress, [startThreshold, 0.7], [0, end]);
    const rounded = useTransform(count, (v) => Math.round(v));
    return rounded;
}
