"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button";

interface ServiceHeroEmailCaptureProps {
    serviceName: string;
    className?: string;
}

export default function ServiceHeroEmailCapture({ serviceName, className }: ServiceHeroEmailCaptureProps) {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Navigate to book-demo with email and service pre-filled
            const params = new URLSearchParams({
                email: email,
                service: serviceName
            });
            router.push(`/book-demo?${params.toString()}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-3 mt-8", className)}>
            <div className="relative flex-1 max-w-md">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className={cn(
                        "w-full h-14 px-5 pr-4",
                        "bg-background/50 backdrop-blur-sm",
                        "border border-border/50 hover:border-foreground/30 focus:border-foreground/50",
                        "rounded-xl text-foreground placeholder:text-muted-foreground/60",
                        "focus:outline-none focus:ring-2 focus:ring-foreground/10",
                        "transition-all duration-200"
                    )}
                />
            </div>
            <Button
                type="submit"
                className={cn(
                    "group h-14 px-8",
                    "bg-foreground text-background font-medium",
                    "rounded-xl",
                    "hover:shadow-lg hover:shadow-foreground/20",
                    "transition-all duration-300",
                    "flex items-center justify-center gap-2 whitespace-nowrap"
                )}
            >
                Book a Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </form>
    );
}
