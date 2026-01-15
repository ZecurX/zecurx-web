"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographicCardProps {
    index: number;
    title: string;
    description: string;
    className?: string;
}

export function TypographicCard({ index, title, description, className }: TypographicCardProps) {
    const formattedIndex = index < 10 ? `0${index}` : index;

    return (
        <div className={cn(
            "group relative p-8 h-full flex flex-col justify-between",
            "bg-background border border-border hover:border-foreground/20 transition-all duration-500",
            "hover:shadow-xl hover:shadow-foreground/5",
            className
        )}>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            
            <div className="mb-8">
                <span className="block font-mono text-xs text-muted-foreground/60 mb-4 tracking-widest">
                    /{formattedIndex}
                </span>
                <h3 className="text-xl md:text-2xl font-manrope font-semibold text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                    {title}
                </h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base border-t border-border/50 pt-6 group-hover:text-foreground/80 transition-colors">
                {description}
            </p>
        </div>
    );
}
