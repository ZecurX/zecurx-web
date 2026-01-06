"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { FileText, Server, Shield, ArrowRight, Lock } from "lucide-react";

export const StaticDataFlow = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Top Row: Source and Destination */}
                <div className="relative z-10 flex items-center justify-center gap-6 w-full max-w-md">
                    {/* Source Node */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-foreground/5 to-transparent border border-foreground/10">
                            <FileText className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-[0.15em] text-foreground/50 uppercase">
                            Source
                        </span>
                    </div>

                    {/* Flow Line with Animation */}
                    <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-px bg-gradient-to-r from-foreground/20 via-foreground/10 to-foreground/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-transparent via-foreground/40 to-transparent animate-slide-right" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/30" />
                    </div>

                    {/* Process Node */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-foreground/5 to-transparent border border-foreground/10">
                            <Server className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-[0.15em] text-foreground/50 uppercase">
                            Process
                        </span>
                    </div>
                </div>

                {/* Vertical Connection */}
                <div className="relative h-16 w-px bg-gradient-to-b from-foreground/20 to-foreground/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-foreground/40" />
                </div>

                {/* Encrypted Shield */}
                <div className="relative z-10">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <div className="relative flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase">
                                    Encrypted
                                </span>
                            </div>
                        </div>
                        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                            <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                            <Lock className="w-3 h-3 text-emerald-500 absolute -bottom-1 -right-1" />
                        </div>
                    </div>
                </div>
            </div>
        </StaticDiagramFrame>
    );
};
