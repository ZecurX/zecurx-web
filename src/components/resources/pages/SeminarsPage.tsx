"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Users,
    MapPin,
    Loader2,
    Calendar,
    ArrowRight,
    ArrowLeft,
    ChevronDown,
    Building2,
    Award,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import Link from "next/link";
import TrustedPartners from "@/components/landing/TrustedPartners";
import SeminarTestimonials from "./SeminarTestimonials";
import { PublicSeminar } from "@/types/seminar";

import { BlurFade } from "@/components/ui/blur-fade";

// ─── Utility ───────────────────────────────────────────────
function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const ist = { timeZone: "Asia/Kolkata" } as const;
    return {
        month: date.toLocaleDateString("en-US", { month: "short", ...ist }).toUpperCase(),
        day: date.toLocaleDateString("en-US", { day: "numeric", ...ist }),
        weekday: date.toLocaleDateString("en-US", { weekday: "short", ...ist }),
        full: date.toLocaleDateString("en-US", { dateStyle: "medium", ...ist }),
    };
}

function isPast(dateStr: string) {
    return new Date(dateStr) < new Date();
}

const FILLER_RE = /\b(maybe not if|maybe|probably|i think|we think|we want to|we want|we will have|we need to|we need|we are going to|we're going to|we plan to)\b/gi;
const PARENS_RE = /\(.*?\)/g;
const BULLET_RE = /(?:^|\n)\s*[-–—•*]\s*/g;

function extractTopics(raw: string): string[] {
    const text = raw.replace(PARENS_RE, " ").replace(FILLER_RE, " ");

    const fragments = text
        .split(/[\n\r]+|[;]|,\s*(?=[A-Z])|,\s*-\s*/g)
        .flatMap((s) => s.split(BULLET_RE))
        .map((s) =>
            s.replace(/^[-–—•*:]+\s*/, "")
                .replace(/[,;:]+$/, "")
                .replace(/\s{2,}/g, " ")
                .trim()
        )
        .filter((s) => s.length > 3);

    const seen = new Set<string>();
    const topics: string[] = [];

    for (const frag of fragments) {
        const lower = frag.toLowerCase();
        if (seen.has(lower)) continue;

        const isSubset = topics.some(
            (t) => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase())
        );
        if (isSubset) continue;

        seen.add(lower);
        topics.push(frag);
    }

    return topics;
}

function summarizeDescription(raw: string, title: string, seminarType: string | null): string {
    const topics = extractTopics(raw);
    if (topics.length === 0) return raw.trim();

    const type = (seminarType || "session").toLowerCase();

    if (topics.length === 1) {
        return `This ${type} on ${title} covers ${topics[0].toLowerCase()}.`;
    }

    if (topics.length === 2) {
        return `This ${type} on ${title} covers ${topics[0].toLowerCase()} and ${topics[1].toLowerCase()}.`;
    }

    const leading = topics.slice(0, -1).map((t) => t.toLowerCase()).join(", ");
    const last = topics[topics.length - 1].toLowerCase();
    return `This ${type} on ${title} covers ${leading}, and ${last}.`;
}

