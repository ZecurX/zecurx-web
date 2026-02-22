"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

// Exact services from the navbar
const SERVICES = [
    {
        title: "Application Security",
        description: "Web, API & source code security testing. We uncover logic flaws and deep vulnerabilities that automated scanners miss, securing your apps before they ship.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/services/upscayl_png_upscayl-standard-4x_2x/service_appsec_ui.png"
    },
    {
        title: "Cloud & DevSecOps",
        description: "Cloud misconfig & CI/CD security audits. We secure your AWS, Azure, and GCP environments while embedding shift-left security directly into your pipelines.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/services/upscayl_png_upscayl-standard-4x_2x/service_cloud_ui.png"
    },
    {
        title: "Secure AI Development",
        description: "LLM security & AI abuse testing. Protect your models and AI agents from prompt injection, data poisoning, and unauthorized model access.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/services/upscayl_png_upscayl-standard-4x_2x/service_ai_ui.png"
    },
    {
        title: "Compliance Readiness",
        description: "ISO 27001, SOC 2 & DPDP preparation. We fast-track your compliance goals with gap assessments, penetration testing, and evidence collection workflows.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/services/upscayl_png_upscayl-standard-4x_2x/service_compliance_ui.png"
    },
]

export function Services() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [expandedIndex, setExpandedIndex] = useState<number>(0)

    return (
        <section ref={ref} className="py-24 md:py-32 bg-background text-foreground" id="services">
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="mb-16 md:mb-24"
                >
                    <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">What We Do</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground mb-4">
                        Security across <span className="font-newsreader italic text-muted-foreground">every attack surface</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side: The "Perfect Image" container */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-xl mx-auto lg:mx-0 rounded-3xl overflow-hidden group shadow-2xl hover:shadow-[0_0_80px_rgba(59,130,246,0.15)] transition-shadow duration-500 bg-[#0a0a0a]"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={expandedIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={SERVICES[expandedIndex].image}
                                    alt={SERVICES[expandedIndex].title}
                                    fill
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                    quality={100}
                                    priority={expandedIndex === 0}
                                    className="transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Right Side: Services Accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-2"
                    >
                        {SERVICES.map((svc, i) => {
                            const isExpanded = expandedIndex === i

                            return (
                                <div
                                    key={svc.title}
                                    className="border-b dark:border-white/8 border-gray-200 last:border-0"
                                >
                                    <button
                                        onClick={() => setExpandedIndex(i)}
                                        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                                    >
                                        <h3 className={`text-xl md:text-2xl font-semibold transition-colors duration-300 ${isExpanded ? 'dark:text-white text-gray-900' : 'dark:text-gray-400 text-gray-500 group-hover:dark:text-gray-300 group-hover:text-gray-700'
                                            }`}>
                                            {svc.title}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className={`flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full ${isExpanded ? 'dark:bg-white/10 bg-gray-100' : 'dark:bg-transparent bg-transparent'
                                                }`}
                                        >
                                            <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'dark:text-white text-black' : 'dark:text-gray-500 text-gray-400'
                                                }`} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="pb-8 pr-12">
                                                    <p className="text-lg leading-relaxed dark:text-gray-400 text-gray-600">
                                                        {svc.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
