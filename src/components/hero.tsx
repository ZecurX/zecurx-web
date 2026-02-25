"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-background text-foreground"
        >
            {/* Subtle grid background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 dark:opacity-10"
                    style={{
                        background: "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-6 lg:px-8 relative z-10 max-w-7xl pt-28 pb-20"
            >
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left */}
                    <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">


                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-6xl lg:text-7xl font-newsreader font-medium tracking-tight mb-6 leading-[1.05] text-foreground"
                        >
                            Security that lets you{' '}
                            <span className="italic text-muted-foreground">ship fearlessly.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="text-lg md:text-xl text-muted-foreground font-manrope font-light mb-10 max-w-xl leading-relaxed"
                        >
                            ZecurX delivers enterprise-grade application security, cloud protection, and compliance — purpose-built for startups and modern engineering teams.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group px-7 py-3.5 rounded-full text-sm font-manrope font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity duration-200"
                                >
                                    Start Protecting Now
                                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                                </motion.button>
                            </Link>
                            <Link href="/book-demo">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-7 py-3.5 rounded-full text-sm font-manrope font-medium border border-border text-foreground hover:bg-muted transition-colors duration-200"
                                >
                                    Talk to Experts
                                </motion.button>
                            </Link>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-8 text-sm text-muted-foreground font-manrope"
                        >
                            Trusted by security teams at fast-growing Indian startups
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 w-full relative flex justify-center items-center lg:-mr-16"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="relative w-[115%] sm:w-[125%] lg:w-[140%] aspect-square md:aspect-[4/3]"
                        >
                            <Image
                                src="https://zecurx-web.fsn1.your-objectstorage.com/hero-graphic.png"
                                alt="ZecurX Unified Security Platform"
                                fill
                                quality={100}
                                unoptimized
                                className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
