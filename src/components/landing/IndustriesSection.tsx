"use client";

import React from 'react';
import { Building2, Landmark, GraduationCap, Rocket, ArrowUpRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { IconImage } from "@/components/ui/IconImage";

const industries = [
    {
        id: "enterprise",
        name: "Enterprises",
        desc: "Comprehensive security for large-scale organizations.",
        icon: Building2,
        iconSrc: "/assets/icons/enterprise.svg",
        gradient: "from-blue-400/20 to-cyan-400/20"
    },
    {
        id: "gov",
        name: "Government & Public Sector",
        desc: "Compliance-driven security for critical infrastructure.",
        icon: Landmark,
        iconSrc: "/assets/icons/gov.svg",
        gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        id: "edu",
        name: "Educational Institutions",
        desc: "Protecting research data and student privacy.",
        icon: GraduationCap,
        iconSrc: "/assets/icons/edu.svg",
        gradient: "from-orange-500/20 to-red-500/20"
    },
    {
        id: "tech",
        name: "Technology Startups & SaaS",
        desc: "Secure architecture for high-growth tech companies.",
        icon: Rocket,
        iconSrc: "/assets/icons/tech.svg",
        gradient: "from-purple-500/20 to-pink-500/20"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

export default function IndustriesSection() {
    return (
        <section className="relative w-full py-32 bg-background text-foreground overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none dark:bg-blue-900/20" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-manrope font-medium text-foreground tracking-tight mb-6">
                        We Serve
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Tailored security solutions for high-stakes sectors.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {industries.map((ind, i) => (
                        <motion.div
                            variants={itemVariants}
                            key={i}
                            className="group relative rounded-3xl overflow-hidden bg-muted/30 border border-border hover:border-foreground/20 transition-all duration-500 h-[450px] flex flex-col justify-between p-8 backdrop-blur-sm"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out",
                                ind.gradient
                            )} />

                            {/* Top Content: Icon */}
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ind.icon className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Bottom Content: Text & CTA */}
                            <div className="relative z-10">
                                <h3 className="text-2xl font-manrope font-semibold text-foreground mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                    {ind.name}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {ind.desc}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/50 group-hover:text-foreground transition-colors cursor-pointer w-max">
                                    <span>Learn more</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
