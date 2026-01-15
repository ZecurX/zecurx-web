"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface BenefitItemProps {
    title: string;
    description: string;
    className?: string;
}

export function BenefitItem({ title, description, className }: BenefitItemProps) {
    return (
        <li className={cn("group flex flex-col gap-2 py-4 border-l-2 border-border pl-6 hover:border-foreground transition-colors duration-500", className)}>
            <h4 className="text-lg font-manrope font-bold text-foreground group-hover:translate-x-1 transition-transform duration-300">
                {title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </li>
    );
}
