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
                    <button className="flex items-center gap-2 text-foreground font-medium hover:text-blue-400 transition-colors">
                        <span>View all case studies</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border bg-background/50 backdrop-blur-sm">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 md:p-12 hover:bg-muted/5 transition-colors duration-300 group"
                        >
                            <div className="text-xs font-semibold tracking-wider text-blue-400 dark:text-blue-300 uppercase mb-4">
                                {study.tag}
                            </div>
                            <div className="text-5xl md:text-6xl font-bold font-manrope text-foreground mb-6 tracking-tighter">
                                {study.metric}
                            </div>
                            <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition-colors">
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
