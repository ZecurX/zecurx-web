"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface StatMetricProps {
    value: string;
    label: string;
    className?: string;
}

export function StatMetric({ value, label, className }: StatMetricProps) {
    return (
        <div className={cn("flex flex-col border-l border-border pl-6 py-2", className)}>
            <span className="text-3xl md:text-4xl font-manrope font-bold text-foreground tracking-tighter">
                {value}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
                {label}
            </span>
        </div>
    );
}
