"use client";
import React, { useState } from 'react';
import { Shield, Target, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { imgGroup218 } from './assets';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconImage } from "@/components/ui/IconImage";

const services = [
    {
        id: 0,
        title: 'Enterprise Security',
        fullTitle: 'Enterprise Cybersecurity Services.',
        description: 'Threat detection, vulnerability assessment, pentesting, and compliance audits — informed by how attackers think, move, and exploit.',
        tags: ["Risk Assessments", "Threat Modeling", "Adversary Simulation", "Compliance"],
        icon: Shield,
        iconSrc: "/assets/icons/security.png"
    },
    {
        id: 1,
        title: 'Secure Development',
        fullTitle: 'Secure Software & Systems.',
        description: 'Secure SDLC, DevSecOps implementation, and cloud-native security architecture built into systems by design, not added as an afterthought.',
        tags: ["Secure SDLC", "DevSecOps", "Cloud Security", "Code Review"],
        icon: Target,
        iconSrc: "/assets/icons/dev.png"
    },
    {
        id: 2,
        title: 'AI-Driven Security',
        fullTitle: 'AI Security Capabilities.',
        description: 'AI-powered risk identification, automated remediation, and behavioral insights for faster detection, smarter response, and lower operational risk.',
        tags: ["AI Risk ID", "Auto-Remediation", "Behavioral Insights", "Smarter Response"],
        icon: Search,
        iconSrc: "/assets/icons/ai.png"
    }
];

export default function WhatWeDoSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full py-24 bg-background text-foreground overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-manrope font-medium mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-muted-foreground">
                            What We Do
                        </span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-inter">
                        ZecurX delivers end-to-end cybersecurity solutions across assessment, engineering, compliance, and professional training.
                    </p>
                </motion.div>

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
                                        "w-12 h-12 rounded-full flex items-center justify-center text-lg font-manrope transition-all duration-300",
                                        activeIndex === i
                                            ? "bg-foreground text-background font-bold scale-110 shadow-lg"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Fixed Height Content Container */}
                        <div className="h-[450px] flex flex-col justify-start relative w-full">
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
                                    <div className="min-h-[140px] flex items-center mb-6">
                                        <h3 className="text-4xl md:text-5xl font-manrope font-medium text-foreground leading-tight">
                                            {services[activeIndex].fullTitle}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <p className="text-muted-foreground text-xl leading-relaxed max-w-lg">
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
                    <div className="relative h-[500px] w-full group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 bg-background border border-border rounded-3xl overflow-hidden shadow-2xl"
                            >

                                {/* Background Effects */}
                                <div className={cn(
                                    "absolute top-[-20%] right-[-20%] w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-700 opacity-20",
                                    activeIndex === 0 ? "bg-blue-400" :
                                        activeIndex === 1 ? "bg-emerald-600" : "bg-purple-600"
                                )} />

                                <div className="absolute inset-0 flex items-center justify-center p-12">
                                    {/* Placeholder Image/Visual for the capability */}
                                    <div className="relative w-full h-full bg-muted/50 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
                                        {/* Big Icon Faded */}
                                        <IconImage
                                            src={services[activeIndex].iconSrc}
                                            fallback={services[activeIndex].icon}
                                            alt={services[activeIndex].title}
                                            className="w-48 h-48 group-hover:scale-110 transition-transform duration-500"
                                            iconClassName="text-muted-foreground/10"
                                        />

                                        {/* Center Label */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-manrope font-light text-foreground/20 uppercase tracking-widest z-10">
                                                {services[activeIndex].title}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating CTA Buttons (Bottom Left of Card) */}
                                <div className="absolute bottom-8 left-8 flex items-center gap-4 z-20">
                                    <Button
                                        onClick={handleScrollToContact}
                                        className="h-12 px-6 rounded-full flex items-center gap-2 text-sm hover:scale-105"
                                    >
                                        Book a Demo
                                        <img src={imgGroup218} alt="" className="w-4 h-4 invert dark:invert-0" />
                                    </Button>
                                    <Button variant="ghost" className="h-12 px-4 rounded-full flex items-center gap-2 hover:bg-muted hover:text-foreground border border-transparent hover:border-border">
                                        Learn More
                                    </Button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
}
