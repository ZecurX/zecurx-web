"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Users,
    Award,
    Globe,
    GraduationCap,
    ShieldCheck,
    Laptop,
    Heart,
    ChevronDown,
    ChevronUp,
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

const stats = [
    { icon: Users, value: "2,500+", label: "Trained" },
    { icon: Award, value: "8", label: "Certifications" },
    { icon: Globe, value: "15+", label: "Countries" },
    { icon: GraduationCap, value: "94%", label: "Placement" },
];

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
        <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.04] transition-colors"
            >
                <span className="font-semibold text-white pr-4">{question}</span>
                {open ? (
                    <ChevronUp className="w-5 h-5 text-[#4c69e4] shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                )}
            </button>
            {open && (
                <div className="px-5 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function CourseBookingPage({ course }: CourseBookingPageProps) {
    const router = useRouter();
    const coursePrice = typeof course.price === "number" ? course.price : 0;

    return (
        <main className="min-h-screen bg-[#080b14] flex flex-col font-sans text-white">
            <CreativeNavBar />

            <div className="flex-1">
                {/* ===== HERO ===== */}
                <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4c69e4]/15 blur-[150px] rounded-full pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course
                        </button>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#4c69e4] bg-[#4c69e4]/10 rounded-full mb-5 border border-[#4c69e4]/20">
                                    Book Your Slot
                                </span>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-[1.1] tracking-tight">
                                    Your seat in{" "}
                                    <span className="bg-gradient-to-r from-[#4c69e4] via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                        {course.title}
                                    </span>{" "}
                                    is one step away
                                </h1>
                                <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
                                    Reserve today, learn from mentors who&apos;ve actually done the job, and join a
                                    community of learners who look out for each other long after the course ends.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { icon: ShieldCheck, label: "ISO Verified" },
                                        { icon: Laptop, label: "Live Cloud Labs" },
                                        { icon: Heart, label: "Mentor Support" },
                                    ].map((badge, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full"
                                        >
                                            <badge.icon className="w-3.5 h-3.5 text-[#4c69e4]" />
                                            {badge.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=700&fit=crop&auto=format&q=80"
                                    alt="Students engaged in a hands-on cybersecurity class"
                                    className="w-full h-full object-cover aspect-[9/7]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080b14]/60 via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== STATS ===== */}
                <section className="py-10 px-6 border-y border-white/[0.06] bg-[#0d1020]">
                    <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold text-white">
                                    <stat.icon className="w-5 h-5 text-[#4c69e4]" />
                                    {stat.value}
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== MAIN: content + booking form ===== */}
                <section className="py-16 md:py-24 px-6">
                    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-5 gap-12">
                        {/* LEFT: persuasive content */}
                        <div className="lg:col-span-3 space-y-16">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    What It&apos;s Actually Like to Learn Here
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {gallery.map((item, i) => (
                                        <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.06] group">
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={item.src}
                                                    alt={item.caption}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed p-3 bg-white/[0.02]">
                                                {item.caption}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-3xl overflow-hidden border border-white/10">
                                <img
                                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1100&h=500&fit=crop&auto=format&q=80"
                                    alt="Team celebrating together"
                                    className="w-full h-64 md:h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-[#080b14]/40 to-transparent flex items-end p-8">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                            Join a community that has your back
                                        </h3>
                                        <p className="text-sm text-slate-300 max-w-md">
                                            Alumni network, dedicated Slack channels, and mentors who stay reachable long after graduation day.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-3">
                                    {faqs.map((faq, i) => (
                                        <FAQItem key={i} {...faq} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: booking form */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-28 bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-1">Book Your Slot</h3>
                                <p className="text-sm text-slate-400 mb-5">{course.title}</p>
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
