"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Code2, GitBranch, Scan, Cloud, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticCicdPipeline = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative flex w-full max-w-lg items-center justify-between">
                {/* Connecting Line Layer */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/50 -translate-y-1/2 z-0" />

                {/* Nodes */}
                <StaticPipelineNode icon={<Code2 />} label="Commit" />
                <ArrowRight className="text-muted-foreground/30 z-10 w-4 h-4" />
                <StaticPipelineNode icon={<GitBranch />} label="Build" />
                <ArrowRight className="text-muted-foreground/30 z-10 w-4 h-4" />
                <StaticPipelineNode icon={<Scan />} label="Scan" active />
                <ArrowRight className="text-muted-foreground/30 z-10 w-4 h-4" />
                <StaticPipelineNode icon={<Cloud />} label="Deploy" />
            </div>
        </StaticDiagramFrame>
    );
};

const StaticPipelineNode = ({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) => {
    return (
        <div className="z-10 flex flex-col items-center gap-2 bg-background/50 backdrop-blur-sm p-1 rounded-xl">
            <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm",
                active ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground bg-white dark:bg-background"
            )}>
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
            </div>
            <span className={cn(
                "text-xs font-medium",
                active ? "text-foreground font-semibold" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </div>
    )
};
