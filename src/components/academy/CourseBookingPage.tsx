"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ShieldCheck,
    Laptop,
    Heart,
    ChevronDown,
} from "lucide-react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import TrustedPartners from "@/components/landing/TrustedPartners";
import SeminarTestimonials from "@/components/resources/pages/SeminarTestimonials";
import BookingForm from "@/components/academy/BookingForm";

interface CourseBookingPageProps {
    course: {
        id: string;
        title: string;
        description: string;
        price: number | string;
        level: string;
    };
}

const gallery = [
    {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop&auto=format&q=80",
        caption: "Small, mentor-led cohorts where questions actually get answered.",
    },
    {
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=520&fit=crop&auto=format&q=80",
        caption: "Real tools, real targets, real cloud labs — not slideshows.",
    },
    {
        src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=520&fit=crop&auto=format&q=80",
        caption: "A community of learners who end up hiring each other.",
    },
];

const faqs = [
    {
        question: "Are these certifications globally recognized?",
        answer: "Yes. All ZecurX certifications are ISO-verified and recognized across 160+ countries. Our curriculum aligns with global standards including CEH, CISSP, OSCP, and CompTIA frameworks.",
    },
    {
        question: "Do I get hands-on practice?",
        answer: "Absolutely. Every course includes dedicated cloud lab access with real-world attack simulations. You'll work on live targets, not simulations. Our labs run 24/7 during your course duration.",
    },
    {
        question: "What is the class format?",
        answer: "Courses are delivered through a blend of live instructor-led sessions, self-paced video content, and hands-on lab exercises. You'll have direct access to instructors through dedicated Slack channels.",
    },
    {
        question: "Is there placement assistance?",
        answer: "Yes. We provide resume workshops, mock interviews, and direct referrals to our hiring partners. Our placement rate is 94% across all programs.",
    },
    {
        question: "What happens after I pay the ₹2,000 deposit?",
        answer: "Your seat in the batch is locked in immediately. You'll get an email with a secure link to pay the remaining balance any time within the next 15 days, at your convenience.",
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-border py-5">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-left"
            >
                <span className="font-semibold text-foreground pr-4">{question}</span>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <p className="text-muted-foreground text-sm leading-relaxed mt-3 max-w-2xl">
                    {answer}
                </p>
            )}
        </div>
    );
}

export default function CourseBookingPage({ course }: CourseBookingPageProps) {
    const router = useRouter();
    const coursePrice = typeof course.price === "number" ? course.price : 0;

    return (
        <main className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            <CreativeNavBar />

            <div className="flex-1">
                {/* ===== HERO ===== */}
                <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-[1200px] mx-auto">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course
                        </button>

                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                                    Book Your Slot
                                </span>
                                <h1
                                    className="mt-3 text-3xl sm:text-4xl md:text-5xl font-manrope font-bold text-foreground mb-5 leading-[1.1]"
                                    style={{ letterSpacing: "-0.02em" }}
                                >
                                    Your seat in <span className="text-blue-600">{course.title}</span> is one step away
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                                    Reserve today, learn from mentors who&apos;ve actually done the job, and join a
                                    community of learners who look out for each other long after the course ends.
                                </p>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    {[
                                        { icon: ShieldCheck, label: "ISO Verified" },
                                        { icon: Laptop, label: "Live Cloud Labs" },
                                        { icon: Heart, label: "Mentor Support" },
                                    ].map((badge, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5">
                                            <badge.icon className="w-4 h-4 text-blue-600" />
                                            {badge.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-border">
                                <img
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=700&fit=crop&auto=format&q=80"
                                    alt="Students engaged in a hands-on cybersecurity class"
                                    className="w-full h-full object-cover aspect-[9/7]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== MAIN: content + booking form ===== */}
                <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
                    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-5 gap-12">
                        {/* LEFT: persuasive content */}
                        <div className="lg:col-span-3 space-y-16">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-8">
                                    What It&apos;s Actually Like to Learn Here
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {gallery.map((item, i) => (
                                        <div key={i} className="rounded-2xl overflow-hidden border border-border group">
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={item.src}
                                                    alt={item.caption}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed p-3">
                                                {item.caption}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden border border-border">
                                <img
                                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1100&h=500&fit=crop&auto=format&q=80"
                                    alt="Team celebrating together"
                                    className="w-full h-64 md:h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-8">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-manrope font-bold text-white mb-2">
                                            Join a community that has your back
                                        </h3>
                                        <p className="text-sm text-white/85 max-w-md">
                                            Alumni network, dedicated Slack channels, and mentors who stay reachable long after graduation day.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <div>
                                    {faqs.map((faq, i) => (
                                        <FAQItem key={i} {...faq} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: booking form */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-28 bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-manrope font-bold text-foreground mb-1">Book Your Slot</h3>
                                <p className="text-sm text-muted-foreground mb-5">{course.title}</p>
                                <BookingForm courseId={course.id} courseTitle={course.title} coursePrice={coursePrice} />
                            </div>
                        </div>
                    </div>
                </section>

                <SeminarTestimonials />
                <TrustedPartners />
            </div>

            <Footer />
        </main>
    );
}
