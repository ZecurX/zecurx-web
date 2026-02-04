"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const caseStudies = [
    {
        metric: "2 weeks",
        label: "SOC 2 Readiness",
        desc: "Helped a Series A fintech startup achieve SOC 2 readiness in just 2 weeks, unblocking a major enterprise deal.",
        tag: "SaaS Startup"
    },
    {
        metric: "12",
        label: "Critical Vulns Found",
        desc: "Discovered 12 critical vulnerabilities including prompt injection flaws in an AI chatbot before production launch.",
        tag: "AI Company"
    },
    {
        metric: "100%",
        label: "Compliance Pass",
        desc: "Guided an EdTech platform through FERPA compliance audit with zero findings, protecting 50,000+ student records.",
        tag: "Education"
    }
];

export default function CaseStudies() {
    return (
        <section className="py-24 bg-background relative border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground mb-4">
                            Real Results
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl font-light">
                            Security outcomes that helped our clients ship faster and more securely.
                        </p>
                    </div>
                    <Link 
                        href="/contact" 
                        className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
                    >
                        <span>Become a success story</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-2xl bg-muted/20 overflow-hidden">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 md:p-10 hover:bg-muted/30 transition-colors duration-300 group"
                        >
                            <div className="text-xs font-bold tracking-wider text-primary uppercase mb-4">
                                {study.tag}
                            </div>
                            <div className="text-5xl md:text-6xl font-bold font-manrope text-foreground mb-4 tracking-tighter">
                                {study.metric}
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-foreground">
                                {study.label}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {study.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
