"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Cloud, Server, Database, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export const StaticInfrastructureMap = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full max-w-md flex items-center justify-center p-6">
                {/* Central Cloud Node */}
                <div className="relative z-10 flex flex-col items-center gap-2 p-4 rounded-xl border border-blue-500/30 bg-blue-100/50 dark:bg-blue-950/20 backdrop-blur-md">
                    <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-mono text-blue-900 dark:text-blue-200">Hybrid Cloud</span>
                </div>

                {/* Satellite Nodes */}
                <div className="absolute top-4 left-4 flex flex-col items-center gap-1 animate-pulse delay-75">
                    <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                        <Server className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                <div className="absolute bottom-6 right-8 flex flex-col items-center gap-1 animate-pulse delay-100">
                    <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                        <Database className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                <div className="absolute top-8 right-6 flex flex-col items-center gap-1 animate-pulse delay-150">
                    <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                        <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>

                {/* Connecting Lines (CSS borders/pseudo-elements could be used, but simple absolute divs work for clarity) */}
                <div className="absolute top-[30%] left-[25%] w-16 h-[1px] bg-gradient-to-r from-slate-300 dark:from-slate-700 to-blue-500/50 rotate-45" />
                <div className="absolute bottom-[35%] right-[25%] w-16 h-[1px] bg-gradient-to-l from-slate-300 dark:from-slate-700 to-blue-500/50 rotate-12" />
                <div className="absolute top-[35%] right-[30%] w-12 h-[1px] bg-gradient-to-l from-slate-300 dark:from-slate-700 to-blue-500/50 -rotate-12" />

                {/* Security Badge */}
                <div className="absolute -bottom-2 -left-2 bg-emerald-100/50 dark:bg-emerald-950/30 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">Secured</span>
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
