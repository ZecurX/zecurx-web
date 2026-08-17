'use client';

import { motion } from 'motion/react';
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
    unsplashId?: string;
}

const LEVEL_ACCENT: Record<string, string> = {
    Beginner: 'bg-emerald-500',
    Intermediate: 'bg-blue-500',
    Advanced: 'bg-purple-500',
    Expert: 'bg-rose-500',
};

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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-[#111827] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1"
        >
            {/* Institutions only banner */}
            {isInstitutionOnly && (
                <div className="relative z-10 flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-r from-[#4c69e4] to-indigo-500 text-white text-[11px] font-bold uppercase tracking-widest">
                    Institutions Only
                </div>
            )}

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 40px 0 rgba(76,105,228,0.08)',
                }}
            />

            {/* Image area */}
            <div className="relative w-full h-52 overflow-hidden">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                )}

                {/* Overlay gradient at bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111827] to-transparent" />

                {/* Level + duration row */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${LEVEL_ACCENT[level] || 'bg-slate-500'} text-white shadow-lg`}>
                        <BarChart3 className="w-3 h-3" />
                        {level}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur-sm rounded-md">
                        <Clock className="w-3 h-3" />
                        {duration}
                    </span>
                </div>

                {/* Popular tag */}
                {popular && (
                    <div className="absolute bottom-6 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 rounded-full shadow-lg shadow-amber-500/20">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            Most Popular
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 pt-5">
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-[#7b93f5] transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2 font-light">
                    {description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                    {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-[13px] text-slate-300 flex items-start gap-2.5">
                            <span className="w-1 h-1 rounded-full bg-[#4c69e4] shrink-0 mt-2" />
                            <span className="leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* View Details Button */}
                <Link
                    href={`/academy/${id}`}
                    className="relative flex items-center justify-between w-full py-3 px-5 text-sm font-semibold text-white rounded-xl overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                    {/* Button background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#0f172a] opacity-90 group-hover/btn:opacity-100 transition-opacity" />
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                    <span className="relative z-10 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                    </span>
                    <ChevronRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
