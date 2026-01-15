"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    ArrowLeft,
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    ExternalLink,
    AlertTriangle,
    GraduationCap,
    MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TrustedPartners from "@/components/landing/TrustedPartners";
import SeminarTestimonials from "./SeminarTestimonials";

const seminarTypes = [
    { icon: Video, label: "Technical Seminars", desc: "Deep-dive sessions" },
    { icon: AlertTriangle, label: "Security Briefings", desc: "Threat updates" },
    { icon: Users, label: "Expert Panels", desc: "Industry discussions" },
    { icon: GraduationCap, label: "Training Sessions", desc: "Hands-on learning" },
];

const upcomingSeminars = [
    {
        title: "Adversarial AI: When LLMs Hallucinate Exploits",
        description: "Beyond prompt injection. We analyze how autonomous agents are being weaponized to rewrite malicious code in real-time, and how to architect defense layers that assume AI breach.",
        date: "Feb 12, 2025",
        time: "14:00 EST",
        duration: "90 min",
        speaker: "Dr. Sarah Chen, Lead Researcher",
        type: "Threat Briefing",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
        location: "Encrypted Stream"
    },
    {
        title: "The Death of Trust: Zero-Knowledge Architectures",
        description: "Moving beyond 'Zero Trust' marketing to mathematical certainty. Implementing ZK-proofs for identity verification in decentralized corporate networks.",
        date: "Feb 19, 2025",
        time: "11:00 EST",
        duration: "120 min",
        speaker: "Michael Torres, Principal Architect",
        type: "Technical Workshop",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
        location: "Presidency University, Lab 4"
    },
    {
        title: "Sub-Atomic Red Teaming: Firmware & Hardware Attacks",
        description: "Software patches don't fix silicon flaws. A deep dive into side-channel attacks, voltage glitching, and supply chain interdiction detection.",
        date: "Feb 26, 2025",
        time: "10:00 EST",
        duration: "3 hrs",
        speaker: "The ZecurX Offensive Team",
        type: "Deep Dive",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        location: "MSRIT Cyber Range"
    }
];

export default function SeminarsPage() {
    return (
        <>
            <section className="relative w-full min-h-[90vh] bg-background overflow-hidden flex flex-col items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
                        alt="Cybersecurity Operations Center"
                        fill
                        className="object-cover opacity-20 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_90%)]" />
                    
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                </div>



                <div className="max-w-5xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >


                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9]">
                            Forging Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-muted-foreground to-transparent">
                                Resilience.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-12">
                            Elite briefings for the modern defender. Deconstructing active threats and rebuilding security postures from first principles.
                        </p>

                        <div className="w-full max-w-lg p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl">
                            <div className="rounded-[1.4rem] bg-background/80 border border-white/5 p-2 pr-2 sm:pr-2 flex flex-col sm:flex-row items-center gap-4">
                                <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-muted/50 items-center justify-center border border-white/5 shrink-0">
                                    <Video className="w-6 h-6 text-foreground" />
                                </div>
                                
                                <div className="flex-1 text-center sm:text-left py-2 sm:py-0">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Next Session</div>
                                    <div className="text-sm font-bold text-foreground">Adversarial AI Defense</div>
                                    <div className="text-xs text-muted-foreground">Feb 12 • 14:00 EST</div>
                                </div>

                                <Link href="/book-seminar" className="w-full sm:w-auto">
                                    <Button className="w-full h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg shadow-foreground/5 transition-all">
                                        Book Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <TrustedPartners />

            <SeminarTestimonials />

            <section className="relative w-full py-24 bg-background text-foreground border-t border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming <span className="text-muted-foreground">Events</span></h2>
                            <p className="text-muted-foreground max-w-lg text-lg font-light">Register for our scheduled workshops, webinars, and offline seminars.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {upcomingSeminars.map((seminar, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row items-stretch shadow-sm hover:shadow-md"
                            >
                                <div className="hidden md:flex w-32 shrink-0 flex-col items-center justify-center border-r border-border bg-muted/20 p-6 text-center group-hover:bg-muted/40 transition-colors">
                                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{seminar.date.split(' ')[0]}</span>
                                    <span className="text-3xl font-bold text-foreground my-1">{seminar.date.split(' ')[1].replace(',', '')}</span>
                                    <span className="text-xs text-muted-foreground">{seminar.time}</span>
                                </div>

                                <div className="relative h-48 md:hidden w-full">
                                    <Image
                                        src={seminar.image}
                                        alt={seminar.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {seminar.date} • {seminar.time}
                                    </div>
                                </div>

                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                                            {seminar.type}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" /> {seminar.duration}
                                        </span>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                        {seminar.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">
                                        {seminar.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                <Users className="w-3 h-3 text-foreground" />
                                            </div>
                                            <span className="text-foreground font-medium">{seminar.speaker.split(',')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            {seminar.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex w-48 shrink-0 flex-col items-center justify-center border-l border-border bg-muted/5 p-6 group-hover:bg-muted/20 transition-colors">
                                    <Link href="/book-seminar" className="w-full">
                                        <Button className="w-full rounded-full shadow-sm hover:shadow-md transition-all">
                                            Register Now
                                        </Button>
                                    </Link>
                                </div>

                                <div className="p-6 pt-0 md:hidden">
                                    <Link href="/book-seminar" className="w-full">
                                        <Button className="w-full rounded-full">
                                            Register Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
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
