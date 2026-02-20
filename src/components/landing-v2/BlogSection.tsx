"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatBlogDate, calculateReadingTime } from "@/lib/blog-utils";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url?: string;
    published_at: string;
    labels?: Record<string, unknown>[];
}

export default function BlogSection({ posts }: { posts: Post[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    if (!posts || posts.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden py-24 md:py-32">
            {/* Perimeter glow */}
            <PerimeterGlow />

            <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] block mb-6">
                            Insights
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-medium text-white tracking-[-0.03em] leading-[1.1]">
                            Latest from
                            <br />
                            <span className="text-white/40">the research lab.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link
                            href="/blog"
                            className="group flex items-center gap-3 text-sm font-manrope font-semibold text-white/50 hover:text-white transition-colors duration-300"
                        >
                            View All Research
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
                    {posts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.7,
                                delay: 0.3 + i * 0.12,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group relative block bg-black h-full flex flex-col hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden"
                            >
                                {/* Image Wrap */}
                                <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                    {post.featured_image_url ? (
                                        <Image
                                            src={post.featured_image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                                            <span className="text-white/10 italic text-sm">No Preview</span>
                                        </div>
                                    )}
                                    {/* Overlay shadow */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-10 flex-1 flex flex-col">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/25 mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatBlogDate(post.published_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            <span>{calculateReadingTime(post.content)}m reading</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-manrope font-medium text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight mb-4">
                                        {post.title}
                                    </h3>

                                    <p className="text-sm text-white/30 leading-relaxed font-inter line-clamp-2 mb-8">
                                        {post.excerpt || post.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}
                                    </p>

                                    <div className="mt-auto pt-6 flex items-center gap-2 text-white/10 group-hover:text-white/60 transition-colors duration-300">
                                        <span className="text-xs font-mono uppercase tracking-widest">Read Article</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PerimeterGlow() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <div
                className="absolute inset-y-0 left-0 w-[80px]"
                style={{
                    background: "linear-gradient(to right, rgba(30,80,220,0.08), transparent)",
                }}
            />
            <div
                className="absolute inset-y-0 right-0 w-[80px]"
                style={{
                    background: "linear-gradient(to left, rgba(30,80,220,0.08), transparent)",
                }}
            />
        </div>
    );
}
