"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const caseStudies = [
    {
        metric: "40%",
        label: "Cloud Risk Reduction",
        desc: "Achieved for a leading SaaS provider during a major cloud migration, securing 500+ microservices.",
        tag: "Enterprise Tech"
    },
    {
        metric: "70%",
        label: "Fewer API Attacks",
        desc: "Implemented for a global neobank, stopping automated fraud and scraping attempts.",
        tag: "BFSI"
    },
    {
        metric: "100%",
        label: "Ransomware Recovery",
        desc: "Restored critical research data for a top-tier university within 4 hours of a breach attempt.",
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
                            Proven Impact
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Real-world results from organizations that trust ZecurX.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 text-foreground font-medium hover:text-blue-500 transition-colors">
                        <span>View all case studies</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-foreground/20 transition-all duration-300 group"
                        >
                            <div className="text-xs font-semibold tracking-wider text-blue-500 dark:text-blue-400 uppercase mb-4">
                                {study.tag}
                            </div>
                            <div className="text-6xl md:text-7xl font-bold font-manrope text-foreground mb-6 tracking-tighter">
                                {study.metric}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors">
                                {study.label}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {study.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
