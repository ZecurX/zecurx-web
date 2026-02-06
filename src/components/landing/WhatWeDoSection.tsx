"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Target, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconImage } from "@/components/ui/IconImage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const services = [
    {
        id: 0,
        title: 'Application Security',
        fullTitle: 'Application Security Testing.',
        description: 'Web, API, and source code security testing. We identify and fix real-world vulnerabilities before attackers exploit them.',
        tags: ["Web Pentesting", "API Security", "Source Code Review", "Mobile Security"],
        icon: Shield,
        iconSrc: "/assets/icons/security.svg",
        href: "/services/application-security"
    },
    {
        id: 1,
        title: 'Cloud & DevSecOps',
        fullTitle: 'Cloud & DevSecOps Security.',
        description: 'Cloud misconfiguration and CI/CD security audits. Secure your AWS, GCP, or Azure infrastructure with DevSecOps best practices.',
        tags: ["Cloud Security", "CI/CD Hardening", "Kubernetes", "Infrastructure as Code"],
        icon: Target,
        iconSrc: "/assets/icons/dev.svg",
        href: "/services/cloud-devsecops"
    },
    {
        id: 2,
        title: 'Secure AI Development',
        fullTitle: 'Secure AI Applications.',
        description: 'Build secure AI-powered MVPs and systems. LLM integration security, threat modeling, and AI abuse testing.',
        tags: ["LLM Security", "AI Threat Modeling", "Prompt Injection", "AI Abuse Testing"],
        icon: Search,
        iconSrc: "/assets/icons/ai.svg",
        href: "/services/secure-ai-development"
    },
    {
        id: 3,
        title: 'Compliance Readiness',
        fullTitle: 'Compliance & Certification.',
        description: 'ISO 27001, SOC 2, and DPDP readiness support. Prepare for compliance without slowing down your development.',
        tags: ["ISO 27001", "SOC 2", "DPDP", "Security Policies"],
        icon: Shield,
        iconSrc: "/assets/icons/security.svg",
        href: "/services/compliance-readiness"
    }
];

import { ScrollAnimation } from "@/components/ui/scroll-animation";

export default function WhatWeDoSection() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="relative w-full py-24 bg-background text-foreground overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <ScrollAnimation direction="up">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                                What We Do
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-inter">
                            ZecurX delivers end-to-end cybersecurity solutions across assessment, engineering, compliance, and professional training.
                        </p>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation direction="up" delay={0.2}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column: Content */}
                        <div className="space-y-12">

                            {/* Number Selectors */}
                            <div className="flex items-center gap-4">
                                {services.map((service, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-manrope transition-all duration-300 cursor-pointer",
                                            activeIndex === i
                                                ? "bg-foreground text-background font-bold scale-110 shadow-lg"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                        )}
                                        aria-label={`Select ${service.title}`}
                                        aria-pressed={activeIndex === i}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Fixed Height Content Container */}
                            <div className="min-h-[350px] flex flex-col justify-start relative w-full">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full flex-grow flex flex-col"
                                    >
                                        {/* Title (Fixed Height Header) */}
                                        <div className="min-h-[100px] md:min-h-[140px] flex items-center mb-4 md:mb-6">
                                            <h3 className="text-3xl md:text-5xl font-manrope font-medium text-foreground leading-tight">
                                                {services[activeIndex].fullTitle}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6 md:mb-8">
                                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg">
                                                {services[activeIndex].description}
                                            </p>
                                        </div>

                                        {/* Tag Pills */}
                                        <div className="mt-auto flex flex-wrap gap-3 pb-2">
                                            {services[activeIndex].tags.map((tag, i) => (
                                                <React.Fragment key={i}>
                                                    {tag === "Code Review" && <div className="basis-full h-0" />}
                                                    <div
                                                        className="px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground font-manrope"
                                                    >
                                                        {tag}
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>

                        {/* Right Column: Feature Card */}
                        <div className="relative h-[400px] md:h-[500px] w-full group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0"
                                >
                                    <Card className="bg-card/50 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden h-full flex flex-col justify-between p-10 md:p-14 backdrop-blur-sm">
                                        {/* Minimal Background Texture */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                                        <CardContent className="space-y-8 mt-4 p-0 relative z-10">
                                            <div className="space-y-2">
                                                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Core Capabilities</div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {services[activeIndex].tags.map((tag, i) => (
                                                        <motion.div
                                                            key={tag}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-center gap-4 group/item"
                                                        >
                                                            <div className="h-px w-8 bg-border group-hover/item:bg-foreground/50 transition-colors" />
                                                            <span className="text-xl md:text-3xl font-manrope font-light text-foreground/80 group-hover/item:text-foreground transition-colors">
                                                                {tag}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex flex-wrap items-center gap-3 md:gap-4 p-0 relative z-10 pt-8">
                                            <Button
                                                onClick={() => router.push('/book-demo')}
                                                className="h-12 px-8 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                            >
                                                Book a Demo
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => router.push(services[activeIndex].href)}
                                                variant="ghost"
                                                className="h-12 px-6 rounded-full flex items-center gap-2 hover:bg-muted font-medium border border-border/50 hover:border-foreground/20 text-muted-foreground hover:text-foreground"
                                            >
                                                Details
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </ScrollAnimation>

            </div>
        </section>
    );
}
