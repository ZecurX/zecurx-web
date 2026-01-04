"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Activity, AlertTriangle, CheckCircle, BarChart3, Search } from "lucide-react";

export const StaticAnalystDashboard = () => {
    return (
        <StaticDiagramFrame>
            <div className="w-full h-full max-w-md p-6 flex flex-col gap-4">
                {/* Header / Search Bar */}
                <div className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 flex items-center px-4 gap-3">
                    <Search className="w-4 h-4 text-slate-400" />
                    <div className="w-24 h-2 rounded bg-slate-100 dark:bg-slate-800" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                        <div className="flex justify-between items-start mb-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] text-slate-500">MTTD</span>
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-200">2m</div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                        <div className="flex justify-between items-start mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] text-slate-500">Resolved</span>
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-200">98%</div>
                    </div>
                </div>

                {/* Alert List */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full p-3 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <div className="flex flex-col">
                                <div className="w-20 h-2 rounded bg-slate-200 dark:bg-slate-700 mb-1" />
                                <div className="w-12 h-1.5 rounded bg-slate-100 dark:bg-slate-800" />
                            </div>
                        </div>
                        <div className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">Critical</div>
                    </div>

                    <div className="w-full p-3 rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-950/10 flex items-center justify-between opactiy-75">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <div className="flex flex-col">
                                <div className="w-16 h-2 rounded bg-slate-200 dark:bg-slate-700 mb-1" />
                                <div className="w-10 h-1.5 rounded bg-slate-100 dark:bg-slate-800" />
                            </div>
                        </div>
                        <div className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">High</div>
                    </div>
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
