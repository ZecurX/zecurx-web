"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming utils exists, otherwise I'll verify imports

interface ServiceCTAProps {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
}

export default function ServiceCTA({ title, description, ctaLabel, ctaHref }: ServiceCTAProps) {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements to match the "clean" but "styled" look - subtle grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
                    {title}
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>

                <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors group"
                >
                    {ctaLabel}
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
            </div>
        </section>
    );
}
