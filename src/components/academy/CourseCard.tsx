'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, Clock, BarChart3, ChevronRight } from 'lucide-react';

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
    cardImage?: string;
}

const LEVEL_LABEL: Record<string, string> = {
    Beginner: 'Beginner',
    Intermediate: 'Intermediate',
    Advanced: 'Advanced',
    Expert: 'Expert',
};

// zxCCP, zxCCF, zxCCE, zxCFD - institution-only programs
const INSTITUTION_ONLY_IDS = new Set([
    '7f0e2cb3-82c1-4634-9a95-67a2ae14a815',
    '3613d162-d801-47c6-9305-719f999738c8',
    'ef34cbc8-c918-4e64-bd88-799863b299e1',
    '9bce53be-103e-46b9-9fa0-2b91260f38db',
]);

export default function CourseCard({
    id,
    title,
    description,
    duration,
    level,
    features,
    popular = false,
    delay = 0,
    cardImage,
}: CourseCardProps) {
    const imageUrl = cardImage || null;
    const isInstitutionOnly = INSTITUTION_ONLY_IDS.has(id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-[color:var(--zx-primary-fixed)] rounded-xl overflow-hidden transition-transform hover:-translate-y-2 duration-300"
        >
            {isInstitutionOnly && (
                <div className="relative z-10 flex items-center justify-center gap-1.5 py-1.5 bg-[color:var(--zx-tertiary)] text-[color:var(--zx-on-tertiary)] font-manrope text-[11px] font-bold uppercase tracking-widest">
                    Institutions Only
                </div>
            )}

            {/* Image area, organic mask */}
            <div className="h-64 w-full relative overflow-hidden" style={{ clipPath: 'ellipse(120% 100% at 50% 0%)' }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-[color:var(--zx-surface-variant)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--zx-primary-fixed)] to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-8 relative z-10 -mt-12">
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-[color:var(--zx-secondary)]/10 text-[color:var(--zx-secondary)] border border-[color:var(--zx-secondary)]/20 px-3 py-1 rounded-full font-manrope text-[11px] font-semibold flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {LEVEL_LABEL[level] || level}
                    </span>
                    <span className="bg-[color:var(--zx-surface)]/60 text-[color:var(--zx-on-surface)] border border-[color:var(--zx-outline-variant)]/40 px-3 py-1 rounded-full font-manrope text-[11px] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration}
                    </span>
                    {popular && (
                        <span className="bg-[color:var(--zx-tertiary)]/10 text-[color:var(--zx-tertiary)] border border-[color:var(--zx-tertiary)]/20 px-3 py-1 rounded-full font-manrope text-[11px] font-semibold">
                            Most Popular
                        </span>
                    )}
                </div>
                <h3 className="font-libre-caslon text-[22px] leading-snug text-[color:var(--zx-on-primary-fixed)] mb-4">
                    {title}
                </h3>
                <p className="text-sm text-[color:var(--zx-on-surface-variant)] mb-8 flex-grow line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <ul className="space-y-2 mb-6">
                    {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-[13px] text-[color:var(--zx-on-surface-variant)] flex items-start gap-2.5">
                            <span className="w-1 h-1 rounded-full bg-[color:var(--zx-secondary)] shrink-0 mt-2" />
                            <span className="leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Link
                    href={`/academy/${id}`}
                    className="flex items-center justify-between border-t border-[color:var(--zx-outline-variant)]/30 pt-4 font-manrope text-[11px] font-semibold uppercase tracking-widest text-[color:var(--zx-on-surface-variant)] group-hover:text-[color:var(--zx-secondary)] transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" />
                        View Syllabus
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
