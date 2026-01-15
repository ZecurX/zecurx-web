"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AbstractDashboardProps {
    children?: React.ReactNode;
    title?: string;
    className?: string;
}

export function AbstractDashboard({ children, title = "System Overview", className }: AbstractDashboardProps) {
    return (
        <div className={cn("relative w-full aspect-[16/9] rounded-xl border border-border/40 bg-background/50 overflow-hidden shadow-2xl backdrop-blur-sm", className)}>
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

            {/* Dashboard Layout */}
            <div className="absolute inset-0 flex flex-col">
                {/* Header */}
                <div className="h-10 border-b border-border/40 flex items-center px-4 justify-between bg-muted/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        ZecurX // {title}
                    </div>
                    <div className="w-16" /> {/* Spacer */}
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar (Fake) */}
                    <div className="w-48 border-r border-border/40 hidden md:flex flex-col p-4 gap-3">
                        <div className="w-full h-2 bg-muted/20 rounded-full mb-4" />
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 opacity-40">
                                <div className="w-4 h-4 rounded-sm bg-muted/30" />
                                <div className="w-20 h-2 bg-muted/20 rounded-full" />
                            </div>
                        ))}
                        <div className="mt-auto p-3 rounded-lg border border-border/30 bg-muted/5">
                            <div className="flex justify-between items-end">
                                <div className="w-2 h-8 bg-primary/20 rounded-sm" />
                                <div className="w-2 h-12 bg-primary/30 rounded-sm" />
                                <div className="w-2 h-6 bg-primary/20 rounded-sm" />
                                <div className="w-2 h-10 bg-primary/40 rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 relative flex items-center justify-center p-8 bg-gradient-to-br from-background/0 via-background/0 to-muted/5">
                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[80%] max-h-[80%] border border-dashed border-border/20 rounded-lg pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-border/40 opacity-50">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>

                        {/* The Actual Content */}
                        <div className="relative z-10 transform scale-110">
                            {children}
                        </div>
                    </div>

                    {/* Right Panel (Activity Log) */}
                    <div className="w-64 border-l border-border/40 hidden lg:flex flex-col">
                        <div className="h-8 border-b border-border/40 flex items-center px-4 text-[9px] font-mono text-muted-foreground uppercase">
                            Activity Stream
                        </div>
                        <div className="p-4 space-y-3 font-mono text-[9px] text-muted-foreground/60 overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <span className="text-primary/40">[{new Date().getHours()}:{String(new Date().getMinutes() + i).padStart(2, '0')}]</span>
                                    <span>System check complete. Status: OK</span>
                                </div>
                            ))}
                            <div className="flex gap-2 items-center text-primary/70 animate-pulse">
                                <span>[{new Date().getHours()}:{String(new Date().getMinutes() + 10).padStart(2, '0')}]</span>
                                <span>Monitoring active threats...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
