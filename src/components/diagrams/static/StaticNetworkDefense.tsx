"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Shield, Globe, Lock, Wifi, Server } from "lucide-react";

export const StaticNetworkDefense = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Outer Hexagon Ring */}
                <div className="absolute w-64 h-64 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon
                            points="50,5 90,25 90,75 50,95 10,75 10,25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-foreground"
                        />
                    </svg>
                </div>

                {/* Middle Ring */}
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-foreground/10" />

                {/* Inner Ring with Glow */}
                <div className="absolute w-28 h-28 rounded-full border border-foreground/20" />

                {/* Central Shield */}
                <div className="relative z-20 flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-foreground/10 blur-2xl rounded-full" />
                        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-foreground/10 to-transparent border border-foreground/20">
                            <Shield className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Orbiting Nodes */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="p-2.5 rounded-lg bg-background border border-foreground/10 shadow-lg shadow-black/5">
                        <Globe className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <div className="p-2.5 rounded-lg bg-background border border-foreground/10 shadow-lg shadow-black/5">
                        <Lock className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <div className="p-2.5 rounded-lg bg-background border border-foreground/10 shadow-lg shadow-black/5">
                        <Wifi className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="absolute left-12 top-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/30 blur-md rounded-full" />
                        <div className="relative w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background border border-foreground/10 shadow-lg">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-foreground/60 uppercase">
                        Perimeter Secure
                    </span>
                </div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="50%" y1="32%" x2="50%" y2="42%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                    <line x1="68%" y1="50%" x2="58%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                    <line x1="50%" y1="68%" x2="50%" y2="58%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                </svg>
            </div>
        </StaticDiagramFrame>
    );
};
