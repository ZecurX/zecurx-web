"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Zap, Command, CheckSquare, ArrowRight, ShieldAlert } from "lucide-react";

export const StaticAutomationFlow = () => {
    return (
        <StaticDiagramFrame>
            <div className="flex flex-col gap-6 w-full max-w-sm px-4">
                {/* Trigger Step */}
                <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                        <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">TRIGGER</div>
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">High Severity Alert</div>
                    </div>
                </div>

                {/* Connector */}
                <div className="w-[1px] h-6 bg-slate-800 ml-6" />

                {/* Action Step */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-1">AUTOMATION</div>
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">Isolate Endpoint</div>
                    </div>
                </div>

                {/* Connector */}
                <div className="w-[1px] h-6 bg-slate-800 ml-6" />

                {/* Result Step */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-mono text-emerald-600 dark:text-emerald-500 mb-1">RESULT</div>
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">Threat Contained</div>
                    </div>
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
