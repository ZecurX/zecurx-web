"use client";

import React from "react";
import { StaticDiagramFrame } from "./StaticDiagramFrame";
import { User, Smartphone, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const StaticIdentityVerification = () => {
    return (
        <StaticDiagramFrame>
            <div className="relative w-full h-full flex items-center justify-center p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                <div className="relative flex w-full max-w-lg items-center justify-between z-10">
                    <IdentityNode
                        icon={<User />}
                        label="User"
                    />
                    <ConnectionSegment />
                    <IdentityNode
                        icon={<Smartphone />}
                        label="MFA"
                        checked
                    />
                    <ConnectionSegment active />
                    <IdentityNode
                        icon={<ShieldCheck />}
                        label="Zero Trust"
                        active
                    />
                    <ConnectionSegment active />
                    <IdentityNode
                        icon={<Lock />}
                        label="Access"
                        checked
                    />
                </div>
            </div>
        </StaticDiagramFrame>
    );
};

const ConnectionSegment = ({ active }: { active?: boolean }) => (
    <div className="flex-1 mx-3 relative">
        <div className={cn(
            "h-px w-full",
            active
                ? "bg-gradient-to-r from-foreground/30 via-foreground/50 to-foreground/30"
                : "bg-foreground/10"
        )} />
        {active && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground/50" />
        )}
    </div>
);

const IdentityNode = ({
    icon,
    label,
    active,
    checked
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    checked?: boolean;
}) => (
    <div className="flex flex-col items-center gap-3">
        <div className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-xl border transition-all",
            active
                ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/20"
                : "bg-gradient-to-br from-foreground/5 to-transparent text-foreground/60 border-foreground/10"
        )}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
                size: 22,
                strokeWidth: 1.5
            }) : icon}
            {checked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
            )}
        </div>
        <span className={cn(
            "text-xs font-semibold tracking-wide",
            active ? "text-foreground" : "text-foreground/50"
        )}>
            {label}
        </span>
    </div>
);
