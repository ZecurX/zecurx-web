"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const REASONS = [
    {
        title: "DevSec-first approach",
        body: "We embed security directly into your sprint cycles — not as an afterthought. Ship faster without sacrificing security posture.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_devsec_shield.png",
        className: "md:col-span-1",
        imageClassName: "object-contain p-8 md:p-12",
        contentClassName: "px-8 pb-8"
    },
    {
        title: "AI-native threat intelligence",
        body: "Our threat engine learns from every engagement to identify novel attack vectors before your adversaries can weaponize them.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_ai_threat.png",
        className: "md:col-span-1",
        imageClassName: "object-contain p-8 md:p-12",
        contentClassName: "px-8 pb-8"
    },
    {
        title: "Zero-friction compliance",
        body: "SOC 2, ISO 27001, DPDP Act — we turn months-long compliance projects into structured 90-day programs with full evidence support.",
        image: "https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_compliance.png",
        className: "md:col-span-2",
        imageClassName: "object-cover object-right-bottom ml-auto",
        contentClassName: "p-8 md:p-12 md:max-w-xl relative mx-auto lg:mx-0 w-full lg:w-1/2 flex flex-col justify-end lg:justify-center z-10"
    },
]

export function WhyUs() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            ref={ref}
            className="py-24 md:py-32 bg-background text-foreground"
            id="why-us"
        >
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">Why ZecurX</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground mb-6">
                        Built for teams that <br className="hidden md:block" />
                        <span className="font-newsreader italic text-muted-foreground">can&apos;t afford to get hacked</span>
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-manrope font-light max-w-2xl mx-auto">
                        Security that fits your workflow — not the other way around.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 min-h-[400px]">
                    {/* DevSec Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex flex-col justify-end min-h-[300px] md:min-h-[350px] dark:bg-[#0a0a0c] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl border dark:border-white/8 border-gray-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none" />

                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                            <Image
                                src="https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_devsec_shield.png"
                                alt="DevSec-first approach"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                className="transition-transform duration-700 ease-in-out group-hover:scale-115 scale-105 opacity-80"
                            />
                        </div>
                        <div className="p-8 md:p-10 relative z-20">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{REASONS[0].title}</h3>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{REASONS[0].body}</p>
                        </div>
                    </motion.div>

                    {/* AI Threat Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex flex-col justify-end min-h-[300px] md:min-h-[350px] dark:bg-[#0a0a0c] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl border dark:border-white/8 border-gray-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none" />

                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                            <Image
                                src="https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_ai_threat_minimal.png"
                                alt="AI-native threat intelligence"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                className="transition-transform duration-700 ease-in-out group-hover:scale-115 scale-105 opacity-80"
                            />
                        </div>
                        <div className="p-8 md:p-10 relative z-20">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{REASONS[1].title}</h3>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{REASONS[1].body}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex flex-col lg:flex-row md:col-span-2 dark:bg-[#0a0a0c] bg-gray-50 rounded-3xl overflow-hidden shadow-2xl border dark:border-white/8 border-gray-200 min-h-[250px] md:min-h-[300px]"
                    >
                        {/* Gradient overlay for text readability over entire image */}
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/95 via-black/70 lg:via-black/80 to-transparent lg:to-black/30 z-10 pointer-events-none" />

                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-0">
                            <Image
                                src="https://zecurx-web.fsn1.your-objectstorage.com/why-us/upscayl_png_upscayl-standard-4x_2x/why_compliance.png"
                                alt="Zero-friction compliance"
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                className="transition-transform duration-700 ease-in-out group-hover:scale-110 scale-105 opacity-80"
                            />
                        </div>

                        <div className="relative w-full lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-end lg:justify-center z-20 h-full min-h-[250px] lg:min-h-0">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{REASONS[2].title}</h3>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-lg">{REASONS[2].body}</p>

                            <div className="mt-8 flex gap-3 flex-wrap">
                                <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">SOC 2 Type II</span>
                                <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">ISO 27001</span>
                                <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">HIPAA</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
