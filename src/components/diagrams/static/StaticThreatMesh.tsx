"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { Globe, Server, Database, ShieldAlert, Cloud, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticThreatMesh = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {/* Main connections from center */}
                    <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                    <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
                    <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-red-500/30" />

                    {/* Cross connections */}
                    <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="text-foreground/5" />
                    <line x1="20%" y1="70%" x2="80%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="text-foreground/5" />
                </svg>

                {/* Central Node */}
                <div className="z-20 relative">
                    <div className="absolute inset-0 bg-foreground/5 blur-2xl rounded-full scale-150" />
                    <div className="relative p-5 rounded-full border-2 border-foreground/20 bg-gradient-to-br from-foreground/10 to-transparent">
                        <Globe className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Satellite Nodes */}
                <div className="absolute top-8 left-1/4 -translate-x-1/2">
                    <MeshNode icon={<Cloud />} />
                </div>
                <div className="absolute top-8 right-1/4 translate-x-1/2">
                    <MeshNode icon={<Server />} />
                </div>
                <div className="absolute bottom-12 left-[20%]">
                    <MeshNode icon={<Database />} />
                </div>
                <div className="absolute bottom-12 right-[20%]">
                    <MeshNode icon={<ShieldAlert />} threat />
                </div>

                {/* Threat Detection Pulse */}
                <div className="absolute bottom-12 right-[20%] w-16 h-16 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping" />
                </div>
            </div>
        </StaticDiagramFrame>
    );
};

const MeshNode = ({
    icon,
    threat
}: {
    icon: React.ReactNode;
    threat?: boolean;
}) => (
    <div className={cn(
        "flex items-center justify-center p-3 rounded-xl border shadow-lg",
        threat
            ? "bg-red-500/10 border-red-500/30 text-red-500"
            : "bg-background border-foreground/10 text-foreground/60"
    )}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
            size: 18,
            strokeWidth: 1.5
        }) : icon}
    </div>
);