function DescriptionToggle({ description, title, seminarType }: { description: string; title: string; seminarType: string | null }) {
    const [open, setOpen] = useState(false);
    const summary = useMemo(() => summarizeDescription(description, title, seminarType), [description, title, seminarType]);

    return (
        <div className="mt-4">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
                className="flex items-center gap-1.5 text-xs font-manrope font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                <span>{open ? "Hide details" : "About this session"}</span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl pl-5 border-l-2 border-border">
                            {summary}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Seminar Row ───────────────────────────────────────────
function SeminarRow({ seminar }: { seminar: PublicSeminar }) {
    const dateInfo = formatDate(seminar.date);
    const past = isPast(seminar.date);
    const showRegister = seminar.registration_enabled && !past;
    const showCertificate = seminar.certificate_enabled;

    return (
        <div className={`group glass-card relative rounded-3xl p-1.5 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] bg-white/50 hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden ${past && !showCertificate ? "opacity-60" : ""}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row">
                {/* Date Block */}
                <div className="flex md:flex-col items-center justify-center gap-2 md:gap-1 px-6 py-6 md:w-32 shrink-0 md:border-r border-b md:border-b-0 border-slate-100 bg-[#f8fbff]/50 rounded-2xl md:rounded-r-none m-1.5">
                    <span className="text-[11px] font-space-grotesk text-[#4c69e4] uppercase tracking-widest font-semibold">{dateInfo.weekday}</span>
                    <span className="text-3xl font-manrope font-bold text-[#0c1a2e] leading-none">{dateInfo.day}</span>
                    <span className="text-[11px] font-space-grotesk text-slate-500 uppercase tracking-widest font-medium">{dateInfo.month}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            {/* Type + Duration */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[11px] font-space-grotesk font-semibold tracking-widest text-[#4c69e4] uppercase bg-blue-50 px-3 py-1 rounded-full">
                                    {seminar.seminar_type || "Workshop"}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-[12px] font-inter text-slate-500 font-medium">{seminar.duration}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-manrope font-bold text-[#0c1a2e] leading-tight mb-4 group-hover:text-[#4c69e4] transition-colors">
                                {seminar.title}
                            </h3>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-slate-600 font-inter">
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#4c69e4]" />
                                    {seminar.speaker_name}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#4c69e4]" />
                                    {seminar.organization_name}
                                </span>
                                {seminar.location_type === "onsite" && seminar.venue_address && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#4c69e4]" />
                                        {seminar.venue_address}
                                    </span>
                                )}
                            </div>

                            {/* Expandable Description */}
                            {seminar.description && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <DescriptionToggle description={seminar.description} title={seminar.title} seminarType={seminar.seminar_type} />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0 lg:pt-1 min-w-[160px]">
                            {showRegister && (
                                <Link 
                                    href={`/seminars/${seminar.id}/register`}
                                    className="w-full relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-6 py-3 text-sm font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-2px] hover:shadow-[0px_4px_0px_0px_#92c4fd] active:translate-y-[0px] active:shadow-none transition-all duration-200"
                                >
                                    Register Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                            {showCertificate && (
                                <Link 
                                    href={`/seminars/${seminar.id}/certificate`}
                                    className="w-full relative inline-flex items-center justify-center gap-2 bg-white text-[#0c1a2e] rounded-full px-6 py-3 text-sm font-semibold font-inter cursor-pointer border border-slate-200 hover:border-[#4c69e4] hover:text-[#4c69e4] hover:bg-[#f8fbff] transition-all duration-200 shadow-sm"
                                >
                                    <Award className="w-4 h-4" />
                                    Certificate
                                </Link>
                            )}
                            {past && !showCertificate && (
                                <span className="flex items-center justify-center gap-1.5 text-[13px] text-slate-500 font-inter font-medium py-2 px-4 bg-slate-50 rounded-full border border-slate-100">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────
export default function SeminarsPage() {
    const [seminars, setSeminars] = useState<PublicSeminar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSeminars() {
            try {
                const response = await fetch("/api/seminars?all=true");
                const data = await response.json();
                if (data.success) {
                    setSeminars(data.seminars);
                } else {
                    setError("Failed to load seminars");
                }
            } catch {
                setError("Failed to load seminars");
            } finally {
                setLoading(false);
            }
        }
        fetchSeminars();
    }, []);

    const upcoming = seminars.filter((s) => !isPast(s.date));
    const past_ = seminars.filter((s) => isPast(s.date)).reverse();
    const nextSession = upcoming.length > 0 ? upcoming[0] : null;
    const allSorted = [...upcoming, ...past_];

    return (
        <div className="bg-[#f8fbff] min-h-screen relative overflow-hidden">
            {/* ════════════════════════════════════════════════════════ */}
            {/* HERO                                                    */}
            {/* ════════════════════════════════════════════════════════ */}
            <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
                    <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <BlurFade delay={0.1}>
                        <div className="mb-8">
                            <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4c69e4] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-inter font-medium tracking-wide">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to Resources</span>
                            </Link>
                        </div>
                    </BlurFade>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Copy */}
                        <div>
                            <BlurFade delay={0.2}>
                                <div className="flex mb-4">
                                    <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                                        ACADEMY & WORKSHOPS
                                    </span>
                                </div>
                            </BlurFade>
                            
                            <BlurFade delay={0.3}>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
                                    Learn <span className="text-[#4c69e4]">Cybersecurity</span>
                                    <br className="hidden md:block" />
                                    from Practitioners.
                                </h1>
                            </BlurFade>
                            
                            <BlurFade delay={0.4}>
                                <p className="text-lg text-slate-600 font-inter mb-10 max-w-lg leading-relaxed">
                                    Expert-led workshops on offensive security, cloud defense, and AI threats.
                                    Hands-on labs. Real-world scenarios. Certificates on completion.
                                </p>
                            </BlurFade>
                            
                            <BlurFade delay={0.5}>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link 
                                        href="/book-seminar"
                                        className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                                    >
                                        Book Seminar
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <a 
                                        href="#schedule"
                                        className="inline-flex items-center justify-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                                    >
                                        View Schedule
                                    </a>
                                </div>
                            </BlurFade>
                        </div>

                        {/* Right — Next Session Card (or stat card) */}
                        <BlurFade delay={0.4}>
                            <div className="relative">
                                {loading ? (
                                    <div className="glass-card h-full min-h-[400px] bg-white/40 border border-slate-200/60 rounded-3xl flex items-center justify-center shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#4c69e4]" />
                                    </div>
                                ) : nextSession ? (
                                    <div className="glass-card bg-white border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.08)] rounded-3xl overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full pointer-events-none" />
                                        
                                        <div className="p-8 md:p-10 relative z-10">
                                            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#4c69e4] px-3 py-1.5 rounded-full text-[11px] font-space-grotesk font-semibold uppercase tracking-widest mb-6">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#4c69e4] animate-pulse" />
                                                Next Session
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-manrope font-bold text-[#0c1a2e] leading-tight mb-6">
                                                {nextSession.title}
                                            </h3>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3 text-slate-600 font-inter">
                                                    <div className="w-8 h-8 rounded-full bg-[#f8fbff] flex items-center justify-center text-[#4c69e4]">
                                                        <Calendar className="w-4 h-4 shrink-0" />
                                                    </div>
                                                    <span className="font-medium text-[15px]">{formatDate(nextSession.date).full}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600 font-inter">
                                                    <div className="w-8 h-8 rounded-full bg-[#f8fbff] flex items-center justify-center text-[#4c69e4]">
                                                        <Users className="w-4 h-4 shrink-0" />
                                                    </div>
                                                    <span className="text-[15px]">{nextSession.speaker_name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600 font-inter">
                                                    <div className="w-8 h-8 rounded-full bg-[#f8fbff] flex items-center justify-center text-[#4c69e4]">
                                                        <Building2 className="w-4 h-4 shrink-0" />
                                                    </div>
                                                    <span className="text-[15px]">{nextSession.organization_name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600 font-inter">
                                                    <div className="w-8 h-8 rounded-full bg-[#f8fbff] flex items-center justify-center text-[#4c69e4]">
                                                        <Clock className="w-4 h-4 shrink-0" />
                                                    </div>
                                                    <span className="text-[15px]">{nextSession.duration}</span>
                                                </div>
                                            </div>

                                            {nextSession.registration_enabled && (
                                                <Link 
                                                    href={`/seminars/${nextSession.id}/register`}
                                                    className="w-full relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-xl px-6 py-3.5 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-2px] hover:shadow-[0px_4px_0px_0px_#92c4fd] active:translate-y-[0px] active:shadow-none transition-all duration-200"
                                                >
                                                    Register Now
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Stats card when no upcoming session */
                                    <div className="glass-card bg-white/60 border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
                                        <div className="p-10 md:p-12 space-y-8">
                                            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[11px] font-space-grotesk font-semibold uppercase tracking-widest mb-2">
                                                Track Record
                                            </div>
                                            <div className="grid gap-8">
                                                {[
                                                    { value: "12+", label: "Institutions Trained" },
                                                    { value: "1,200+", label: "Students Certified" },
                                                    { value: "8+", label: "Seminar Types" },
                                                ].map((stat, i) => (
                                                    <div key={i} className="flex items-center gap-6">
                                                        <div className="text-4xl md:text-5xl font-manrope font-bold text-[#0c1a2e] w-24">{stat.value}</div>
                                                        <div className="text-[15px] text-slate-500 font-inter font-medium">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════ */}
            {/* TRUSTED PARTNERS                                        */}
            {/* ════════════════════════════════════════════════════════ */}
            <div className="bg-white py-12 border-y border-slate-100">
                <TrustedPartners />
            </div>

            {/* ════════════════════════════════════════════════════════ */}
            {/* TESTIMONIALS                                            */}
            {/* ════════════════════════════════════════════════════════ */}
            <SeminarTestimonials />

            {/* ════════════════════════════════════════════════════════ */}
            {/* SESSION SCHEDULE                                        */}
            {/* ════════════════════════════════════════════════════════ */}
            <section id="schedule" className="relative w-full py-24 bg-[#f8fbff] relative z-10">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <BlurFade delay={0.2}>
                        <div className="mb-12">
                            <div className="flex mb-4">
                                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                                    SCHEDULE
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-4">
                                        All <span className="text-[#4c69e4]">Sessions</span>
                                    </h2>
                                    <p className="text-slate-600 max-w-xl text-lg font-inter">
                                        Browse upcoming workshops and past sessions. Register or claim your certificate.
                                    </p>
                                </div>
                                {!loading && allSorted.length > 0 && (
                                    <span className="text-[13px] font-inter font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm shrink-0">
                                        <strong className="text-[#0c1a2e]">{allSorted.length}</strong> Sessions · <strong className="text-[#4c69e4]">{upcoming.length}</strong> Upcoming
                                    </span>
                                )}
                            </div>
                        </div>
                    </BlurFade>

                    {/* Session List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="w-8 h-8 animate-spin text-[#4c69e4]" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
                            <p className="text-red-500 text-[15px] font-inter">{error}</p>
                        </div>
                    ) : seminars.length === 0 ? (
                        <div className="glass-card bg-white/50 border border-slate-200/60 rounded-3xl p-16 text-center shadow-[0_18px_44px_rgba(30,58,95,0.03)]">
                            <div className="w-16 h-16 rounded-full bg-[#f8fbff] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                <Calendar className="w-6 h-6 text-[#4c69e4]" />
                            </div>
                            <h3 className="text-xl font-manrope font-bold text-[#0c1a2e] mb-2">No sessions scheduled</h3>
                            <p className="text-slate-500 font-inter">Check back soon for upcoming workshops and seminars.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {allSorted.map((seminar, i) => (
                                <BlurFade key={seminar.id} delay={0.2 + (i * 0.1)}>
                                    <SeminarRow seminar={seminar} />
                                </BlurFade>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
