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
        <section className="py-32 bg-background relative border-t border-border overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-foreground tracking-tight mb-4">
                            Real Results
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl font-light">
                            Security outcomes that helped our clients ship faster and more securely.
                        </p>
                    </div>
                    <Link 
                        href="/contact" 
                        className="group flex items-center gap-2 text-foreground font-medium hover:text-blue-500 transition-colors"
                    >
                        <span>Become a success story</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 md:p-10 rounded-3xl bg-[#f4f8ff] border border-blue-100 hover:border-blue-200 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-[#eef4ff] group-hover:to-transparent transition-all duration-500" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-[11px] font-bold tracking-wider text-[#3b82f6] uppercase mb-8 bg-[#dce8ff] self-start px-3 py-1.5 rounded-full">
                                    {study.tag}
                                </div>
                                <div className="text-6xl md:text-7xl font-bold font-manrope text-[#0f172a] mb-6 tracking-tight group-hover:text-[#2563eb] transition-colors">
                                    {study.metric}
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-xl font-bold mb-4 text-[#0f172a]">
                                        {study.label}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed text-sm font-medium max-w-[90%]">
                                        {study.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
