"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Search,
    Cloud,
    Scale,
    Bot,
    ArrowRight,
    ArrowLeft,
    Clock,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Blog Topics
const blogTopics = [
    { icon: TrendingUp, label: "Threat Intelligence & Cyber Trends", count: 24 },
    { icon: Search, label: "Ethical Hacking & Penetration Testing", count: 18 },
    { icon: Cloud, label: "Cloud & Application Security", count: 15 },
    { icon: Scale, label: "Governance, Risk & Compliance", count: 12 },
    { icon: Bot, label: "AI and Automation in Cybersecurity", count: 9 },
];

// Sample Blog Posts (placeholder data)
const blogPosts = [
    {
        title: "Understanding the Latest Ransomware Trends in 2024",
        excerpt: "An in-depth analysis of emerging ransomware tactics and how organizations can prepare their defenses.",
        category: "Threat Intelligence",
        author: "ZecurX Research Team",
        date: "Dec 28, 2024",
        readTime: "8 min read"
    },
    {
        title: "Zero Trust Architecture: Implementation Guide",
        excerpt: "A practical guide to implementing zero trust security principles in enterprise environments.",
        category: "Cloud Security",
        author: "Security Engineering",
        date: "Dec 20, 2024",
        readTime: "12 min read"
    },
    {
        title: "API Security Best Practices for Modern Applications",
        excerpt: "Essential security measures for protecting APIs against common attack vectors.",
        category: "Application Security",
        author: "DevSecOps Team",
        date: "Dec 15, 2024",
        readTime: "6 min read"
    },
    {
        title: "Compliance Roadmap: SOC 2 Type II Certification",
        excerpt: "Step-by-step guidance for achieving and maintaining SOC 2 Type II compliance.",
        category: "Governance & Compliance",
        author: "Compliance Team",
        date: "Dec 10, 2024",
        readTime: "10 min read"
    },
];

export default function BlogPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full min-h-[40vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">
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
                        {/* Back Link */}
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Resources</span>
                        </Link>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            ZecurX<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-cyan-300">Blog</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-3xl mx-auto">
                            Stay ahead of the curve with expert analysis on the dynamic cybersecurity landscape. Our engineers and analysts break down the latest threat vectors, industry trends, and defensive strategies.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Sidebar - Topics */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-32">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                    TOPICS
                                </h3>
                                <div className="space-y-2">
                                    {blogTopics.map((topic, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <topic.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                <span className="text-sm font-medium text-foreground">{topic.label}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{topic.count}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content - Blog Posts */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {blogPosts.map((post, i) => (
                                    <motion.article
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 text-xs font-medium bg-muted rounded-full text-muted-foreground">
                                                {post.category}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-manrope font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{post.readTime}</span>
                                            </div>
                                            <span>{post.date}</span>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>

                            {/* Load More */}
                            <div className="mt-12 text-center">
                                <Button variant="outline" className="h-12 px-8 rounded-full">
                                    Load More Articles
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
