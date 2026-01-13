"use client";

import React, { useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardTagline
} from "@/components/ui/card";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";

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

const solutions = [
    {
        id: "digital-transformation",
        title: "Digital Transformation",
        tagline: "Secure Modernization",
        description: "Enable secure modernization while adopting cloud, automation, and emerging technologies.",
        stat: "Proven",
        statLabel: "Risk Reduction",
        featured: true,
    },
    {
        id: "ai-powered-soc",
        title: "AI-Powered SOC",
        tagline: "Next-Gen Operations",
        description: "Modernize your security operations with intelligence-driven detection and AI-powered response.",
        stat: "Faster",
        statLabel: "Response Time",
        featured: true,
    },
    {
        id: "zero-trust",
        title: "Zero Trust",
        tagline: "Never Trust, Always Verify",
        description: "Move beyond perimeter-based security to continuous verification and least-privilege access.",
        stat: "Strict",
        statLabel: "Verification",
    },
    {
        id: "ransomware-defense",
        title: "Ransomware Defense",
        tagline: "Multi-Layer Defense",
        description: "Multi-layered defense combining prevention, detection, and rapid recovery.",
        stat: "Rapid",
        statLabel: "Response SLA",
    },
    {
        id: "cloud-security",
        title: "Cloud Security",
        tagline: "Multi-Cloud Protection",
        description: "Secure your multi-cloud environments—AWS, Azure, GCP—with comprehensive visibility.",
        stat: "All",
        statLabel: "Cloud Platforms",
    },
    {
        id: "compliance",
        title: "Compliance",
        tagline: "Regulatory Alignment",
        description: "Achieve and maintain compliance with industry regulations and security frameworks.",
        stat: "Multi",
        statLabel: "Framework Support",
    },
];

export default function SolutionsPage() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
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
                            Protect. Defend. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Secure.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-2xl mx-auto">
                            Comprehensive cybersecurity aligned with your business priorities.
                            Enabling growth, resilience, and compliance at enterprise scale.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Solutions Grid - Unified Professional Layout */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {solutions.map((solution, index) => (
                            <motion.div
                                key={solution.id}
                                variants={itemVariants}
                                className={index < 2 ? "lg:col-span-1" : ""}
                            >
                                <Link
                                    href={`/solutions/${solution.id}`}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTagline>{solution.tagline}</CardTagline>
                                            <CardTitle>{solution.title}</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-6">
                                                {solution.description}
                                            </CardDescription>
                                        </CardContent>

                                        <CardFooter className="justify-between mt-auto">
                                            <span className="text-xs text-muted-foreground/60 font-manrope uppercase tracking-wide group-hover:text-primary/60 transition-colors">
                                                Learn more
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
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
                            Ready to get started?
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            Schedule a consultation with our security experts.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Us
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
