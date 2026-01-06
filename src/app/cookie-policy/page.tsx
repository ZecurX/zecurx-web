"use client";

import React, { useState, useEffect, useRef } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail } from 'lucide-react';

const cookieData = [
    {
        title: "1. What Are Cookies?",
        content: "Cookies are small data files stored on a user's device to support essential functionality and improve browsing experience."
    },
    {
        title: "2. Types of Cookies We Use",
        content: [
            { type: "Essential Cookies", desc: "Required for core website functions such as authentication and page navigation." },
            { type: "Analytics Cookies", desc: "Help us analyze website performance, traffic, and user behavior." },
            { type: "Security Cookies", desc: "Detect malicious activity and protect system integrity." },
            { type: "Preference Cookies", desc: "Remember user preferences such as language or login details." }
        ]
    },
    {
        title: "3. Why We Use Cookies",
        intro: "Cookies enable us to:",
        content: [
            "Provide secure and stable platform access",
            "Improve performance and usability",
            "Track issues and enhance cybersecurity monitoring",
            "Personalize content and user experience"
        ]
    },
    {
        title: "4. Managing Cookies",
        content: "Users may disable cookies through browser settings; however, certain features may become unavailable or function incorrectly."
    },
    {
        title: "5. Third-Party Cookies",
        content: "We may use trusted services such as analytics or monitoring platforms that deploy their own cookies."
    }
];

export default function CookiePolicyPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main ref={ref} className="bg-background min-h-screen text-foreground selection:bg-foreground/20 relative overflow-hidden">

            {/* Background Texture */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <CreativeNavBar />

            {/* Header Section */}
            <section className="pt-32 pb-10 px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center transition-colors duration-300">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-manrope font-extrabold tracking-tight mb-6 text-foreground"
                    >
                        Cookie Policy
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        This Cookie Policy explains how ZecurX Cybersecurity Pvt. Ltd. uses cookies and similar technologies to enhance user experience and secure our digital platforms.
                    </motion.p>
                </div>
            </section>

            {/* Cookie Content Section */}
            <section className="py-16 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 md:p-12 shadow-lg"
                    >
                        <div className="space-y-10">
                            {cookieData.map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <h3 className="text-xl md:text-2xl font-manrope font-bold text-foreground mb-4">
                                        {section.title.replace(/^\d+\.\s*/, '')}
                                    </h3>

                                    {section.intro && (
                                        <p className="text-muted-foreground leading-relaxed mb-3">
                                            {section.intro}
                                        </p>
                                    )}

                                    {Array.isArray(section.content) ? (
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                                                    {typeof item === 'string' ? (
                                                        item
                                                    ) : (
                                                        <span>
                                                            <strong className="text-foreground">{item.type}:</strong> {item.desc}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground leading-relaxed">
                                            {section.content}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mt-12 pt-10 border-t border-border"
                        >
                            <h3 className="text-xl md:text-2xl font-manrope font-bold text-foreground mb-4">
                                Contact Information
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                For cookie-related questions, contact us at:
                            </p>
                            <div className="mt-4">
                                <a
                                    href="mailto:cookies@zecurx.com"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors duration-300 text-foreground font-medium"
                                >
                                    <Mail className="w-4 h-4 text-foreground" />
                                    cookies@zecurx.com
                                </a>
                            </div>
                        </motion.div>

                        {/* Last Updated */}
                        <div className="mt-10 pt-6 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                Last updated: December 2025
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
