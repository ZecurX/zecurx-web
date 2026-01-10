"use client";
import React from 'react';
import { Shield, Target, Zap, CheckCircle2 } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/ui/card";

import { ScrollAnimation } from "@/components/ui/scroll-animation";

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
                <ScrollAnimation direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                                Who We Are
                            </span>
                            <h2 className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-8">
                                Trust. <br />
                                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                                    Depth. Expertise.
                                </span>
                            </h2>
                        </div>
                        <div className="space-y-8">
                            <p className="text-xl text-muted-foreground font-manrope font-light leading-relaxed">
                                ZecurX operates at the intersection of <span className="text-foreground font-medium">offensive security, defensive strategy, and secure innovation</span>. Our work is threat-driven, intelligence-led, and focused on reducing real organizational risk.
                            </p>
                            <p className="text-xl text-muted-foreground font-manrope font-light leading-relaxed">
                                We believe effective cybersecurity requires:
                            </p>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Beliefs Grid */}
                <ScrollAnimation direction="up" delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                num: "01",
                                title: "Understanding Attacker Behavior",
                                desc: "Security informed by how attackers actually think, move, and exploit systems."
                            },
                            {
                                num: "02",
                                title: "Engineering Resilient Systems",
                                desc: "Building security into the DNA of your technology, not adding it as an afterthought."
                            },
                            {
                                num: "03",
                                title: "Embedding Security Culture",
                                desc: "Integrating security into technology and culture for sustainable protection."
                            }
                        ].map((item, i) => (
                            <Card key={i} className="bg-muted/50 backdrop-blur-sm border-border hover:border-foreground/20 group">
                                <CardHeader>
                                    <div className="text-6xl font-manrope font-light text-muted-foreground/20 mb-4 group-hover:text-primary/20 transition-colors duration-300">
                                        {item.num}
                                    </div>
                                    <CardTitle className="text-xl mb-4">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.desc}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollAnimation>

                {/* Part 2: What We Do */}
                <ScrollAnimation direction="up" delay={0.4}>
                    <div className="border-t border-border pt-24 relative">
                        {/* Absolute blending gradient for this specific section header */}
                        <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-foreground/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                            <div className="md:w-1/3">
                                <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
                                    What We Do
                                </span>
                                <h3 className="text-4xl font-manrope font-medium text-foreground mb-4">
                                    End-to-End <br /> Solutions.
                                </h3>
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                    ZecurX delivers cybersecurity solutions across assessment, engineering, compliance, and professional training.
                                </p>
                            </div>

                            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "Cybersecurity Consulting", sub: "Managed Security Services" },
                                    { title: "Secure Development", sub: "App & Platform Engineering" },
                                    { title: "AI-Driven Solutions", sub: "Automation & Intelligence" },
                                    { title: "Professional Training", sub: "Certification Programs" }
                                ].map((item, i) => (
                                    <Card key={i} className="bg-muted/30 backdrop-blur-md border border-border hover:border-foreground/10 p-8 h-full flex flex-col justify-center group">
                                        <CardContent className="p-0">
                                            <CardTitle className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm font-manrope text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                                {item.sub}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

            </div>
        </section>
    );
}
