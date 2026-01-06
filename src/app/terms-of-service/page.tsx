"use client";

import React, { useState, useEffect, useRef } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Mail } from 'lucide-react';

const termsData = [
    {
        title: "1. Scope of Services",
        content: [
            "Security assessments and audits",
            "Managed security services",
            "Cybersecurity training and certification programs",
            "Threat monitoring and incident response",
            "Technical consulting and support"
        ]
    },
    {
        title: "2. User Obligations",
        content: [
            "Provide accurate and complete information when engaging with our services.",
            "Maintain the confidentiality of login credentials and access permissions.",
            "Use our services only for lawful and authorized purposes.",
            "Refrain from attempting to breach, disrupt, or exploit ZecurX systems or related infrastructure."
        ]
    },
    {
        title: "3. Company Responsibilities",
        content: [
            "Deliver services as per the agreed scope and timelines.",
            "Maintain appropriate security controls to safeguard systems and data.",
            "Provide customer support within reasonable timeframes."
        ]
    },
    {
        title: "4. Payment Terms",
        content: [
            "All invoices must be paid in full within the specified due date.",
            "Late payments may result in delayed service delivery or temporary suspension.",
            "Refunds, if applicable, will be provided only under written agreement."
        ]
    },
    {
        title: "5. Intellectual Property Rights",
        content: "All content, tools, frameworks, documentation, training materials, and proprietary methods developed or provided by ZecurX are the exclusive intellectual property of the company. Unauthorized copying, distribution, resale, or modification is strictly prohibited."
    },
    {
        title: "6. Limitation of Liability",
        content: "ZecurX shall not be liable for any indirect, incidental, consequential, or special damages arising from the use or inability to use our services, including loss of data, revenue, or business opportunities."
    },
    {
        title: "7. Termination of Access",
        content: "We reserve the right to suspend or terminate user access in the event of misconduct, violation of these Terms, or actions that pose security threats."
    },
    {
        title: "8. Governing Law",
        content: "These Terms shall be governed by and construed in accordance with the laws of Bengaluru, Karnataka, India."
    }
];

export default function TermsOfServicePage() {
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
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-manrope font-extrabold tracking-tight mb-6 text-foreground"
                    >
                        Terms of Service
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        These Terms of Service govern your access to and use of the services, solutions, training programs, and digital platforms provided by ZecurX Cybersecurity Pvt. Ltd.
                    </motion.p>
                </div>
            </section>

            {/* Terms Content Section */}
            <section className="py-16 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 md:p-12 shadow-lg"
                    >
                        <p className="text-muted-foreground mb-10 leading-relaxed text-base border-l-4 border-foreground pl-6 py-2 bg-muted/30 rounded-r-lg">
                            By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
                        </p>

                        <div className="space-y-10">
                            {termsData.map((section, index) => (
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

                                    {Array.isArray(section.content) ? (
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                                                    {item}
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
                                For questions regarding these Terms, contact us at:
                            </p>
                            <div className="mt-4">
                                <a
                                    href="mailto:support@zecurx.com"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors duration-300 text-foreground font-medium"
                                >
                                    <Mail className="w-4 h-4 text-foreground" />
                                    support@zecurx.com
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
