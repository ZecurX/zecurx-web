"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Video,
    Clock,
    Users,
    MapPin,
    Award,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TrustedPartners from "@/components/landing/TrustedPartners";
import SeminarTestimonials from "./SeminarTestimonials";
import { PublicSeminar } from "@/types/seminar";



export default function SeminarsPage() {
    const [seminars, setSeminars] = useState<PublicSeminar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSeminars() {
            try {
                const response = await fetch('/api/seminars?all=true');
                const data = await response.json();
                if (data.success) {
                    setSeminars(data.seminars);
                } else {
                    setError('Failed to load seminars');
                }
            } catch {
                setError('Failed to load seminars');
            } finally {
                setLoading(false);
            }
        }
        fetchSeminars();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const ist = { timeZone: 'Asia/Kolkata' } as const;
        return {
            month: date.toLocaleDateString('en-US', { month: 'short', ...ist }).toUpperCase(),
            day: date.toLocaleDateString('en-US', { day: 'numeric', ...ist }),
            full: date.toLocaleDateString('en-US', { dateStyle: 'medium', ...ist }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', ...ist }) + ' IST',
        };
    };

    const isPastSeminar = (dateStr: string) => {
        return new Date(dateStr) < new Date();
    };

    const upcomingSeminars = seminars.filter(s => !isPastSeminar(s.date));
    const pastSeminars = seminars.filter(s => isPastSeminar(s.date)).reverse(); // Most recent past first

    const upcomingSeminar = upcomingSeminars.length > 0 ? upcomingSeminars[0] : null;

    const displaySeminars = [...upcomingSeminars, ...pastSeminars];

    return (
        <>
            <section className="relative w-full min-h-[90vh] bg-background overflow-hidden flex flex-col items-center justify-center pt-32 pb-24 border-b border-white/[0.08]">
                <div className="absolute inset-0 z-0 select-none opacity-30 dark:opacity-20 mix-blend-luminosity">
                    <Image
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2670&auto=format&fit=crop"
                        alt="University students walking in hall"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-background/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
                </div>

                <div className="absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >

                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground">
                            Shape the Future of <br />
                            <span className="text-muted-foreground">Digital Security.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-12">
                            A collaborative community for students and researchers. <span className="text-foreground font-medium">Learn from experts</span>, master real-world skills, and build a safer digital world.
                        </p>

                        {upcomingSeminar && (
                            <div className="w-full max-w-xl group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/50 to-primary/0 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative rounded-2xl bg-card border border-border p-2">
                                    <div className="rounded-xl bg-muted/40 p-4 flex flex-col sm:flex-row items-center gap-6">
                                        <div className="hidden sm:flex h-16 w-16 rounded-xl bg-background items-center justify-center border border-border shrink-0">
                                            <Video className="w-6 h-6 text-primary" />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left space-y-1">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Upcoming Session</span>
                                            </div>
                                            <div className="text-lg font-bold text-foreground">{upcomingSeminar.title}</div>
                                            <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDate(upcomingSeminar.date).full}</span>
                                            </div>
                                        </div>

                                        <Link href={`/seminars/${upcomingSeminar.id}/register`} className="w-full sm:w-auto shrink-0">
                                            <Button size="lg" className="w-full font-semibold">
                                                Reserve Seat
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </div>
            </section>

            <TrustedPartners />

            <SeminarTestimonials />

            <section className="relative w-full py-24 bg-background text-foreground border-t border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seminars & <span className="text-muted-foreground">Workshops</span></h2>
                            <p className="text-muted-foreground max-w-lg text-lg font-light">Register for upcoming sessions or access certificates for past events.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    ) : seminars.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No upcoming seminars at the moment.</p>
                            <p className="text-muted-foreground/60 mt-2">Check back soon or book a custom seminar for your institution.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {displaySeminars.map((seminar) => {
                                const dateInfo = formatDate(seminar.date);
                                const showRegister = seminar.registration_enabled && !isPastSeminar(seminar.date);
                                const showCertificate = seminar.certificate_enabled;

                                return (
                                    <div
                                        key={seminar.id}
                                        className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row items-stretch shadow-sm hover:shadow-md"
                                    >
                                        {/* Desktop date sidebar */}
                                        <div className="hidden md:flex w-32 shrink-0 flex-col items-center justify-center border-r border-border bg-muted/20 p-6 text-center group-hover:bg-muted/40 transition-colors">
                                            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{dateInfo.month}</span>
                                            <span className="text-3xl font-bold text-foreground my-1">{dateInfo.day}</span>
                                        </div>

                                        {/* Mobile date badge */}
                                        <div className="md:hidden flex items-center gap-4 p-4 pb-0">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted/40 border border-border shrink-0">
                                                <div className="text-center">
                                                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{dateInfo.month}</span>
                                                    <span className="block text-lg font-bold text-foreground leading-none">{dateInfo.day}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs text-muted-foreground">{dateInfo.full}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                                                    {seminar.seminar_type || 'Seminar'}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" /> {seminar.duration}
                                                </span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {seminar.title}
                                            </h3>

                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6 whitespace-pre-line">
                                                {seminar.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <Users className="w-3 h-3 text-foreground" />
                                                    </div>
                                                    <span className="text-foreground font-medium">{seminar.speaker_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-foreground font-medium">{seminar.organization_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <Video className="w-3 h-3 text-muted-foreground" />
                                                    </div>
                                                    {seminar.location_type === 'online' ? 'Online' : seminar.venue_address || 'On-site'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex w-56 shrink-0 flex-col items-center justify-center gap-3 border-l border-border bg-muted/5 p-6 group-hover:bg-muted/20 transition-colors">
                                            {showRegister && (
                                                <Link href={`/seminars/${seminar.id}/register`} className="w-full">
                                                    <Button className="w-full rounded-full shadow-sm hover:shadow-md transition-all">
                                                        Register Now
                                                    </Button>
                                                </Link>
                                            )}
                                            {showCertificate ? (
                                                <Link href={`/seminars/${seminar.id}/certificate`} className="w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-full transition-all"
                                                    >
                                                        <Award className="w-4 h-4 mr-2" />
                                                        Get Certificate
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    disabled
                                                    variant="outline"
                                                    className="w-full rounded-full opacity-50 cursor-not-allowed"
                                                >
                                                    <Award className="w-4 h-4 mr-2" />
                                                    Get Certificate
                                                </Button>
                                            )}
                                        </div>

                                        <div className="p-6 pt-0 md:hidden flex flex-col gap-3">
                                            {showRegister && (
                                                <Link href={`/seminars/${seminar.id}/register`} className="w-full">
                                                    <Button className="w-full rounded-full">
                                                        Register Now
                                                    </Button>
                                                </Link>
                                            )}
                                            {showCertificate ? (
                                                <Link href={`/seminars/${seminar.id}/certificate`} className="w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-full"
                                                    >
                                                        <Award className="w-4 h-4 mr-2" />
                                                        Get Certificate
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    disabled
                                                    variant="outline"
                                                    className="w-full rounded-full opacity-50 cursor-not-allowed"
                                                >
                                                    <Award className="w-4 h-4 mr-2" />
                                                    Get Certificate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-background border-t border-border/40">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-card to-muted/20 border border-border p-12 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                                Ready to Secure Your <span className="text-muted-foreground">Organization?</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-light">
                                Book a custom seminar tailored to your specific threat landscape and compliance requirements.
                            </p>
                            <Link href="/book-seminar">
                                <Button className="h-14 px-10 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Book a Seminar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
