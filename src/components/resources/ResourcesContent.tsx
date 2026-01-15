"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    BookOpen,
    FileText,
    Lightbulb,
    Shield,
    Video,
    HelpCircle,
    ArrowRight,
    TrendingUp,
    Cloud,
    Scale,
    Bot,
    Search,
    AlertTriangle,
    Building2,
    FileCode,
    Users,
    Briefcase,
    GraduationCap,
    Calendar,
    Play,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Resource Categories Data
const blogTopics = [
    { icon: TrendingUp, label: "Threat Intelligence & Cyber Trends" },
    { icon: Search, label: "Ethical Hacking & Penetration Testing" },
    { icon: Cloud, label: "Cloud & Application Security" },
    { icon: Scale, label: "Governance, Risk & Compliance" },
    { icon: Bot, label: "AI and Automation in Cybersecurity" },
];

const researchIncludes = [
    { icon: AlertTriangle, label: "Threat Landscape Analysis" },
    { icon: Search, label: "Vulnerability Research" },
    { icon: Building2, label: "Industry-Specific Security Reports" },
    { icon: FileCode, label: "Technical Whitepapers" },
];

const caseStudyHighlights = [
    { icon: AlertTriangle, label: "Security Challenges Faced" },
    { icon: Shield, label: "Solutions Implemented" },
    { icon: TrendingUp, label: "Measurable Security Outcomes" },
];

const eventFormats = [
    { icon: Video, label: "Technical Seminars", desc: "Deep-dive sessions" },
    { icon: AlertTriangle, label: "Security Briefings", desc: "Threat updates" },
    { icon: Users, label: "Expert Panels", desc: "Industry discussions" },
    { icon: GraduationCap, label: "Training Sessions", desc: "Hands-on learning" },
];

const knowledgeBaseAudience = [
    { icon: Briefcase, label: "Business Leaders" },
    { icon: Building2, label: "IT Teams" },
    { icon: Shield, label: "Security Professionals" },
    { icon: GraduationCap, label: "Students & Learners" },
];

// Featured Resources Data - Matching Homepage Card Style
const featuredResources = [
    {
        type: "Blog",
        icon: BookOpen,
        title: "ZecurX Blog",
        shortDesc: "Latest insights",
        detailedDesc: "Stay ahead of the curve with expert analysis on the dynamic cybersecurity landscape. Our engineers and analysts break down the latest threat vectors, industry trends, and defensive strategies.",
        href: "/resources/blog",
    },
    {
        type: "Whitepapers",
        icon: FileText,
        title: "Whitepapers",
        shortDesc: "Deep-dive reports",
        detailedDesc: "Deep-dive technical documents and strategic reports that provide comprehensive insights into complex security challenges, architecture best practices, and industry compliance.",
        href: "/resources/whitepapers",
    },
    {
        type: "Research",
        icon: Lightbulb,
        title: "Research & Insights",
        shortDesc: "Threat intelligence",
        detailedDesc: "Data-driven reports and proprietary threat intelligence findings that reveal the current state of the cyber landscape and predict future attack methodologies.",
        href: "/resources/research",
    },
    {
        type: "Guides",
        icon: Shield,
        title: "Security Guides",
        shortDesc: "Best practices",
        detailedDesc: "Practical, step-by-step playbooks designed to help IT teams and security leaders implement best practices, harden systems, and prepare for incident response.",
        href: "/resources/guides",
    },
    {
        type: "Seminars",
        icon: Video,
        title: "Seminars",
        shortDesc: "Expert sessions",
        detailedDesc: "On-demand and live sessions featuring industry veterans discussing real-world case studies, regulatory updates, and demonstrations of next-gen security technologies.",
        href: "/resources/seminars",
    },
];

