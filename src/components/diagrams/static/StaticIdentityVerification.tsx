"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { User, Smartphone, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticIdentityVerification = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative flex w-full max-w-lg items-center justify-between z-20">
                <StaticIdentityNode icon={<User />} label="User" />
                <ConnectionLine />
                <StaticIdentityNode icon={<Smartphone />} label="MFA" />
                <ConnectionLine active />
                <StaticIdentityNode icon={<ShieldCheck />} label="Zero Trust" active />
                <ConnectionLine active />
                <StaticIdentityNode icon={<Lock />} label="Protected App" />
            </div>
        </StaticDiagramFrame>
    );
};

const ConnectionLine = ({ active }: { active?: boolean }) => (
    <div className={cn(
        "h-[2px] flex-1 mx-2 rounded-full",
        active ? "bg-gradient-to-r from-blue-500 to-emerald-500 opacity-80" : "bg-border"
    )} />
);

const StaticIdentityNode = ({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-xl border shadow-sm",
            active ? "bg-primary/10 text-primary border-primary/50" : "bg-white dark:bg-muted/50 text-muted-foreground border-border"
        )}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
        </div>
        <span className="text-xs font-semibold text-foreground/80">{label}</span>
    </div>
);
