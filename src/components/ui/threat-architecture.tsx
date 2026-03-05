"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Utility for calculating SVG circle coordinates
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    // Subtract 90 to make 0 degrees "top"
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

// Generates an SVG path for a ring segment (donut slice)
const describeRingSegment = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const startInner = polarToCartesian(x, y, innerRadius, startAngle);
    const endInner = polarToCartesian(x, y, innerRadius, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 0, startInner.x, startInner.y,
        "Z"
    ].join(" ");
};

// Generates an SVG path strictly for text to follow
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, reverse: boolean = false) => {
    // For text flowing correctly on bottom, we sometimes reverse the path direction
    const start = polarToCartesian(x, y, radius, reverse ? endAngle : startAngle);
    const end = polarToCartesian(x, y, radius, reverse ? startAngle : endAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";

    // Sweep flag controls which side of the arc is drawn (1 = clockwise, 0 = counter-clockwise)
    const sweepFlag = reverse ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
    ].join(" ");
};

export const ThreatArchitectureDiagram = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Center & Scale
    const cx = 500;
    const cy = 500;

    // Rings Configuration
    const coreRadius = 150;
    const midRingInner = 160;
    const midRingOuter = 320;
    const outerRingInner = 330;
    const outerRingOuter = 460;

    // The gap at the top for the eagle/logo (now set to 0 to close the circle)
    const topGapAngle = 40;

    if (!mounted) return null; // Avoid hydration mismatch on initial complex SVG render

    return (
        <div className="relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-auto aspect-square group">
            <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* DEFINITIONS */}
                <defs>
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                        <stop offset="60%" stopColor="#dc2626" stopOpacity="1" />
                        <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
                    </radialGradient>

                    <radialGradient id="midRingGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#27272a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#09090b" stopOpacity="1" />
                    </radialGradient>

                    <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>

                    {/* TEXT PATHS */}
                    {/* Outer Ring Paths */}
                    <path id="path-outer-left" d={describeArc(cx, cy, 395, -120, 20)} />
                    <path id="path-outer-bottom" d={describeArc(cx, cy, 395, 100, 260, true)} /> {/* Reversed to read upright */}
                    <path id="path-outer-right" d={describeArc(cx, cy, 395, 20, 150)} />

                    {/* Mid Ring Paths */}
                    <path id="path-mid-topleft" d={describeArc(cx, cy, 275, -50, -130, true)} />
                    <path id="path-mid-bottom" d={describeArc(cx, cy, 275, 130, 230, true)} />
                    <path id="path-mid-topright" d={describeArc(cx, cy, 275, 50, 130)} />
                </defs>

                {/* 1. OUTER RING (Red Fragmented / Sweeping Segment) */}
                <motion.path
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={describeRingSegment(cx, cy, outerRingInner, outerRingOuter, topGapAngle, 360 - topGapAngle)}
                    fill="url(#outerRingGradient)"
                    className="drop-shadow-lg"
                />

                {/* 2. MIDDLE RING (Dark Network Zone) */}
                <motion.path
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    d={describeRingSegment(cx, cy, midRingInner, midRingOuter, 0, 360)}
                    fill="url(#midRingGradient)"
                    className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                />

                {/* Mid Ring Internal Rings & Dots */}
                {/* Thin dashed ring connecting nodes */}
                <circle cx={cx} cy={cy} r="215" fill="none" stroke="#52525b" strokeWidth="2" strokeDasharray="5 5" />
                {/* Nodes on the thin ring */}
                {[0, 120, 240].map((angle, i) => {
                    const pos = polarToCartesian(cx, cy, 215, angle);
                    return (
                        <motion.circle
                            key={`node-${i}`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.8 + (i * 0.2), type: "spring" }}
                            cx={pos.x}
                            cy={pos.y}
                            r="6"
                            fill="#ffffff"
                            className="drop-shadow-glow"
                        />
                    );
                })}


                {/* 3. CENTER CORE (The "Breach" / "Threat" Target) */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
                >
                    <circle cx={cx} cy={cy} r={coreRadius} fill="url(#coreGlow)" className="drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
                    {/* Target crosshairs inside the core */}
                    <circle cx={cx} cy={cy} r={coreRadius * 0.7} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <circle cx={cx} cy={cy} r={coreRadius * 0.4} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <line x1={cx - coreRadius + 10} y1={cy} x2={cx + coreRadius - 10} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <line x1={cx} y1={cy - coreRadius + 10} x2={cx} y2={cy + coreRadius - 10} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

                    <text x={cx} y={cy + 15} textAnchor="middle" fill="#ffffff" fontSize="56" fontWeight="bold" className="tracking-widest drop-shadow-md">
                        BREACH
                    </text>
                </motion.g>

                {/* 4. TEXT ON PATHS */}
                <g fill="#ffffff" fontWeight="bold" letterSpacing="2" className="drop-shadow-md">
                    {/* Outer Ring Text */}
                    <text fontSize="28">
                        <textPath href="#path-outer-left" startOffset="30%">Prepare for advanced threats</textPath>
                    </text>
                    <text fontSize="28">
                        <textPath href="#path-outer-bottom" startOffset="50%" textAnchor="middle">Respond to widespread attacks</textPath>
                    </text>
                    <text fontSize="28">
                        <textPath href="#path-outer-right" startOffset="30%">Fortify your cybersecurity posture</textPath>
                    </text>

                    {/* Mid Ring Text */}
                    <text fontSize="28" fill="#e4e4e7">
                        <textPath href="#path-mid-topleft" startOffset="50%" textAnchor="middle">ENDPOINT</textPath>
                    </text>
                    <text fontSize="28" fill="#e4e4e7">
                        <textPath href="#path-mid-bottom" startOffset="50%" textAnchor="middle">IDENTITY</textPath>
                    </text>
                    <text fontSize="28" fill="#e4e4e7">
                        <textPath href="#path-mid-topright" startOffset="30%">CLOUD</textPath>
                    </text>
                </g>



                {/* Radar Sweep Effect (Rotates around the center) */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ ease: "linear", duration: 8, repeat: Infinity }}
                    style={{ transformOrigin: "center" }}
                >
                    <path d={`M ${cx} ${cy} L ${cx} ${cy - coreRadius} A ${coreRadius} ${coreRadius} 0 0 1 ${cx + coreRadius} ${cy} Z`} fill="url(#radarSweep)" opacity="0.3" />
                </motion.g>

                <defs>
                    <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default ThreatArchitectureDiagram;
