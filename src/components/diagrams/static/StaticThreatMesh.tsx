"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Globe, Server, Database, ShieldAlert, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticThreatMesh = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Central Node */}
                <div className="z-20 relative">
                    <MeshNode icon={<Globe />} className="h-16 w-16 bg-primary/10 border-primary text-primary" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full z-[-1]" />
                </div>

                {/* Satellite Nodes */}
                <div className="absolute top-4 left-10">
                    <MeshNode icon={<Cloud />} />
                </div>
                <div className="absolute top-4 right-10">
                    <MeshNode icon={<Server />} />
                </div>
                <div className="absolute bottom-4 left-12">
                    <MeshNode icon={<Database />} />
                </div>
                <div className="absolute bottom-4 right-12">
                    <MeshNode icon={<ShieldAlert />} className="text-red-500 dark:text-red-400 border-red-500/30 bg-red-100 dark:bg-red-500/10" />
                </div>

                {/* Static Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-border opacity-50">
                    <line x1="50%" y1="50%" x2="20%" y2="20%" />
                    <line x1="50%" y1="50%" x2="80%" y2="20%" />
                    <line x1="50%" y1="50%" x2="25%" y2="80%" />
                    <line x1="50%" y1="50%" x2="75%" y2="80%" />
                    {/* Inter-node connections */}
                    <line x1="20%" y1="20%" x2="80%" y2="20%" strokeDasharray="4 4" className="stroke-muted-foreground/30" />
                </svg>
            </div>
        </StaticDiagramFrame>
    );
};

const MeshNode = ({ icon, className }: { icon: React.ReactNode, className?: string }) => (
    <div className={cn(
        "flex items-center justify-center p-2 rounded-full border bg-background shadow-md",
        "h-10 w-10 text-muted-foreground border-border",
        className
    )}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18 }) : icon}
    </div>
);
