"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTASectionProps {
    title?: string;
    description?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
    className?: string;
}

export default function CTASection({
    title = "Ready to secure your future?",
    description = "Schedule a consultation with our security architects and see how ZecurX can transform your defense posture.",
    primaryLabel = "Book a Demo",
    primaryHref = "/book-demo",
    secondaryLabel = "Contact Sales",
    secondaryHref = "/contact",
    className
}: CTASectionProps) {
    return (
        <section className={cn("py-32 relative overflow-hidden px-6", className)}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mx-auto"
            >
                <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background px-8 py-16 md:p-20 text-center">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-background/30 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-primary/40 rounded-full blur-[80px]" />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-manrope font-bold mb-6 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-xl md:text-2xl text-background/80 font-light leading-relaxed max-w-2xl mx-auto">
                            {description}
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-background text-foreground hover:bg-background/90 text-lg font-semibold shadow-xl">
                                <Link href={primaryHref}>
                                    {primaryLabel}
                                    <ArrowUpRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            
                            {secondaryLabel && secondaryHref && (
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background text-lg font-medium">
                                    <Link href={secondaryHref}>
                                        {secondaryLabel}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
