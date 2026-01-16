"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    User,
    Loader2,
    FileText,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string | null;
    published_at: string | null;
    view_count: number;
    author: {
        id: string;
        email: string;
        name: string | null;
    } | null;
    labels: {
        id: string;
        name: string;
        slug: string;
        color: string;
    }[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

interface Label {
    id: string;
    name: string;
    slug: string;
    color: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 9,
        total: 0,
        total_pages: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [labels, setLabels] = useState<Label[]>([]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            
            if (selectedLabel) {
                params.append('label', selectedLabel);
            }

            const res = await fetch(`/api/blog?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, selectedLabel]);

    const fetchLabels = async () => {
        try {
            const res = await fetch('/api/blog/labels');
            if (res.ok) {
                const data = await res.json();
                setLabels(data);
            }
        } catch (error) {
            console.error('Failed to fetch labels:', error);
        }
    };

    useEffect(() => {
        fetchLabels();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const handleLabelClick = (labelSlug: string | null) => {
        setSelectedLabel(labelSlug);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getReadingTime = (excerpt: string | null) => {
        if (!excerpt) return '3 min read';
        const words = excerpt.split(/\s+/).length;
        const time = Math.max(1, Math.ceil(words / 200));
        return `${time} min read`;
    };

    const renderPaginationNumbers = () => {
        const pages = [];
        const { page, total_pages } = pagination;
        
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(total_pages, page + 2);
        
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(total_pages, startPage + 4);
            } else if (endPage === total_pages) {
                startPage = Math.max(1, endPage - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                        i === page
                            ? 'bg-foreground text-background'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        return pages;
    };

    return (
        <>
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 border-b border-white/[0.08]">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-xs font-mono tracking-widest uppercase bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.05] hover:bg-white/[0.1]">
                            <ArrowLeft className="w-3 h-3" />
                            <span>Resources / Blog</span>
                        </Link>

                        <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground mb-8 leading-[1.1]">
                            ZecurX <br />
                            Blog.
                        </h1>

                        <p className="text-center text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Stay ahead of the curve with expert analysis on the dynamic cybersecurity landscape. Our engineers and analysts break down the latest threat vectors, industry trends, and defensive strategies.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full py-24 bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-32">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                    TOPICS
                                </h3>
                                <div className="space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                            selectedLabel === null 
                                                ? 'bg-primary/10 text-foreground' 
                                                : 'hover:bg-muted/50'
                                        }`}
                                        onClick={() => handleLabelClick(null)}
                                    >
                                        <span className="text-sm font-medium">All Posts</span>
                                        <span className="text-xs text-muted-foreground">{pagination.total}</span>
                                    </motion.div>
                                    {labels.map((label, i) => (
                                        <motion.div
                                            key={label.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (i + 1) * 0.05 }}
                                            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                                selectedLabel === label.slug 
                                                    ? 'bg-primary/10 text-foreground' 
                                                    : 'hover:bg-muted/50'
                                            }`}
                                            onClick={() => handleLabelClick(label.slug)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-2 h-2 rounded-full" 
                                                    style={{ backgroundColor: label.color }}
                                                />
                                                <span className="text-sm font-medium text-foreground">{label.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground">No posts available</h3>
                                    <p className="text-muted-foreground mt-1">
                                        {selectedLabel 
                                            ? 'No posts found with this label' 
                                            : 'Check back soon for new articles'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {posts.map((post, i) => (
                                            <motion.article
                                                key={post.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Link 
                                                    href={`/blog/${post.slug}`}
                                                    className="group block p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {post.featured_image_url && (
                                                            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                                                                <Image
                                                                    src={post.featured_image_url}
                                                                    alt={post.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                                {post.labels.map(label => (
                                                                    <span 
                                                                        key={label.id}
                                                                        className="px-3 py-1 text-xs font-medium rounded-full text-white"
                                                                        style={{ backgroundColor: label.color }}
                                                                    >
                                                                        {label.name}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <h2 className="text-xl md:text-2xl font-manrope font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                                                                {post.title}
                                                            </h2>

                                                            {post.excerpt && (
                                                                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                                                                    {post.excerpt}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                {post.author?.name && (
                                                                    <div className="flex items-center gap-2">
                                                                        <User className="w-4 h-4" />
                                                                        <span>{post.author.name}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{getReadingTime(post.excerpt)}</span>
                                                                </div>
                                                                <span>{formatDate(post.published_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.article>
                                        ))}
                                    </div>

                                    {pagination.total_pages > 1 && (
                                        <div className="mt-12 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            
                                            {renderPaginationNumbers()}
                                            
                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.total_pages}
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                    {pagination.total > 0 && (
                                        <p className="text-center text-sm text-muted-foreground mt-4">
                                            Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} articles
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
