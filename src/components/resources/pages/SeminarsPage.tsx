"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Users,
    MapPin,
    Loader2,
    Calendar,
    ArrowRight,
    Terminal,
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

// ─── Description Toggle ────────────────────────────────────
function DescriptionToggle({ description }: { description: string }) {
    const [open, setOpen] = useState(false);

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
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line pl-5 border-l-2 border-border">
                            {description}
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
        <Card className={`group bg-card border-border hover:border-foreground/20 transition-all duration-300 ${past && !showCertificate ? "opacity-50" : ""}`}>
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Date Block */}
                    <div className="flex md:flex-col items-center justify-center gap-2 md:gap-0 px-6 py-4 md:py-6 md:w-28 shrink-0 md:border-r border-b md:border-b-0 border-border bg-muted/30">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{dateInfo.weekday}</span>
                        <span className="text-2xl font-manrope font-semibold text-foreground leading-none">{dateInfo.day}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{dateInfo.month}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 p-5 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                {/* Type + Duration */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                                        {seminar.seminar_type || "Workshop"}
                                    </span>
                                    <span className="text-muted-foreground/30">·</span>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{seminar.duration}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg md:text-xl font-manrope font-medium text-foreground leading-tight mb-3">
                                    {seminar.title}
                                </h3>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" />
                                        {seminar.speaker_name}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {seminar.organization_name}
                                    </span>
                                    {seminar.location_type === "onsite" && seminar.venue_address && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {seminar.venue_address}
                                        </span>
                                    )}
                                </div>

                                {/* Expandable Description */}
                                {seminar.description && (
                                    <DescriptionToggle description={seminar.description} />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 shrink-0 lg:pt-1">
                                {showRegister && (
                                    <Button
                                        asChild
                                        className="h-10 px-6 rounded-full bg-foreground text-background font-medium text-sm hover:scale-[1.02] transition-transform"
                                    >
                                        <Link href={`/seminars/${seminar.id}/register`}>
                                            Register
                                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                        </Link>
                                    </Button>
                                )}
                                {showCertificate && (
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-10 px-5 rounded-full border border-border/50 hover:border-foreground/20 text-muted-foreground hover:text-foreground font-medium text-sm"
                                    >
                                        <Link href={`/seminars/${seminar.id}/certificate`}>
                                            <Award className="w-3.5 h-3.5 mr-1.5" />
                                            Certificate
                                        </Link>
                                    </Button>
                                )}
                                {past && !showCertificate && (
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
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
        <>
            {/* ════════════════════════════════════════════════════════ */}
            {/* HERO                                                    */}
            {/* ════════════════════════════════════════════════════════ */}
            <section className="relative w-full py-32 lg:py-40 bg-background text-foreground overflow-hidden">
                {/* Background ambience — matching WhyZecurXSection */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] dark:bg-primary/15" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] dark:bg-blue-900/15" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <ScrollAnimation direction="up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left — Copy */}
                            <div>
                                <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-6 block">
                                    Academy & Workshops
                                </span>
                                <h1 className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.05] mb-8">
                                    Learn{" "}
                                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                                        Cybersecurity
                                    </span>
                                    <br />
                                    from Practitioners.
                                </h1>
                                <p className="text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-lg mb-10">
                                    Expert-led workshops on offensive security, cloud defense, and AI threats.
                                    Hands-on labs. Real-world scenarios. Certificates on completion.
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button
                                        asChild
                                        className="h-12 px-8 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform"
                                    >
                                        <a href="#schedule">
                                            View Schedule
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-12 px-6 rounded-full border border-border/50 hover:border-foreground/20 text-muted-foreground hover:text-foreground font-medium"
                                    >
                                        <Link href="/contact">
                                            Request Private Session
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Right — Next Session Card (or stat card) */}
                            <div>
                                {nextSession ? (
                                    <Card className="bg-card/50 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden">
                                        {/* Grid texture */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                                        <CardContent className="p-8 md:p-10 relative z-10">
                                            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-6">Next Session</div>

                                            <h3 className="text-2xl md:text-3xl font-manrope font-medium text-foreground leading-tight mb-4">
                                                {nextSession.title}
                                            </h3>

                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <Calendar className="w-4 h-4 shrink-0" />
                                                    <span className="font-manrope">{formatDate(nextSession.date).full}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <Users className="w-4 h-4 shrink-0" />
                                                    <span className="font-manrope">{nextSession.speaker_name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <Building2 className="w-4 h-4 shrink-0" />
                                                    <span className="font-manrope">{nextSession.organization_name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <Clock className="w-4 h-4 shrink-0" />
                                                    <span className="font-manrope">{nextSession.duration}</span>
                                                </div>
                                            </div>

                                            {nextSession.registration_enabled && (
                                                <Button
                                                    asChild
                                                    className="h-12 px-8 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform w-full sm:w-auto"
                                                >
                                                    <Link href={`/seminars/${nextSession.id}/register`}>
                                                        Register Now
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    /* Stats card when no upcoming session */
                                    <Card className="bg-muted/50 border-border rounded-3xl overflow-hidden">
                                        <CardContent className="p-10 md:p-14 space-y-10">
                                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Track Record</div>
                                            {[
                                                { value: "12+", label: "Institutions Trained" },
                                                { value: "1,200+", label: "Students Certified" },
                                                { value: "8+", label: "Seminar Types" },
                                            ].map((stat, i) => (
                                                <div key={i}>
                                                    <div className="text-4xl md:text-5xl font-manrope font-light text-foreground mb-1">{stat.value}</div>
                                                    <div className="text-sm text-muted-foreground font-manrope">{stat.label}</div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════ */}
            {/* TRUSTED PARTNERS                                        */}
            {/* ════════════════════════════════════════════════════════ */}
            <TrustedPartners />

            {/* ════════════════════════════════════════════════════════ */}
            {/* TESTIMONIALS                                            */}
            {/* ════════════════════════════════════════════════════════ */}
            <SeminarTestimonials />

            {/* ════════════════════════════════════════════════════════ */}
            {/* SESSION SCHEDULE                                        */}
            {/* ════════════════════════════════════════════════════════ */}
            <section id="schedule" className="relative w-full py-24 bg-background text-foreground overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <ScrollAnimation direction="up">
                        <div className="mb-16">
                            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                                Schedule
                            </span>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-4">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                                            All Sessions
                                        </span>
                                    </h2>
                                    <p className="text-muted-foreground max-w-xl text-lg font-manrope font-light">
                                        Browse upcoming workshops and past sessions. Register or claim your certificate.
                                    </p>
                                </div>
                                {!loading && allSorted.length > 0 && (
                                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                                        {allSorted.length} Sessions · {upcoming.length} Upcoming
                                    </span>
                                )}
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Session List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardContent className="p-8 text-center">
                                <p className="text-red-400 text-sm font-mono">{error}</p>
                            </CardContent>
                        </Card>
                    ) : seminars.length === 0 ? (
                        <Card className="border-dashed border-border bg-muted/30">
                            <CardContent className="p-16 text-center">
                                <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-4" />
                                <p className="text-muted-foreground font-manrope">No sessions scheduled yet. Check back soon.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <ScrollAnimation direction="up" delay={0.15}>
                            <div className="space-y-3">
                                {allSorted.map((seminar) => (
                                    <SeminarRow key={seminar.id} seminar={seminar} />
                                ))}
                            </div>
                        </ScrollAnimation>
                    )}
                </div>
            </section>
        </>
    );
}
