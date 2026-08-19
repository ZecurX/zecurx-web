'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowUpRight, Clock, BarChart3, Star } from 'lucide-react';

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    price: number | string;
    originalPrice?: number;
    duration: string;
    students?: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    features: string[];
    popular?: boolean;
    delay?: number;
    brochureLink?: string;
    logo?: string;
    pricingType?: 'fixed' | 'contact' | 'institutional';
    inStock?: boolean;
    unsplashId?: string;
}

export default function CourseCard({
    id,
    title,
    description,
    duration,
    level,
    features,
    popular = false,
    delay = 0,
    unsplashId,
    pricingType,
}: CourseCardProps) {
    const imageUrl = unsplashId
        ? `https://images.unsplash.com/${unsplashId}?w=700&h=440&fit=crop&auto=format&q=80`
        : null;
    const isInstitutionOnly = pricingType === 'institutional';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/[0.06] hover:-translate-y-1 hover:border-transparent"
        >
            {isInstitutionOnly && (
                <div className="py-1.5 bg-muted text-center text-foreground/80 text-[11px] font-semibold uppercase tracking-wide border-b border-border">
                    Institutions Only
                </div>
            )}

            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden bg-muted">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-7">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-blue-600/70" />
                        {level}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600/70" />
                        {duration}
                    </span>
                </div>

                {popular && (
                    <span className="inline-flex items-center gap-1 mb-2.5 text-xs font-semibold text-blue-600">
                        <Star className="w-3 h-3 fill-blue-600" />
                        Most Popular
                    </span>
                )}

                <h3 className="font-manrope font-bold text-xl text-foreground leading-snug mb-2.5" style={{ letterSpacing: "-0.01em" }}>
                    {title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                    {description}
                </p>

                {features.length > 0 && (
                    <ul className="space-y-2 mb-7 flex-1">
                        {features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="text-[13.5px] text-foreground/80 flex items-start gap-2.5">
                                <span className="w-1 h-1 rounded-full bg-blue-600 shrink-0 mt-[7px]" />
                                <span className="leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <Link
                    href={`/academy/${id}`}
                    className="mt-auto flex items-center justify-between pt-5 border-t border-border"
                >
                    <span className="text-sm font-semibold text-foreground">View Program</span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground transition-all duration-300 group-hover:bg-[#4c69e4] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#4c69e4]/25">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                </Link>
            </div>
        </motion.div>
    );
}
