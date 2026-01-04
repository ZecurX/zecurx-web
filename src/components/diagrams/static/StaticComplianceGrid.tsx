"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { CheckCircle2, Shield, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticComplianceGrid = () => {
    return (
        <StaticDiagramFrame>
            <div className="grid grid-cols-2 gap-4 w-full h-full max-w-sm">
                <StatusCard title="GDPR" status="Compliant" icon={<Shield className="w-4 h-4 text-emerald-500" />} />
                <StatusCard title="SOC 2" status="Verified" icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />} />
                <StatusCard title="HIPAA" status="Secured" icon={<Lock className="w-4 h-4 text-primary" />} />
                <StatusCard title="ISO 27001" status="Audited" icon={<FileText className="w-4 h-4 text-purple-500" />} />
            </div>
            {/* Static Scan Line Decoration */}
            <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </StaticDiagramFrame>
    );
};

const StatusCard = ({ title, status, icon }: { title: string, status: string, icon: React.ReactNode }) => (
    <div className="flex flex-col justify-between p-3 rounded-lg border border-border/50 bg-white/50 dark:bg-muted/20 backdrop-blur-sm shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {icon}
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {status}
        </div>
    </div>
);
