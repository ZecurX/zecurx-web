"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Shield, Cast, Globe, Lock } from "lucide-react";

export const StaticNetworkDefense = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full max-w-sm flex items-center justify-center p-8">
                {/* Central Protected Node */}
                <div className="relative z-20 flex flex-col items-center gap-2">
                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
                        <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                {/* Inner Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-dashed border-emerald-500/30 animate-spin-slow" />

                {/* Outer Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-slate-200 dark:border-slate-700/50" />

                {/* Satellites on Outer Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 animate-spin-reverse-slower">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Globe className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Cast className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    {/* Add a red dot for a blocked threat */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>

                {/* Status Label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 backdrop-blur text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    PERIMETER SECURE
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
