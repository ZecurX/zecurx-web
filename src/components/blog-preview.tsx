"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"

const POSTS = [
    {
        tag: "Threat Research",
        title: "How Attackers Exploit LLM APIs: A Technical Breakdown",
        excerpt: "Prompt injection, jailbreak techniques, and training data poisoning attacks targeting production LLM APIs in 2025.",
        date: "Feb 14, 2025",
        readTime: "8 min read",
        featured: true,
    },
    {
        tag: "Compliance",
        title: "DPDP Act 2025: What Your Engineering Team Needs to Know",
        excerpt: "A plain-English guide to India's new data privacy law with actionable steps for your product and infra teams.",
        date: "Jan 28, 2025",
        readTime: "5 min read",
        featured: false,
    },
    {
        tag: "DevSec",
        title: "Embedding Security Into Your GitHub Actions Pipeline",
        excerpt: "SAST, secret scanning, and dependency checks that don't slow your CI/CD — a practical setup guide.",
        date: "Jan 12, 2025",
        readTime: "6 min read",
        featured: false,
    },
]

export function BlogPreview() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section ref={ref} className="py-24 md:py-32 border-t dark:border-white/6 border-gray-200">
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-xs font-semibold uppercase tracking-widest mb-3 block dark:text-blue-400 text-blue-600">Latest Insights</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter dark:text-white text-gray-900" style={{ letterSpacing: "-1px" }}>
                            From the ZecurX research team
                        </h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
                        <Link href="/blog" className="text-sm font-medium dark:text-gray-400 text-gray-500 hover:dark:text-gray-200 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                            View all →
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {POSTS.filter(p => p.featured).map((post) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 25 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7 }}
                            className="lg:col-span-3"
                        >
                            <Link href="/blog" className="block group h-full">
                                <div className="h-full rounded-2xl border dark:border-white/8 border-gray-200 p-7 hover:border-blue-500/30 transition-colors duration-200 dark:bg-white/2 bg-gray-50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border dark:border-white/8 border-gray-200 dark:text-gray-400 text-gray-500 mb-5 inline-block dark:bg-white/3 bg-gray-100">
                                        {post.tag}
                                    </span>
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-3 leading-snug">{post.title}</h3>
                                    <p className="dark:text-gray-400 text-gray-600 leading-relaxed text-sm mb-7">{post.excerpt}</p>
                                    <div className="flex items-center gap-3 text-xs dark:text-gray-500 text-gray-500 border-t dark:border-white/6 border-gray-200 pt-5">
                                        <span>{post.date}</span>
                                        <span>·</span>
                                        <span>{post.readTime}</span>
                                        <span className="ml-auto font-medium text-blue-500">Read →</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {POSTS.filter(p => !p.featured).map((post, i) => (
                            <motion.div
                                key={post.title}
                                initial={{ opacity: 0, y: 25 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
                                className="flex-1"
                            >
                                <Link href="/blog" className="block group h-full">
                                    <div className="h-full rounded-2xl border dark:border-white/8 border-gray-200 p-5 hover:border-blue-500/30 transition-colors duration-200 dark:bg-white/2 bg-gray-50">
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border dark:border-white/8 border-gray-200 dark:text-gray-400 text-gray-500 mb-3 inline-block">
                                            {post.tag}
                                        </span>
                                        <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-3">{post.title}</h3>
                                        <div className="text-xs dark:text-gray-500 text-gray-500 flex items-center gap-2">
                                            <span>{post.date}</span>
                                            <span>·</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
