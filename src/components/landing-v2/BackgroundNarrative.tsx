"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function BackgroundNarrative() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll for the entire page
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end end"]
    });

    // Smooth out the scroll progress for the pulse
    const scrollSmooth = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Pulse Position - moves from 0% to 100% of its container
    const pulseY = useTransform(scrollSmooth, [0, 1], ["0%", "100%"]);

    // Pulse Intensity - expand/contract heartbeat
    // We can use a separate animation for the heartbeat pulse
    const heartbeatScale = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
        },
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-black"
        >
            {/* Central Connective Line - Base Track */}
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px] bg-blue-900/20" />

            {/* Growing Segment (Active Path) */}
            <motion.div
                className="absolute left-1/2 -translate-x-px top-0 w-[2px] bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{
                    height: pulseY,
                    opacity: useTransform(scrollSmooth, [0, 0.05], [0, 1])
                }}
            />

            {/* The Heartbeat Pulse node */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: pulseY }}
            >
                {/* Central Core */}
                <div className="relative flex items-center justify-center">
                    {/* Inner Glow */}
                    <motion.div
                        className="absolute w-4 h-4 rounded-full bg-blue-500"
                        style={{
                            boxShadow: "0 0 20px 5px rgba(59, 130, 246, 0.5)"
                        }}
                    />

                    {/* Expanding Pulse Ring 1 */}
                    <motion.div
                        className="absolute w-20 h-20 rounded-full border border-blue-500/20"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />

                    {/* Expanding Pulse Ring 2 */}
                    <motion.div
                        className="absolute w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"
                        {...heartbeatScale}
                    />

                    {/* The "Metaphor" Flare (vertical line light) */}
                    <motion.div
                        className="absolute w-[2px] h-[300px]"
                        style={{
                            background: "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)"
                        }}
                    />

                    {/* Horizontal Branching Beams (Abstract Network Effect) */}
                    {/* Right Beam */}
                    <motion.div
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent"
                        animate={{ width: ["0px", "150px", "150px"], opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                    {/* Left Beam */}
                    <motion.div
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-l from-blue-500/50 to-transparent"
                        animate={{ width: ["0px", "150px", "150px"], opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    />
                </div>
            </motion.div>

            {/* Subtle Grain/Noise Overlay for Cinematic Texture */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
        </div>
    );
}
