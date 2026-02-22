"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"

export function CtaSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section ref={ref} className="py-24 md:py-32 bg-background flex justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl rounded-[3rem] bg-[#0a0a0a] py-24 px-6 md:px-12 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-8">
                        Ready to Secure Your Business?
                    </h2>

                    <p className="text-[#a1a1aa] text-lg md:text-xl font-light mb-12 leading-relaxed max-w-2xl mx-auto">
                        Schedule a consultation with our security architects and see how ZecurX can transform your defense posture.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full text-black font-medium text-sm bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                                Talk to a Security Expert
                                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.07102 11.3494L0.656854 9.93518L9.25606 1.33598H1.63604L1.63604 -0.0782356H11.5355V9.82121H10.1213V2.20119L2.07102 11.3494Z" fill="currentColor" />
                                </svg>
                            </motion.button>
                        </Link>
                        <Link href="/book-demo">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full border border-gray-800 font-medium text-sm text-white bg-transparent hover:bg-white/5 transition-colors"
                            >
                                Request Assessment
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
