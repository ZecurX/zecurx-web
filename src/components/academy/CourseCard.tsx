'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Award, CheckCircle } from 'lucide-react';
import RazorpayCheckout from './RazorpayCheckout';
import { useState } from 'react';
import BrochureModal from './BrochureModal';

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
}

export default function CourseCard({
    id,
    title,
    description,
    price,
    originalPrice,
    duration,
    students = 0,
    level,
    features,
    popular = false,
    delay = 0,
    brochureLink,
}: CourseCardProps) {
    const [isPurchased, setIsPurchased] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBrochureOpen, setIsBrochureOpen] = useState(false);

    const handleSuccess = (paymentId: string) => {
        setIsPurchased(true);
        setError(null);
        console.log('Payment successful:', paymentId);
    };

    const handleFailure = (errorMessage: string) => {
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
    };

    const formatPrice = (amount: number | string) => {
        if (typeof amount === 'string') return amount;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
                viewport={{ once: true }}
                className="group relative flex flex-col h-full bg-background/50 border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all duration-300 rounded-2xl overflow-hidden"
            >
                {/* Minimal Popular Tag */}
                {popular && (
                    <div className="absolute top-0 right-0">
                        <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-foreground text-background">
                            Popular
                        </span>
                    </div>
                )}

                <div className="flex flex-col flex-1 p-8">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-6 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                        <span>{level}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{duration}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-manrope font-light text-foreground mb-3 leading-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 min-h-[40px]">{description}</p>

                    {/* Features (Minimal List) */}
                    <ul className="space-y-2 mb-8 flex-1">
                        {features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-border/50">
                        <div className="flex items-end justify-between gap-4 mb-6">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Investment</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-foreground">{formatPrice(price)}</span>
                                    {originalPrice && (
                                        <span className="text-sm text-muted-foreground line-through decoration-red-500/70 decoration-[1.5px]">
                                            {formatPrice(originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-3 text-xs text-red-500">
                                {error}
                            </div>
                        )}

                        {/* Buttons: Enroll/Contact + Brochure */}
                        <div className="flex flex-col gap-3 mt-4">
                            {isPurchased ? (
                                <div className="w-full py-3 text-center text-sm font-medium text-green-500 border border-green-500/20 bg-green-500/5 rounded-lg">
                                    Enrolled
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    {/* Primary Button */}
                                    {typeof price === 'number' ? (
                                        <a
                                            href={`/checkout?itemId=${id}&itemName=${encodeURIComponent(title)}&price=${price}&type=course`}
                                            className="flex-1 flex items-center justify-center py-3 px-4 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-lg"
                                        >
                                            Enroll Now
                                        </a>
                                    ) : (
                                        <a
                                            href="/contact"
                                            className="flex-1 flex items-center justify-center py-3 px-4 text-sm font-semibold bg-muted/20 text-foreground border border-border hover:bg-muted/30 transition-colors rounded-lg"
                                        >
                                            Contact for Pricing
                                        </a>
                                    )}

                                    {/* Secondary Button - Brochure */}
                                    {brochureLink && (
                                        <button
                                            onClick={() => setIsBrochureOpen(true)}
                                            className="flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5 transition-colors rounded-lg cursor-pointer"
                                        >
                                            View Brochure
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Functionality: Brochure Modal */}
            {brochureLink && (
                <BrochureModal
                    isOpen={isBrochureOpen}
                    onClose={() => setIsBrochureOpen(false)}
                    courseTitle={title}
                    brochureLink={brochureLink}
                />
            )}
        </>
    );
}
