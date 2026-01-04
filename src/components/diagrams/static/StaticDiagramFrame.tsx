"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StaticDiagramFrameProps {
    children: React.ReactNode;
    className?: string;
}

export const StaticDiagramFrame = ({ children, className }: StaticDiagramFrameProps) => {
    return (
        <div
            className={cn(
                "relative w-full aspect-video overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-xl",
                className
            )}
        >
            {/* Background Grid Pattern - Static */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
                {children}
            </div>

            {/* Decorative Corner Gradients - Static */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
        </div>
    );
};
