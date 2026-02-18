"use client";

import React, { useRef } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { motion, useScroll } from "framer-motion";
import { Mail } from 'lucide-react';

const privacyData = [
    {
        title: "1. Information We Collect",
        intro: "We may collect the following categories of information:",
        content: [
            "Personal details: name, email address, phone number, organization details.",
            "Technical data: IP address, device identifiers, browser type, and system logs.",
            "Usage data: interactions with our website or training portals.",
            "Training or service-related information submitted by the user."
        ]
    },
    {
        title: "2. Purpose of Data Collection",
        intro: "We use personal information for:",
        content: [
            "Service delivery and operational activities.",
            "User account creation and access management.",
            "Communication, updates, and support.",
            "Improving system performance and security.",
            "Compliance with legal or regulatory requirements."
        ]
    },
    {
        title: "3. Data Sharing",
        intro: "We do not sell or rent personal data. Information may be shared only with:",
        content: [
            "Trusted third-party service providers supporting our operations.",
            "Legal authorities when required under applicable law."
        ]
    },
    {
        title: "4. Data Retention",
        content: "Personal data is stored only for the duration necessary to fulfill service obligations or comply with legal requirements. Upon expiration, data is securely deleted."
    },
    {
        title: "5. Data Security",
        intro: "We implement strong security measures, including:",
        content: [
            "Encryption of data at rest and in transit",
            "Multi-factor authentication",
            "Access control restrictions",
            "Routine audits and log monitoring"
        ]
    },
    {
        title: "6. User Rights",
        intro: "Users may:",
        content: [
            "Request access to their personal data",
            "Seek correction of inaccurate information",
            "Request deletion, subject to legal allowances",
            "Opt-out of marketing communications"
        ]
    }
];

export default function PrivacyPolicyPage() {
    const ref = useRef(null);

    useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

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
                        Privacy Policy
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        This Privacy Policy outlines how ZecurX Cybersecurity Pvt. Ltd. collects, uses, stores, and protects personal information obtained through our website, platforms, and services.
                    </motion.p>
                </div>
            </section>

            {/* Privacy Content Section */}
            <section className="py-16 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 md:p-12 shadow-lg"
                    >
                        <div className="space-y-10">
                            {privacyData.map((section, index) => (
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
                                For privacy-related inquiries, contact us at:
                            </p>
                            <div className="mt-4">
                                <a
                                    href="mailto:privacy@zecurx.com"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors duration-300 text-foreground font-medium"
                                >
                                    <Mail className="w-4 h-4 text-foreground" />
                                    privacy@zecurx.com
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
