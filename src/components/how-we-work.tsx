"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const STEPS = [
    { step: "01", title: "Discovery & Threat Modeling", description: "We map your architecture, attack surface, and threat model in a focused 2-day workshop — identifying critical risks upfront.", tag: "Days 1–2" },
    { step: "02", title: "Deep Security Assessment", description: "Manual pentesting, automated scanning, and code review simultaneously — no noisy automated-only outputs.", tag: "Week 1–2" },
    { step: "03", title: "Prioritized Remediation", description: "Developer-friendly report with CVSS scores, exploit likelihood, and step-by-step fix guidance.", tag: "Week 3" },
    { step: "04", title: "Fix Verification & Retesting", description: "We retest every finding after your team resolves them, confirming each vulnerability is actually closed.", tag: "Week 4" },
]

export function HowWeWork() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section ref={ref} className="py-24 md:py-32" id="process">
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold uppercase tracking-widest mb-3 block dark:text-blue-400 text-blue-600">How We Work</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter dark:text-white text-gray-900 mb-4" style={{ letterSpacing: "-1px" }}>
                        Our process. Your peace of mind.
                    </h2>
                    <p className="dark:text-gray-400 text-gray-600 text-lg max-w-xl mx-auto">
                        A structured engagement delivering real improvements — not just a checkbox report.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="hidden md:block absolute top-5 left-0 right-0 h-px dark:bg-white/5 bg-gray-200" />
                    <motion.div
                        className="hidden md:block absolute top-5 left-0 h-px bg-blue-500"
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: "100%" } : {}}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 25 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                {/* Timeline dot */}
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mb-5 hidden md:block shadow-[0_0_8px_rgba(59,130,246,0.5)]" />

                                <div className="rounded-2xl p-5 border dark:border-white/8 border-gray-200 dark:bg-white/2 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-black dark:text-white/20 text-gray-300">{step.step}</span>
                                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full dark:bg-white/5 bg-gray-100 dark:text-gray-400 text-gray-500 border dark:border-white/8 border-gray-200">
                                            {step.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-xs dark:text-gray-400 text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
