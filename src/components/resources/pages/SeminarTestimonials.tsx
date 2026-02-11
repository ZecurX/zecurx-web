"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        quote: "The ZecurX seminar on Zero Trust Architecture was a game-changer for our students. The hands-on labs on network defense were incredibly valuable.",
        name: "Dr. Rajesh Kumar",
        role: "HOD, Computer Science",
        org: "MSRIT",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    },
    {
        quote: "An exceptional session covering both Generative AI vulnerabilities and modern Cybersecurity. Exactly what our advanced learners needed.",
        name: "Prof. Vikram Singh",
        role: "Dean of Technology",
        org: "Presidency University",
        image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    },
    {
        quote: "Our students gained practical skills in ethical hacking that went far beyond the curriculum. A truly professional and insightful workshop.",
        name: "Fr. Thomas",
        role: "Principal",
        org: "St. Paul's College",
        image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000&auto=format&fit=crop",
        location: "Bengaluru"
    },
    {
        quote: "ZecurX brought industry-standard cybersecurity training to our campus. The live demonstrations of threat vectors were eye-opening.",
        name: "Dr. Anjali Menon",
        role: "Director",
        org: "RIBS",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    },
    {
        quote: "The depth of knowledge shared during the cyber defense workshop was outstanding. It bridged the gap between theory and industry practice.",
        name: "Prof. Suresh Gowda",
        role: "Placement Officer",
        org: "MSRCASC",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    },
    {
        quote: "A comprehensive deep dive into cybersecurity. The instructors were experts who engaged our students with real-world case studies.",
        name: "Dr. Farhan Ahmed",
        role: "HOD, IT",
        org: "Yenepoya University",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
        location: "Bengaluru"
    },
    {
        quote: "The seminar on application security provided our students with critical skills for their future careers. Highly recommended.",
        name: "Prof. Lakshmi Narayan",
        role: "Principal",
        org: "Nagarjuna Degree College",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    },
    {
        quote: "Excellent training on information security. The practical approach helped our management students understand digital risk.",
        name: "Dr. R. K. Mishra",
        role: "Director",
        org: "IIBS",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
        location: "Bangalore"
    }
];

export default function SeminarTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextTestimonial, 3000);
        return () => clearInterval(interval);
    }, [isPaused, nextTestimonial]);

    return (
        <section className="py-16 md:py-32 bg-background border-t border-border/40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                            Academic <span className="text-muted-foreground font-medium">Impact</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl text-base md:text-lg font-light">
                            Trusted by leading institutions to bridge the gap between curriculum and cyber warfare.
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={prevTestimonial}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>

                <div
                    className="relative w-full h-auto min-h-[450px] md:min-h-[320px] lg:min-h-[380px] md:aspect-[2.2/1] lg:aspect-[2.5/1] overflow-hidden rounded-2xl md:rounded-[2rem] border border-border bg-card flex flex-col md:block shadow-sm"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:absolute inset-0 flex flex-col md:flex-row h-full"
                        >
                            {/* Image Side */}
                            <div className="relative w-full md:w-[40%] h-56 md:h-full shrink-0 overflow-hidden">
                                <Image
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].org}
                                    fill
                                    className="object-cover transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-card" />
                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                    <div className="font-bold text-base">{testimonials[currentIndex].org}</div>
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {testimonials[currentIndex].location}
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="relative w-full md:w-[60%] h-full p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-card">
                                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                                
                                <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed text-foreground">
                                    "{testimonials[currentIndex].quote}"
                                </p>

                                <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-end">
                                    <div>
                                        <div className="font-bold text-foreground text-sm md:text-base">{testimonials[currentIndex].name}</div>
                                        <div className="text-xs md:text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <div className="font-bold text-foreground text-sm md:text-base">{testimonials[currentIndex].org}</div>
                                        <div className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {testimonials[currentIndex].location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1 transition-all duration-300 rounded-full ${
                                i === currentIndex ? "w-8 bg-foreground" : "w-4 bg-border hover:bg-muted-foreground"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
