'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Award, CheckCircle } from 'lucide-react';
import RazorpayCheckout from './RazorpayCheckout';
import { useState } from 'react';

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    duration: string;
    students?: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    features: string[];
    popular?: boolean;
    delay?: number;
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
}: CourseCardProps) {
    const [isPurchased, setIsPurchased] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuccess = (paymentId: string) => {
        setIsPurchased(true);
        setError(null);
        console.log('Payment successful:', paymentId);
    };

    const handleFailure = (errorMessage: string) => {
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
    };

    const levelColors = {
        Beginner: 'bg-primary/10 text-primary border-primary/20',
        Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Advanced: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        Expert: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className={`relative flex flex-col h-full rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${popular ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
                }`}
        >
            {/* Popular badge */}
            {popular && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Card content */}
            <div className="flex flex-col flex-1 p-6">
                {/* Level badge */}
                <span className={`self-start px-3 py-1 text-xs font-medium rounded-full border ${levelColors[level]}`}>
                    {level}
                </span>

                {/* Title and description */}
                <h3 className="mt-4 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{duration}</span>
                    </div>
                    {students > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{students.toLocaleString()} enrolled</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-primary" />
                        <span>Certificate</span>
                    </div>
                </div>

                {/* Features */}
                <ul className="mt-4 space-y-2 flex-1">
                    {features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Price and CTA */}
                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-foreground">{formatPrice(price)}</span>
                        {originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="mb-3 p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    {isPurchased ? (
                        <div className="w-full py-3 px-4 text-center font-semibold bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl">
                            ✓ Enrolled Successfully!
                        </div>
                    ) : (
                        <RazorpayCheckout
                            itemId={id}
                            itemName={title}
                            amount={price}
                            onSuccess={handleSuccess}
                            onFailure={handleFailure}
                            className="w-full py-3 px-4 font-semibold bg-primary text-primary-foreground rounded-xl transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            Enroll Now
                        </RazorpayCheckout>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
