"use client";

import React, { useState, useEffect } from "react";
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
import { BlurFade } from "@/components/ui/blur-fade";

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

const careerRoles = [
    "Security Analyst",
    "Penetration Tester",
    "Security Engineer",
    "Incident Responder",
    "Security Consultant",
    "SOC Analyst",
    "Vulnerability Researcher",
    "Cloud Security Engineer",
];

const audience = [
    { icon: Target, title: "Aspiring Security Professionals", desc: "Individuals looking to break into cybersecurity with a structured, industry-recognized certification." },
    { icon: Laptop, title: "IT Professionals", desc: "System administrators, network engineers, and developers wanting to add security expertise to their skillset." },
    { icon: Briefcase, title: "Career Switchers", desc: "Professionals from other fields seeking to transition into the high-demand cybersecurity industry." },
    { icon: Star, title: "Students & Graduates", desc: "Recent graduates and college students wanting to stand out with practical, verifiable security credentials." },
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
        ? `https://images.unsplash.com/${course.unsplashId}?w=900&h=700&fit=crop&auto=format&q=85`
        : null;

    const EnrollCTA = ({ full = false }: { full?: boolean }) => {
        const base = "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-colors";
        if (course.pricingType === "institutional") {
            return (
                <Link href="/contact" className={`${base} bg-[#4c69e4] text-white hover:bg-[#3b57d4] ${full ? "w-full" : ""}`}>
                    <Calendar className="w-4 h-4" />
                    Book Your Slot
                </Link>
            );
        }
        if (course.pricingType === "contact") {
            return (
                <Link href="/contact" className={`${base} bg-[#4c69e4] text-white hover:bg-[#3b57d4] ${full ? "w-full" : ""}`}>
                    <Calendar className="w-4 h-4" />
                    Contact for Pricing
                </Link>
            );
        }
        if (course.inStock) {
            return (
                <Link href={`/academy/${course.id}/book`} className={`${base} bg-[#4c69e4] text-white hover:bg-[#3b57d4] ${full ? "w-full" : ""}`}>
                    <Calendar className="w-4 h-4" />
                    Enroll Now
                </Link>
            );
        }
        return (
            <span className={`${base} bg-muted text-muted-foreground cursor-not-allowed border border-border ${full ? "w-full" : ""}`}>
                Coming Soon
            </span>
        );
    };

    return (
        <main className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            <CreativeNavBar expanded={!scrolled} />

            <div className="flex-1">
                {/* ===== HERO ===== */}
                <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Academy
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <BlurFade inView direction="up">
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl font-manrope font-bold text-foreground leading-[1.1] mb-5"
                                style={{ letterSpacing: "-0.02em" }}
                            >
                                {course.title}
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-6">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                    {course.level}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    {course.duration}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    ISO Verified Certification
                                </span>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.15} inView direction="up">
                            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted">
                                {heroImage && (
                                    <img
                                        src={heroImage}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </BlurFade>
                    </div>
                </section>

                {/* ===== STICKY ACTION BAR ===== */}
                <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-y border-border">
                    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-manrope font-bold text-foreground">
                                {formatPrice(course.price)}
                            </span>
                            {course.originalPrice && (
                                <span className="text-base text-muted-foreground line-through">
                                    {formatPrice(course.originalPrice)}
                                </span>
                            )}
                            {course.originalPrice && typeof course.price === "number" && typeof course.originalPrice === "number" && (
                                <span className="text-xs font-semibold text-blue-600">
                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {course.brochureLink && (
                                <button
                                    onClick={() => setIsBrochureOpen(true)}
                                    className="inline-flex items-center gap-2 border border-border text-foreground rounded-full px-6 py-3 text-sm font-semibold hover:border-slate-300 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Brochure
                                </button>
                            )}
                            <EnrollCTA />
                        </div>
                    </div>
                </section>

                {/* ===== CONTENT BODY ===== */}
                <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* LEFT COLUMN - Main content */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Overview */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-6">
                                    Course Overview
                                </h2>
                                <div className="text-muted-foreground leading-relaxed space-y-4">
                                    <p className="text-lg text-foreground/90">
                                        {course.description}
                                    </p>
                                    <p>
                                        This program is designed to equip you with the practical skills and theoretical
                                        knowledge needed to excel in today&apos;s rapidly evolving cybersecurity landscape. Through a blend
                                        of instructor-led sessions, hands-on lab exercises, and real-world case studies, you&apos;ll gain
                                        expertise that directly translates to workplace readiness.
                                    </p>
                                    <p>
                                        By the end of this course, you&apos;ll have built a portfolio of practical projects, earned an
                                        ISO-verified certification, and developed the confidence to tackle real-world security challenges.
                                    </p>
                                </div>
                            </section>

                            {/* What You'll Learn */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-8">
                                    What You&apos;ll Learn
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {course.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                            <span className="text-sm text-foreground/90 leading-relaxed">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Who Is This For */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-8">
                                    Who Is This Course For?
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                                    {audience.map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <item.icon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Career Opportunities */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-6">
                                    Career Opportunities
                                </h2>
                                <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl">
                                    Graduates of this program are well-positioned for roles across the cybersecurity spectrum.
                                    Our alumni work at leading organizations including Fortune 500 companies, government agencies,
                                    and top cybersecurity consultancies.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {careerRoles.map((role, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/90">
                                            <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* FAQ */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-manrope font-bold text-foreground mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <div>
                                    {faqs.map((faq, i) => (
                                        <FAQItem key={i} {...faq} />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN - Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-[150px] space-y-6">
                                {/* Quick Info */}
                                <div className="rounded-2xl border border-border bg-muted p-6">
                                    <h3 className="text-base font-manrope font-bold text-foreground mb-5">Course Details</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Clock, label: "Duration", value: course.duration },
                                            { icon: BarChart3, label: "Level", value: course.level },
                                            ...(course.students && course.students > 0
                                                ? [{ icon: Users, label: "Learners", value: `${course.students}+ enrolled` }]
                                                : []),
                                            { icon: Award, label: "Certificate", value: "ISO Verified" },
                                            { icon: Globe, label: "Language", value: "English" },
                                            { icon: MessageCircle, label: "Support", value: "24/7 Slack + Email" },
                                        ].map((row, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <row.icon className="w-4 h-4 text-blue-600 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{row.label}</p>
                                                    <p className="text-sm font-medium text-foreground">{row.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Enroll Card */}
                                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="text-base font-manrope font-bold text-foreground mb-2">Ready to advance your career?</h3>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                                        Join {course.students || 0}+ professionals who have grown their careers with this program.
                                    </p>
                                    <ul className="space-y-2 mb-5">
                                        {[
                                            "ISO Verified Certification",
                                            "Hands-on Cloud Lab Access",
                                            "Industry Expert Mentorship",
                                            "Placement Assistance",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-foreground/90">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <EnrollCTA full />
                                </div>
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
