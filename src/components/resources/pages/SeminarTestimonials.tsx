"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

const AUTOPLAY_INTERVAL = 5000;

const testimonials = [
    {
        quote: "The ZecurX seminar on Zero Trust Architecture was a game-changer for our students. The hands-on labs on network defense were incredibly valuable.",
        name: "Dr. Rajesh Kumar",
        role: "HOD, Computer Science",
        org: "MSRIT",
        location: "Bangalore"
    },
    {
        quote: "An exceptional session covering both Generative AI vulnerabilities and modern Cybersecurity. Exactly what our advanced learners needed.",
        name: "Prof. Vikram Singh",
        role: "Dean of Technology",
        org: "Presidency University",
        location: "Bangalore"
    },
    {
        quote: "Our students gained practical skills in ethical hacking that went far beyond the curriculum. A truly professional and insightful workshop.",
        name: "Fr. Thomas",
        role: "Principal",
        org: "St. Paul's College",
        location: "Bengaluru"
    },
    {
        quote: "ZecurX brought industry-standard cybersecurity training to our campus. The live demonstrations of threat vectors were eye-opening.",
        name: "Dr. Anjali Menon",
        role: "Director",
        org: "RIBS",
        location: "Bangalore"
    },
    {
        quote: "The depth of knowledge shared during the cyber defense workshop was outstanding. It bridged the gap between theory and industry practice.",
        name: "Prof. Suresh Gowda",
        role: "Placement Officer",
        org: "MSRCASC",
        location: "Bangalore"
    },
    {
        quote: "A comprehensive deep dive into cybersecurity. The instructors were experts who engaged our students with real-world case studies.",
        name: "Dr. Farhan Ahmed",
        role: "HOD, IT",
        org: "Yenepoya University",
        location: "Bengaluru"
    },
    {
        quote: "The seminar on application security provided our students with critical skills for their future careers. Highly recommended.",
        name: "Prof. Lakshmi Narayan",
        role: "Principal",
        org: "Nagarjuna Degree College",
        location: "Bangalore"
    },
    {
        quote: "Excellent training on information security. The practical approach helped our management students understand digital risk.",
        name: "Dr. R. K. Mishra",
        role: "Director",
        org: "IIBS",
        location: "Bangalore"
    }
];

export default function SeminarTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(0);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setProgress(0);
    }, []);

    const prevTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setProgress(0);
    }, []);

    useEffect(() => {
        if (isPaused) {
            if (progressRef.current) cancelAnimationFrame(progressRef.current);
            return;
        }

        lastTickRef.current = performance.now();

        const tick = (now: number) => {
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;

            setProgress((prev) => {
                const next = prev + (delta / AUTOPLAY_INTERVAL) * 100;
                if (next >= 100) {
                    // Schedule advance on next frame to avoid state update during render
                    requestAnimationFrame(() => nextTestimonial());
                    return 0;
                }
                return next;
            });

            progressRef.current = requestAnimationFrame(tick);
        };

        progressRef.current = requestAnimationFrame(tick);
        return () => {
            if (progressRef.current) cancelAnimationFrame(progressRef.current);
        };
    }, [isPaused, currentIndex, nextTestimonial]);

    const current = testimonials[currentIndex];
    const initials = current.name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <section className="relative py-20 md:py-32 bg-background overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="flex items-center justify-center gap-2.5 mb-5">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-primary font-manrope font-semibold tracking-widest text-xs uppercase">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-4 tracking-tight text-foreground">
                        Academic{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                            Impact
                        </span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg font-manrope font-light leading-relaxed">
                        Trusted by leading institutions to bridge the gap between curriculum and cyber warfare.
                    </p>
                </div>

                {/* Testimonial */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Progress bar */}
                    <div className="max-w-xs mx-auto h-[2px] bg-border/30 rounded-full mb-12 overflow-hidden">
                        <div
                            className="h-full bg-primary/50 rounded-full transition-none"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center"
                        >
                            <blockquote className="max-w-4xl mx-auto mb-10">
                                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-manrope font-light text-foreground/90 leading-[1.35] tracking-[-0.01em]">
                                    &ldquo;{current.quote}&rdquo;
                                </p>
                            </blockquote>

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-manrope font-semibold text-primary">
                                        {initials}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-manrope font-semibold text-foreground text-base">
                                        {current.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-manrope">
                                        {current.role}, {current.org}
                                    </div>
                                    <div className="text-xs text-muted-foreground/60 font-manrope mt-0.5">
                                        {current.location}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button
                            onClick={prevTestimonial}
                            className="group w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-200 text-foreground"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentIndex(i);
                                        setProgress(0);
                                    }}
                                    className={`h-[3px] transition-all duration-300 rounded-full ${
                                        i === currentIndex
                                            ? "w-8 bg-primary"
                                            : "w-3 bg-border hover:bg-muted-foreground"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="group w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-200 text-foreground"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
