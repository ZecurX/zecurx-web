"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const words1 =
    "Every breach starts with a vulnerability someone missed. Stolen credentials. Misconfigured clouds. Unsecured APIs.".split(
        " "
    );

const transitionText = "It's time for a different approach.";

export default function NarrativeSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: narrativeProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.8", "end 0.3"],
    });

    const { scrollYProgress: transitionProgress } = useScroll({
        target: transitionRef,
        offset: ["start 0.7", "end 0.4"],
    });

    const transitionOpacity = useTransform(
        transitionProgress,
        [0, 0.3, 0.7, 1],
        [0, 1, 1, 0.6]
    );
    const transitionScale = useTransform(
        transitionProgress,
        [0, 0.3],
        [0.95, 1]
    );

    return (
        <>
            {/* Part 1: Problem Statement — word-by-word reveal */}
            <section
                ref={sectionRef}
                className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden py-32 md:py-48"
            >
                {/* Perimeter glow persists */}
                <PerimeterGlow />

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-manrope font-light leading-[1.2] tracking-[-0.02em] text-center">
                        {words1.map((word, i) => {
                            const start = i / words1.length;
                            const end = (i + 1) / words1.length;
                            return (
                                <Word
                                    key={i}
                                    word={word}
                                    progress={narrativeProgress}
                                    range={[start, end]}
                                />
                            );
                        })}
                    </p>
                </div>
            </section>

            {/* Part 2: Transition Statement — dramatic glow reveal */}
            <section
                ref={transitionRef}
                className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden"
            >
                <PerimeterGlow />

                <motion.div
                    style={{ opacity: transitionOpacity, scale: transitionScale }}
                    className="relative z-10 will-change-transform"
                >
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-manrope font-medium text-white text-center tracking-[-0.02em]"
                        style={{
                            textShadow:
                                "0 0 60px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.15), 0 0 200px rgba(255,255,255,0.05)",
                        }}
                    >
                        {transitionText}
                    </h2>
                </motion.div>
            </section>
        </>
    );
}

function Word({
    word,
    progress,
    range,
}: {
    word: string;
    progress: MotionValue<number>;
    range: [number, number];
}) {
    const opacity = useTransform(progress, range, [0.12, 0.85]);

    return (
        <motion.span
            style={{ opacity }}
            className="inline-block mr-[0.3em] text-white will-change-[opacity] transition-none"
        >
            {word}
        </motion.span>
    );
}

function PerimeterGlow() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <div
                className="absolute inset-y-0 left-0 w-[100px]"
                style={{
                    background:
                        "linear-gradient(to right, rgba(30,80,220,0.12), transparent)",
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-[100px]"
                style={{
                    background:
                        "linear-gradient(to left, rgba(30,80,220,0.12), transparent)",
                }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-[80px]"
                style={{
                    background:
                        "linear-gradient(to top, rgba(30,80,220,0.08), transparent)",
                }}
            />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px]"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(160,30,30,0.06) 0%, transparent 70%)",
                }}
            />
        </div>
    );
}
