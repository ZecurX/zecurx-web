'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Clock, BarChart3, Star } from 'lucide-react';

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
        ? `https://images.unsplash.com/${unsplashId}?w=600&h=340&fit=crop&auto=format&q=80`
        : null;
    const isInstitutionOnly = pricingType === 'institutional';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
            {isInstitutionOnly && (
                <div className="py-1.5 bg-muted text-center text-foreground text-[11px] font-semibold uppercase tracking-wide border-b border-border">
                    Institutions Only
                </div>
            )}

            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden bg-muted">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {level}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {duration}
                    </span>
                </div>

                {popular && (
                    <span className="inline-flex items-center gap-1 mb-2 text-xs font-semibold text-blue-600">
                        <Star className="w-3 h-3 fill-blue-600" />
                        Most Popular
                    </span>
                )}

                <h3 className="font-manrope font-bold text-lg text-foreground leading-snug mb-2">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {description}
                </p>

                {features.length > 0 && (
                    <ul className="space-y-1.5 mb-6 flex-1">
                        {features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="text-[13px] text-foreground/80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-blue-600 shrink-0 mt-[7px]" />
                                <span className="leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <Link
                    href={`/academy/${id}`}
                    className="group/link mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600"
                >
                    View Program
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
