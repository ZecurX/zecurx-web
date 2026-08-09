"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    BarChart3,
    Users,
    Download,
    Calendar,
    CheckCircle2,
    Briefcase,
    Globe,
    Star,
    ChevronDown,
    ChevronUp,
    Target,
    Laptop,
    MessageCircle,
    Award,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import TrustedPartners from "@/components/landing/TrustedPartners";
import BrochureModal from "@/components/academy/BrochureModal";

interface CourseDetailData {
    id: string;
    title: string;
    description: string;
    price: number | string;
    originalPrice?: number;
    duration: string;
    students?: number;
    level: string;
    features: string[];
    popular?: boolean;
    brochureLink?: string;
    logo?: string;
    pricingType?: "fixed" | "contact" | "institutional";
    inStock?: boolean;
    unsplashId?: string;
}

const LEVEL_GRADIENT: Record<string, string> = {
    Beginner: "from-emerald-600 to-teal-700",
    Intermediate: "from-blue-600 to-indigo-700",
    Advanced: "from-cyan-600 to-blue-800",
    Expert: "from-indigo-700 to-slate-900",
};

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
];

export default function CourseDetailClient({
    course,
}: {
    course: CourseDetailData;
}) {
    const router = useRouter();
    const [isBrochureOpen, setIsBrochureOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatPrice = (amount: number | string) => {
        if (typeof amount === "string") return amount;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const heroImage = course.unsplashId
        ? `https://images.unsplash.com/${course.unsplashId}?w=1400&h=500&fit=crop&auto=format&q=85`
        : null;

    return (
        <main className="min-h-screen bg-[#080b14] flex flex-col font-sans text-white">
            <CreativeNavBar expanded={!scrolled} />

            <div className="flex-1">
                {/* ===== HERO BANNER ===== */}
                <section className="relative">
                    {/* Hero image background */}
                    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                        {/* Subtle top fade for text readability */}
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent z-10 pointer-events-none" />
                        {heroImage ? (
                            <>
                                <img
                                    src={heroImage}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${LEVEL_GRADIENT[course.level] || "from-slate-700 to-slate-800"} opacity-75`} />
                            </>
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-r ${LEVEL_GRADIENT[course.level] || "from-slate-700 to-slate-800"}`} />
                        )}

                        {/* Overlay content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-[1320px] mx-auto px-6 w-full">
                                <div className="max-w-2xl">
                                    {/* Back link */}
                                    <button
                                        onClick={() => router.back()}
                                        className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-6"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Academy
                                    </button>

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-3 mb-5" />

                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                                        {course.title}
                                    </h1>
                                    <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                                        {course.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== STICKY ACTION BAR ===== */}
                <section className="sticky top-20 z-30 bg-[#0d1020]/95 backdrop-blur-md border-b border-white/[0.06] shadow-lg">
                    <div className="max-w-[1320px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-extrabold text-white">
                                {formatPrice(course.price)}
                            </span>
                            {course.originalPrice && (
                                <span className="text-base text-slate-500 line-through">
                                    {formatPrice(course.originalPrice)}
                                </span>
                            )}
                            {course.originalPrice && typeof course.price === "number" && typeof course.originalPrice === "number" && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {course.brochureLink && (
                                <button
                                    onClick={() => setIsBrochureOpen(true)}
                                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Brochure
                                </button>
                            )}
                            {course.pricingType === "institutional" ? (
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-[#3b57d4] transition-all hover:shadow-lg hover:shadow-[#4c69e4]/25"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Book Your Slot
                                </Link>
                            ) : course.pricingType === "contact" ? (
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-[#3b57d4] transition-all"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Contact for Pricing
                                </Link>
                            ) : course.inStock ? (
                                <Link
                                    href={`/checkout?itemId=${course.id}&type=course`}
                                    className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-2.5 text-sm font-semibold hover:bg-[#3b57d4] transition-all hover:shadow-lg hover:shadow-[#4c69e4]/25"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Book Your Slot
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-2 bg-white/5 text-slate-500 rounded-full px-8 py-2.5 text-sm font-semibold cursor-not-allowed border border-white/[0.06]">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== CONTENT BODY ===== */}
                <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* LEFT COLUMN - Main content */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Overview */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
                                    Course Overview
                                </h2>
                                <div className="text-slate-300 leading-relaxed space-y-4">
                                    <p className="text-lg text-slate-200">
                                        {course.description}
                                    </p>
                                    <p>
                                        This comprehensive program is designed to equip you with the practical skills and theoretical 
                                        knowledge needed to excel in today&apos;s rapidly evolving cybersecurity landscape. Through a blend 
                                        of instructor-led sessions, hands-on lab exercises, and real-world case studies, you&apos;ll gain 
                                        deep expertise that directly translates to workplace readiness.
                                    </p>
                                    <p>
                                        Our curriculum is continuously updated to reflect the latest threat vectors, attack methodologies, 
                                        and defense strategies. You&apos;ll learn from active industry practitioners who bring current, 
                                        battlefield-tested knowledge to every session.
                                    </p>
                                    <p>
                                        By the end of this course, you&apos;ll have built a portfolio of practical projects, earned an 
                                        ISO-verified certification, and developed the confidence to tackle real-world security challenges. 
                                        Whether you&apos;re starting your cybersecurity journey or advancing to the next level, this program 
                                        provides the foundation for long-term career growth.
                                    </p>
                                </div>
                            </motion.section>

                            {/* What You'll Learn */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    What You&apos;ll Learn
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {course.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center gap-4 p-5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-[#4c69e4]/30 hover:bg-white/[0.05] transition-all duration-300"
                                        >
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#4c69e4]/20 to-indigo-500/20 border border-[#4c69e4]/20 flex items-center justify-center text-xs font-bold text-[#4c69e4] group-hover:bg-[#4c69e4] group-hover:text-white group-hover:border-[#4c69e4] transition-all">
                                                {String(idx + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Who Is This For */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    Who Is This Course For?
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: Target, title: "Aspiring Security Professionals", desc: "Individuals looking to break into cybersecurity with a structured, industry-recognized certification." },
                                        { icon: Laptop, title: "IT Professionals", desc: "System administrators, network engineers, and developers wanting to add security expertise to their skillset." },
                                        { icon: Briefcase, title: "Career Switchers", desc: "Professionals from other fields seeking to transition into the high-demand cybersecurity industry." },
                                        { icon: Star, title: "Students & Graduates", desc: "Recent graduates and college students wanting to stand out with practical, verifiable security credentials." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-[#4c69e4]/10 flex items-center justify-center shrink-0">
                                                <item.icon className="w-5 h-5 text-[#4c69e4]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Career Opportunities */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    Career Opportunities
                                </h2>
                                <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-8">
                                    <p className="text-slate-400 mb-6 leading-relaxed">
                                        Graduates of this program are well-positioned for roles across the cybersecurity spectrum. 
                                        Our alumni work at leading organizations including Fortune 500 companies, government agencies, 
                                        and top cybersecurity consultancies.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {[
                                            "Security Analyst",
                                            "Penetration Tester",
                                            "Security Engineer",
                                            "Incident Responder",
                                            "Security Consultant",
                                            "SOC Analyst",
                                            "Vulnerability Researcher",
                                            "Cloud Security Engineer",
                                        ].map((role, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                <Briefcase className="w-4 h-4 text-[#4c69e4] shrink-0" />
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>

                            {/* FAQ */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-3">
                                    {faqs.map((faq, i) => (
                                        <FAQItem key={i} {...faq} />
                                    ))}
                                </div>
                            </motion.section>
                        </div>

                        {/* RIGHT COLUMN - Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-[140px] space-y-6">
                                {/* Quick Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
                                >
                                    <h3 className="text-lg font-bold text-white mb-5">Course Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Duration</p>
                                                <p className="text-sm font-semibold text-slate-200">{course.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Level</p>
                                                <p className="text-sm font-semibold text-slate-200">{course.level}</p>
                                            </div>
                                        </div>
                                        {course.students && course.students > 0 && (
                                            <div className="flex items-center gap-3">
                                                <Users className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Learners</p>
                                                    <p className="text-sm font-semibold text-slate-200">{course.students}+ Enrolled</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Certificate</p>
                                                <p className="text-sm font-semibold text-slate-200">ISO Verified</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Language</p>
                                                <p className="text-sm font-semibold text-slate-200">English</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MessageCircle className="w-5 h-5 text-[#4c69e4] shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Support</p>
                                                <p className="text-sm font-semibold text-slate-200">24/7 Slack + Email</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Enroll Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-gradient-to-br from-[#111530] to-[#0d1020] rounded-2xl border border-white/[0.06] p-6 shadow-xl"
                                >
                                    <h3 className="text-lg font-bold text-white mb-3">Ready to Advance Your Career?</h3>
                                    <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                                        Join {course.students || 0}+ professionals who have transformed their careers with this program.
                                    </p>
                                    <ul className="space-y-2 mb-5">
                                        {[
                                            "ISO Verified Certification",
                                            "Hands-on Cloud Lab Access",
                                            "Industry Expert Mentorship",
                                            "Placement Assistance",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-[#4c69e4] shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    {course.pricingType === "institutional" ? (
                                        <Link
                                            href="/contact"
                                            className="block w-full text-center py-3 bg-[#4c69e4] text-white rounded-xl text-sm font-semibold hover:bg-[#3b57d4] transition-colors"
                                        >
                                            Contact Us
                                        </Link>
                                    ) : course.pricingType === "contact" ? (
                                        <Link
                                            href="/contact"
                                            className="block w-full text-center py-3 bg-[#4c69e4] text-white rounded-xl text-sm font-semibold hover:bg-[#3b57d4] transition-colors"
                                        >
                                            Contact for Pricing
                                        </Link>
                                    ) : course.inStock ? (
                                        <Link
                                            href={`/checkout?itemId=${course.id}&type=course`}
                                            className="block w-full text-center py-3 bg-gradient-to-r from-[#4c69e4] to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-[#3b57d4] hover:to-indigo-700 transition-all hover:shadow-lg hover:shadow-[#4c69e4]/20"
                                        >
                                            Enroll Now
                                        </Link>
                                    ) : (
                                        <span className="block w-full text-center py-3 bg-white/5 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed border border-white/[0.06]">
                                            Coming Soon
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TrustedPartners />
            <Footer />

            {course.brochureLink && (
                <BrochureModal
                    isOpen={isBrochureOpen}
                    onClose={() => setIsBrochureOpen(false)}
                    courseTitle={course.title}
                    brochureLink={course.brochureLink}
                />
            )}
        </main>
    );
}
