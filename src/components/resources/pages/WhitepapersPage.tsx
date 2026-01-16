"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    ArrowLeft,
    Shield,
    Cloud,
    Lock,
    Server,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface Whitepaper {
    id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    pages: number;
    cover_image_url: string | null;
    pdf_url: string;
    published_at: string | null;
    download_count: number;
}

interface Category {
    label: string;
    count: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

const categoryIcons: Record<string, React.ElementType> = {
    'Zero Trust Security': Lock,
    'Cloud Compliance': Cloud,
    'Threat Intelligence': Shield,
    'Data Protection': Server,
    'Incident Response': Shield,
    'API Security': Server,
    'General': FileText,
};

export default function WhitepapersPage() {
    const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 8,
        total: 0,
        total_pages: 0
    });

    const fetchWhitepapers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }
            
            const res = await fetch(`/api/whitepapers?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch whitepapers');
            }
            
            const data = await res.json();
            setWhitepapers(data.whitepapers);
            setPagination(prev => ({
                ...prev,
                total: data.pagination?.total || data.whitepapers.length,
                total_pages: data.pagination?.total_pages || 1
            }));
            if (!selectedCategory && data.categories) {
                setCategories(data.categories);
            }
        } catch (err) {
            setError('Failed to load whitepapers. Please try again later.');
            console.error('Error fetching whitepapers:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, selectedCategory]);

    useEffect(() => {
        fetchWhitepapers();
    }, [fetchWhitepapers]);

    const handleDownload = (paper: Whitepaper) => {
        window.open(paper.pdf_url, '_blank');
    };

    const getIconForCategory = (category: string) => {
        return categoryIcons[category] || FileText;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (category: string | null) => {
        setSelectedCategory(category);
        setPagination(prev => ({ ...prev, page: 1 }));
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
                            <span>Resources / Whitepapers</span>
                        </Link>

                        <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground mb-8 leading-[1.1]">
                            Technical <br />
                            Whitepapers.
                        </h1>

                        <p className="text-center text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            Deep-dive technical documents and strategic reports that provide comprehensive insights into complex security challenges, architecture best practices, and industry compliance.
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
                                    CATEGORIES
                                </h3>
                                <div className="space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                            selectedCategory === null 
                                                ? 'bg-primary/10 text-foreground' 
                                                : 'hover:bg-muted/50'
                                        }`}
                                        onClick={() => handleCategoryClick(null)}
                                    >
                                        <span className="text-sm font-medium">All Whitepapers</span>
                                        <span className="text-xs text-muted-foreground">
                                            {pagination.total}
                                        </span>
                                    </motion.div>
                                    {categories.map((cat, i) => (
                                        <motion.div
                                            key={cat.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (i + 1) * 0.1 }}
                                            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                                selectedCategory === cat.label 
                                                    ? 'bg-primary/10 text-foreground' 
                                                    : 'hover:bg-muted/50'
                                            }`}
                                            onClick={() => handleCategoryClick(cat.label)}
                                        >
                                            <span className="text-sm font-medium text-foreground">{cat.label}</span>
                                            <span className="text-xs text-muted-foreground">{cat.count}</span>
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
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">{error}</p>
                                </div>
                            ) : whitepapers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground">No whitepapers available</h3>
                                    <p className="text-muted-foreground mt-1">
                                        {selectedCategory 
                                            ? `No whitepapers found in "${selectedCategory}"` 
                                            : 'Check back soon for new technical documents'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {whitepapers.map((paper, i) => {
                                            const IconComponent = getIconForCategory(paper.category);
                                            return (
                                                <motion.div
                                                    key={paper.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        {paper.cover_image_url ? (
                                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                                                                <Image
                                                                    src={paper.cover_image_url}
                                                                    alt={paper.title}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                                                <IconComponent className="w-5 h-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        {paper.pages > 0 && (
                                                            <span className="text-xs text-muted-foreground">{paper.pages} pages</span>
                                                        )}
                                                    </div>

                                                    <span className="text-xs text-muted-foreground mb-2 block">{paper.category}</span>

                                                    <h3 className="text-xl font-manrope font-semibold text-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                                                        {paper.title}
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                                                        {paper.summary}
                                                    </p>

                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="rounded-full gap-2"
                                                        onClick={() => handleDownload(paper)}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download PDF
                                                    </Button>
                                                </motion.div>
                                            );
                                        })}
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
                                            Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} whitepapers
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
