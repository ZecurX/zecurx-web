"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    ExternalLink,
    AlertTriangle,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Webinar Categories
const webinarTypes = [
    { icon: Video, label: "Technical Webinars", desc: "Deep-dive sessions" },
    { icon: AlertTriangle, label: "Security Briefings", desc: "Threat updates" },
    { icon: Users, label: "Expert Panels", desc: "Industry discussions" },
    { icon: GraduationCap, label: "Training Sessions", desc: "Hands-on learning" },
];

// Upcoming Webinars
const upcomingWebinars = [
    {
        title: "Advanced Threat Hunting Techniques",
        description: "Learn proactive techniques for identifying advanced persistent threats in enterprise environments.",
        date: "Jan 15, 2025",
        time: "2:00 PM EST",
        duration: "60 min",
        speaker: "Dr. Sarah Chen, Threat Intelligence Lead",
        type: "Technical Webinar"
    },
    {
        title: "Zero Trust Implementation Workshop",
        description: "Hands-on session covering practical steps for implementing zero trust architecture.",
        date: "Jan 22, 2025",
        time: "11:00 AM EST",
        duration: "90 min",
        speaker: "Michael Torres, Security Architect",
        type: "Training Session"
    },
];

// On-Demand Webinars
const onDemandWebinars = [
    {
        title: "2024 Threat Landscape Review",
        description: "Annual review of major cyber threats and attack trends observed throughout 2024.",
        duration: "45 min",
        views: "2.4k",
        type: "Security Briefing"
    },
    {
        title: "Cloud Security Best Practices Panel",
        description: "Industry experts discuss securing multi-cloud environments and common pitfalls.",
        duration: "60 min",
        views: "1.8k",
        type: "Expert Panel"
    },
    {
        title: "Incident Response Fundamentals",
        description: "Essential knowledge for building and executing effective incident response plans.",
        duration: "55 min",
        views: "3.1k",
        type: "Technical Webinar"
    },
    {
        title: "API Security Deep Dive",
        description: "Technical session on securing APIs against common attack vectors.",
        duration: "50 min",
        views: "1.5k",
        type: "Technical Webinar"
    },
];

export default function WebinarsPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full min-h-[40vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Resources</span>
                        </Link>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Events &<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-cyan-300">Webinars</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-3xl mx-auto">
                            On-demand and live sessions featuring industry veterans discussing real-world case studies, regulatory updates, and demonstrations of next-gen security technologies.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Webinar Types */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {webinarTypes.map((type, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-5 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-4 group-hover:border-foreground/30 transition-colors">
                                    <type.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{type.label}</h4>
                                <p className="text-sm text-muted-foreground">{type.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upcoming Webinars */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-manrope font-semibold text-foreground mb-8">Upcoming Events</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {upcomingWebinars.map((webinar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative overflow-hidden rounded-2xl bg-muted/50 border border-border p-6"
                                >
                                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-foreground/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="relative z-10">
                                        <span className="px-2 py-0.5 text-xs bg-foreground/10 text-foreground/80 rounded mb-4 inline-block">
                                            {webinar.type}
                                        </span>

                                        <h3 className="text-xl font-manrope font-semibold text-foreground mb-2">
                                            {webinar.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-4">
                                            {webinar.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {webinar.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {webinar.time}
                                            </span>
                                            <span>{webinar.duration}</span>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-6">
                                            <Users className="w-4 h-4 inline mr-1" />
                                            {webinar.speaker}
                                        </p>

                                        <Button className="rounded-full gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Register Now
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* On-Demand */}
                    <div>
                        <h2 className="text-2xl font-manrope font-semibold text-foreground mb-8">On-Demand Library</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {onDemandWebinars.map((webinar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                                        <Play className="w-5 h-5 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-muted-foreground">{webinar.type}</span>
                                        <h4 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors truncate">
                                            {webinar.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                            <span>{webinar.duration}</span>
                                            <span>{webinar.views} views</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
