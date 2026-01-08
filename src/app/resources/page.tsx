"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import {
    ArrowUpRight, BookOpen, FileText, Lightbulb, Shield, Video,
    TrendingUp, Search, Cloud, Scale, Bot, AlertTriangle, Building2,
    FileCode, Users, Briefcase, GraduationCap, Calendar, Play, ArrowRight
} from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardTagline
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

const featuredResources = [
    {
        type: "Blog",
        icon: BookOpen,
        title: "ZecurX Blog",
        shortDesc: "Latest insights",
        description: "Stay ahead of the curve with expert analysis on the dynamic cybersecurity landscape. Our engineers break down the latest threat vectors.",
        href: "/resources/blog",
    },
    {
        type: "Whitepapers",
        icon: FileText,
        title: "Whitepapers",
        shortDesc: "Deep-dive reports",
        description: "Deep-dive technical documents and strategic reports that provide comprehensive insights into complex security challenges.",
        href: "/resources/whitepapers",
    },
    {
        type: "Research",
        icon: Lightbulb,
        title: "Research & Insights",
        shortDesc: "Threat intelligence",
        description: "Data-driven reports and proprietary threat intelligence findings that reveal the current state of the cyber landscape.",
        href: "/resources/research",
    },
    {
        type: "Guides",
        icon: Shield,
        title: "Security Guides",
        shortDesc: "Best practices",
        description: "Practical, step-by-step playbooks designed to help IT teams and security leaders implement best practices.",
        href: "/resources/guides",
    },
    {
        type: "Webinars",
        icon: Video,
        title: "Webinars",
        shortDesc: "Expert sessions",
        description: "On-demand and live sessions featuring industry veterans discussing real-world case studies and regulatory updates.",
        href: "/resources/webinars",
    },
];

const blogTopics = [
    { icon: TrendingUp, label: "Threat Intelligence & Cyber Trends" },
    { icon: Search, label: "Ethical Hacking & Penetration Testing" },
    { icon: Cloud, label: "Cloud & Application Security" },
    { icon: Scale, label: "Governance, Risk & Compliance" },
    { icon: Bot, label: "AI and Automation in Cybersecurity" },
];

export default function ResourcesPage() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            <CreativeNavBar />

            {/* Hero Header */}
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">

                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Expert <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Knowledge.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-2xl mx-auto">
                            Stay informed with expert insights, technical research, real-world case studies, and education from ZecurX professionals.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Resources Grid */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            RESOURCES
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {featuredResources.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                            >
                                <Link
                                    href={item.href}
                                >
                                    <Card className="h-full flex flex-col hover:bg-muted/60 transition-colors border-border/40">
                                        <CardHeader className="pb-4">
                                            <CardTagline className="mb-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
                                                {item.type}
                                            </CardTagline>
                                            <CardTitle className="text-2xl font-manrope font-medium text-foreground">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-8 text-base font-light leading-relaxed line-clamp-4">
                                                {item.description}
                                            </CardDescription>
                                        </CardContent>

                                        <CardFooter className="justify-between mt-auto pt-4 border-t border-border/10">
                                            <span className="text-[11px] font-semibold text-muted-foreground/60 font-manrope uppercase tracking-widest group-hover:text-foreground/80 transition-colors">
                                                LEARN MORE
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Blog Topics */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-manrope font-medium text-foreground mb-4">
                            Explore Topics
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogTopics.map((topic, i) => (
                            <Card key={i} className="flex flex-col items-start gap-4 p-6 bg-card/40 hover:bg-card/60 transition-colors border-border/30 h-full">
                                <div className="p-2 -ml-2 rounded-lg text-muted-foreground/80 group-hover:text-primary transition-colors">
                                    <topic.icon className="w-5 h-5" />
                                </div>
                                <span className="font-manrope font-medium text-foreground text-sm tracking-wide">{topic.label}</span>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-2">
                            Ready to dive deeper?
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            browse our knowledge base for answers to common questions.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-full h-12 px-8">
                            Knowledge Base
                        </Button>
                        <Button className="rounded-full h-12 px-8 gap-2">
                            Subscribe to Updates
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
