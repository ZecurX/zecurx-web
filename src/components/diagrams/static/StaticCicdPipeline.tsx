"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Code2, GitBranch, Scan, Cloud, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticCicdPipeline = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex items-center justify-center p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Pipeline Container */}
                <div className="relative flex w-full max-w-lg items-center justify-between z-10">
                    {/* Progress Line */}
                    <div className="absolute top-7 left-8 right-8 h-px bg-foreground/10 z-0" />
                    <div className="absolute top-7 left-8 w-[65%] h-px bg-gradient-to-r from-foreground/40 to-foreground/20 z-0" />

                    <PipelineNode
                        icon={<Code2 />}
                        label="Commit"
                        status="complete"
                    />
                    <ChevronRight className="text-foreground/20 w-4 h-4 z-10" />
                    <PipelineNode
                        icon={<GitBranch />}
                        label="Build"
                        status="complete"
                    />
                    <ChevronRight className="text-foreground/20 w-4 h-4 z-10" />
                    <PipelineNode
                        icon={<Scan />}
                        label="Scan"
                        status="active"
                    />
                    <ChevronRight className="text-foreground/20 w-4 h-4 z-10" />
                    <PipelineNode
                        icon={<Cloud />}
                        label="Deploy"
                        status="pending"
                    />
                </div>
            </div>
        </StaticDiagramFrame>
    );
};

const PipelineNode = ({
    icon,
    label,
    status
}: {
    icon: React.ReactNode;
    label: string;
    status: 'complete' | 'active' | 'pending';
}) => {
    return (
        <div className="z-10 flex flex-col items-center gap-3">
            <div className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all",
                status === 'active' && "bg-foreground text-background border-foreground shadow-lg shadow-foreground/20",
                status === 'complete' && "bg-gradient-to-br from-foreground/10 to-transparent text-foreground/70 border-foreground/20",
                status === 'pending' && "bg-background text-foreground/30 border-foreground/10"
            )}>
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
                    size: 20,
                    strokeWidth: status === 'active' ? 2 : 1.5
                }) : icon}

                {status === 'active' && (
                    <div className="absolute -inset-1 rounded-2xl border-2 border-foreground/30 animate-pulse" />
                )}
            </div>
            <span className={cn(
                "text-xs font-semibold tracking-wide",
                status === 'active' && "text-foreground",
                status === 'complete' && "text-foreground/60",
                status === 'pending' && "text-foreground/30"
            )}>
                {label}
            </span>
        </div>
    );
};