export default function ResourcesContent() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden bg-background text-foreground">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-32">

                {/* SECTION 1: Featured Resources - Grid matching Image 2 style */}
                <div id="featured" className="scroll-mt-24">
                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        {/* Left Column - Title */}
                        <div className="lg:col-span-2 lg:sticky lg:top-32">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                                RESOURCES
                            </span>
                            <h2 className="text-4xl md:text-5xl font-manrope font-medium text-foreground mb-6">
                                Expert Knowledge.
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                                ZecurX delivers cybersecurity knowledge across blogs, research, compliance guides, and professional training.
                            </p>
                        </div>

                        {/* Right Column - Cards Grid (matching Image 2 style) */}
                        <div className="lg:col-span-3 grid md:grid-cols-2 gap-4">
                            {featuredResources.slice(0, 4).map((resource, i) => (
                                <Link key={i} href={resource.href}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative overflow-hidden rounded-2xl bg-muted/30 border border-border p-6 hover:border-border/80 hover:bg-muted/50 transition-all duration-300 cursor-pointer h-full"
                                    >
                                        {/* Icon Circle */}
                                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-6 group-hover:border-foreground/30 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        </div>

                                        <h3 className="text-xl font-manrope font-semibold text-foreground mb-2">
                                            {resource.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {resource.shortDesc}
                                        </p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>


                {/* SECTION 2: Insights & Blog - Matching Homepage Typography */}
                <div id="blog" className="scroll-mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                                Insights & Blog
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-inter">
                            Expert-written articles covering emerging cyber threats, attack techniques, defensive strategies, compliance updates, and best practices for modern security teams.
                        </p>
                    </motion.div>

                    {/* Topics Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {blogTopics.map((topic, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/5 transition-colors">
                                    <topic.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <span className="font-medium text-foreground">{topic.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/resources/blog">
                            <Button className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105 mx-auto">
                                Read Latest Insights
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>


                {/* SECTION 3: Research & Reports */}
                <div id="research" className="scroll-mt-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                                RESEARCH & REPORTS
                            </span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-medium text-foreground mb-6">
                                Research & Industry Reports
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                In-depth cybersecurity research, analytical reports, and threat intelligence documents designed to help organizations understand risks and make informed security decisions.
                            </p>
                            <Link href="/resources/research">
                                <Button className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105">
                                    View Research Reports
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {researchIncludes.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <span className="text-lg font-medium text-foreground">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* SECTION 4: Case Studies - Feature Card Style */}
                <div id="case-studies" className="scroll-mt-24">
                    <div className="relative overflow-hidden rounded-3xl bg-muted/50 border border-border backdrop-blur-xl p-8 md:p-12">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                                    CASE STUDIES
                                </span>
                                <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground mb-6">
                                    Customer Success Stories
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    Real-world examples showcasing how ZecurX helped organizations strengthen security posture, reduce vulnerabilities, and meet compliance requirements.
                                </p>
                                <Button className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105">
                                    Explore Case Studies
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {caseStudyHighlights.map((highlight, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-background/50 backdrop-blur-sm border border-border"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                            <highlight.icon className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <span className="text-lg font-medium text-foreground">{highlight.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* SECTION 5: Events & Seminars */}
                <div id="seminars" className="scroll-mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                                Events & Seminars
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-inter">
                            Live and on-demand sessions hosted by ZecurX experts covering cybersecurity threats, tools, methodologies, and best practices.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {eventFormats.map((format, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-4 group-hover:border-foreground/30 transition-colors">
                                    <format.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{format.label}</h4>
                                <p className="text-sm text-muted-foreground">{format.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <Link href="/resources/seminars">
                            <Button className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105">
                                <Calendar className="w-4 h-4" />
                                Register for Events
                            </Button>
                        </Link>
                        <Link href="/resources/seminars">
                            <Button variant="outline" className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105 border-foreground/10 text-foreground hover:bg-foreground/5">
                                <Play className="w-4 h-4" />
                                Watch On-Demand
                            </Button>
                        </Link>
                    </div>
                </div>


                {/* SECTION 6: Knowledge Base (FAQ) */}
                <div id="knowledge-base" className="scroll-mt-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                                KNOWLEDGE BASE
                            </span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-medium text-foreground mb-6">
                                Knowledge Base & FAQs
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                Quick answers to common questions about ZecurX platforms, services, certifications, security practices, and implementation processes.
                            </p>
                            <Button className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105">
                                Visit Knowledge Base
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Designed For</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {knowledgeBaseAudience.map((audience, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <audience.icon className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <span className="font-medium text-foreground text-sm">{audience.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
