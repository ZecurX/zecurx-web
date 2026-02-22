"use client"

import { motion } from "framer-motion"

const LOGOS = [
    "Razorpay", "PhonePe", "CRED", "BharatPe", "Groww",
    "Zepto", "Meesho", "Physics Wallah", "Unacademy", "Oyo"
]

export function SocialProof() {
    const doubled = [...LOGOS, ...LOGOS]

    return (
        <section className="py-12 border-b dark:border-white/6 border-gray-200">
            <div className="container mx-auto px-6 max-w-7xl mb-7">
                <p className="dark:text-gray-500 text-gray-500 text-xs font-medium tracking-widest uppercase text-center">
                    Trusted by fast-growing startups across India
                </p>
            </div>

            <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none dark:from-[#0a0a0a] from-white bg-gradient-to-r" />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none dark:from-[#0a0a0a] from-white bg-gradient-to-l" />

                <motion.div
                    className="flex gap-6 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                >
                    {doubled.map((logo, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border shrink-0 dark:border-white/8 border-gray-200 dark:bg-white/2 bg-gray-50"
                        >
                            <div className="w-5 h-5 rounded bg-blue-500/80 flex items-center justify-center text-[9px] font-bold text-white">
                                {logo[0]}
                            </div>
                            <span className="text-sm font-medium dark:text-gray-400 text-gray-600">{logo}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
