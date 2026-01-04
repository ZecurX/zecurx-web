"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { FileText, Shield, Server, Lock } from "lucide-react";

export const StaticDataFlow = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full max-w-md flex flex-col justify-between p-8">
                {/* Source */}
                <div className="flex items-center justify-between z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-100 dark:bg-blue-950/20 items-center justify-center flex">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">Source</span>
                    </div>

                    {/* Flow Line Top */}
                    <div className="flex-1 h-[1px] bg-slate-300 dark:bg-slate-800 mx-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-8 h-full bg-blue-500 blur-[2px] animate-slide-right" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 items-center justify-center flex">
                            <Server className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">Process</span>
                    </div>
                </div>

                {/* Vertical Connection */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-24 bg-slate-300 dark:bg-slate-800">
                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-blue-500 animate-ping-slow" />
                </div>

                {/* Destination */}
                <div className="flex items-center justify-center z-10 mt-auto">
                    <div className="relative p-6 rounded-full border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-950/20">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/50 rounded text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            ENCRYPTED
                        </div>
                        <Shield className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                        <Lock className="w-4 h-4 text-emerald-500 dark:text-emerald-300 absolute bottom-6 right-6" />
                    </div>
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
