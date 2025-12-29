"use client";
import React from 'react';
import { Shield, Target, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
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

export default function WhyZecurXSection() {
    return (
        <section className="relative w-full py-24 bg-background text-foreground overflow-hidden flex flex-col items-center">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top Right Glow */}
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] dark:bg-blue-900/20"></div>
                {/* Bottom Left Glow (for End-to-End section) */}
                <div className="absolute bottom-[0%] left-[-20%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] opacity-60 dark:bg-indigo-900/20"></div>
                {/* Center subtle glow */}
                <div className="absolute top-[60%] right-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] dark:bg-blue-600/10"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-32">

                {/* Part 1: Who We Are */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <motion.div variants={itemVariants}>
                        <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                            Who We Are
                        </span>
                        <h2 className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-8">
                            Trust. <br />
                            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                                Depth. Expertise.
                            </span>
                        </h2>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-8">
                        <p className="text-xl text-muted-foreground font-manrope font-light leading-relaxed">
                            ZecurX operates at the intersection of <span className="text-foreground font-medium">offensive security, defensive strategy, and secure innovation</span>. Our work is threat-driven, intelligence-led, and focused on reducing real organizational risk.
                        </p>
                        <p className="text-xl text-muted-foreground font-manrope font-light leading-relaxed">
                            We believe effective cybersecurity requires:
                        </p>
                    </motion.div>
                </motion.div>

                {/* Beliefs Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        {
                            icon: Target,
                            title: "Understanding Attacker Behavior",
                            desc: "Security informed by how attackers actually think, move, and exploit systems."
                        },
                        {
                            icon: Shield,
                            title: "Engineering Resilient Systems",
                            desc: "Building security into the DNA of your technology, not adding it as an afterthought."
                        },
                        {
                            icon: Zap,
                            title: "Embedding Security Culture",
                            desc: "Integrating security into technology and culture for sustainable protection."
                        }
                    ].map((item, i) => (
                        <motion.div variants={itemVariants} key={i} className="p-8 rounded-3xl bg-muted/50 backdrop-blur-sm border border-border hover:border-foreground/20 transition-colors group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-6 h-6 text-foreground/80" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-manrope font-semibold text-foreground mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Part 2: What We Do */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="border-t border-border pt-24 relative"
                >
                    {/* Absolute blending gradient for this specific section header */}
                    <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                        <motion.div variants={itemVariants} className="md:w-1/3">
                            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                                What We Do
                            </span>
                            <h3 className="text-4xl font-manrope font-medium text-foreground mb-4">
                                End-to-End <br /> Solutions.
                            </h3>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                ZecurX delivers cybersecurity solutions across assessment, engineering, compliance, and professional training.
                            </p>
                        </motion.div>

                        <motion.div variants={containerVariants} className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "Cybersecurity Consulting", sub: "Managed Security Services" },
                                { title: "Secure Development", sub: "App & Platform Engineering" },
                                { title: "AI-Driven Solutions", sub: "Automation & Intelligence" },
                                { title: "Professional Training", sub: "Certification Programs" }
                            ].map((item, i) => (
                                <motion.div variants={itemVariants} key={i} className="group relative p-6 rounded-2xl bg-muted/30 backdrop-blur-md border border-border hover:border-foreground/10 transition-all duration-300 overflow-hidden">
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-primary transition-colors" />
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-manrope font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground font-manrope group-hover:text-muted-foreground/80 transition-colors">
                                                {item.sub}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
