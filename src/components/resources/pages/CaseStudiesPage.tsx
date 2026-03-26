"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    ArrowLeft,
    Building2,
    HeartPulse,
    Landmark,
    Factory,
    Cpu,
    ShoppingBag,
    Zap,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";

interface CaseStudy {
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
    'Financial Services': Building2,
    'Healthcare': HeartPulse,
    'Government': Landmark,
    'Manufacturing': Factory,
    'Technology': Cpu,
    'Retail': ShoppingBag,
    'Energy': Zap,
    'General': FileText,
};

export default function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
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

    const fetchCaseStudies = useCallback(async () => {
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
            
            const res = await fetch(`/api/case-studies?${params.toString()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch case studies');
            }
            
            const data = await res.json();
            setCaseStudies(data.caseStudies);
            setPagination(prev => ({
                ...prev,
                total: data.pagination?.total || data.caseStudies.length,
                total_pages: data.pagination?.total_pages || 1
            }));
            if (!selectedCategory && data.categories) {
                setCategories(data.categories);
            }
        } catch {
            // Case studies fetch error shown to user via state
            setError('Failed to load case studies. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, selectedCategory]);

    useEffect(() => {
        fetchCaseStudies();
    }, [fetchCaseStudies]);

    const handleDownload = (study: CaseStudy) => {
        window.open(study.pdf_url, '_blank');
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
        <div className="bg-[#f8fbff] min-h-screen relative overflow-hidden pt-32 pb-24">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
                <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
            </div>

            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <BlurFade delay={0.1}>
                    <div className="flex justify-center mb-6">
                        <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4c69e4] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-inter font-medium tracking-wide">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Resources</span>
                        </Link>
                    </div>
                </BlurFade>

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <BlurFade delay={0.2}>
                        <div className="flex justify-center mb-4">
                            <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                                SUCCESS STORIES
                            </span>
                        </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.3}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
                            Customer <span className="text-[#4c69e4]">Case Studies</span>
                        </h1>
                    </BlurFade>
                    
                    <BlurFade delay={0.4}>
                        <p className="text-lg text-slate-600 font-inter leading-relaxed">
                            Real-world success stories showcasing how leading organizations across industries have strengthened their security posture with ZecurX solutions.
                        </p>
                    </BlurFade>
                </div>

                <div className="grid lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <BlurFade delay={0.5}>
                            <div className="lg:sticky lg:top-32 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
                                <h3 className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-widest mb-4 font-space-grotesk">
                                    INDUSTRIES
                                </h3>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => handleCategoryClick(null)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-left ${
                                            selectedCategory === null 
                                                ? 'bg-[#4c69e4]/10 text-[#4c69e4] font-medium' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-[#0c1a2e]'
                                        }`}
                                    >
                                        <span className="text-sm font-inter flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            All Industries
                                        </span>
                                        <span className={`text-xs ${selectedCategory === null ? 'text-[#4c69e4]' : 'text-slate-400'}`}>
                                            {pagination.total}
                                        </span>
                                    </button>
                                    {categories.map((cat) => {
                                        const CatIcon = getIconForCategory(cat.label);
                                        return (
                                            <button
                                                key={cat.label}
                                                onClick={() => handleCategoryClick(cat.label)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-left ${
                                                    selectedCategory === cat.label 
                                                        ? 'bg-[#4c69e4]/10 text-[#4c69e4] font-medium' 
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0c1a2e]'
                                                }`}
                                            >
                                                <span className="text-sm font-inter flex items-center gap-2">
                                                    <CatIcon className="w-4 h-4" />
                                                    {cat.label}
                                                </span>
                                                <span className={`text-xs ${selectedCategory === cat.label ? 'text-[#4c69e4]' : 'text-slate-400'}`}>
                                                    {cat.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </BlurFade>
                    </div>

                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-[#4c69e4]" />
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-3xl border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <p className="text-slate-600 font-inter">{error}</p>
                            </div>
                        ) : caseStudies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-3xl border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] p-8">
                                <FileText className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-[#0c1a2e] font-manrope">No case studies available</h3>
                                <p className="text-slate-500 mt-1 font-inter">
                                    {selectedCategory 
                                        ? `No case studies found in "${selectedCategory}"` 
                                        : 'Check back soon for new case studies'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {caseStudies.map((study, i) => {
                                        const IconComponent = getIconForCategory(study.category);
                                        return (
                                            <BlurFade key={study.id} delay={0.2 + (i * 0.1)}>
                                                <div className="glass-card h-full flex flex-col rounded-3xl p-8 border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)] bg-white/50 hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors" />
                                                    
                                                    <div className="relative z-10 flex flex-col h-full">
                                                        <div className="flex items-start justify-between mb-6">
                                                            {study.cover_image_url ? (
                                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                                                                    <Image
                                                                        src={study.cover_image_url}
                                                                        alt={study.title}
                                                                        fill
                                                                        className="object-cover"
                                                                        unoptimized
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-14 h-14 rounded-2xl bg-[#f8fbff] border border-blue-100 flex items-center justify-center text-[#4c69e4] group-hover:scale-110 transition-transform duration-300">
                                                                    <IconComponent className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                            {study.pages > 0 && (
                                                                <span className="text-[11px] font-space-grotesk font-semibold tracking-widest text-[#4c69e4] uppercase bg-blue-50 px-3 py-1 rounded-full">
                                                                    {study.pages} pages
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-xs font-inter font-medium text-slate-500 mb-3 block">{study.category}</span>

                                                        <h3 className="text-xl font-manrope font-bold text-[#0c1a2e] mb-4 group-hover:text-[#4c69e4] transition-colors leading-tight">
                                                            {study.title}
                                                        </h3>

                                                        <p className="text-slate-600 font-inter text-[14px] leading-relaxed mb-8 line-clamp-3 flex-grow">
                                                            {study.summary}
                                                        </p>

                                                        <button 
                                                            onClick={() => handleDownload(study)}
                                                            className="w-full relative inline-flex items-center justify-center gap-2 bg-white text-[#0c1a2e] rounded-full px-6 py-3 text-sm font-semibold font-inter cursor-pointer border border-slate-200 hover:border-[#4c69e4] hover:text-[#4c69e4] hover:bg-[#f8fbff] transition-all duration-200 shadow-sm mt-auto"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download Study
                                                        </button>
                                                    </div>
                                                </div>
                                            </BlurFade>
                                        );
                                    })}
                                </div>

                                {pagination.total_pages > 1 && (
                                    <div className="mt-16 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0c1a2e] hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        {renderPaginationNumbers()}
                                        
                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.total_pages}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0c1a2e] hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {pagination.total > 0 && (
                                    <p className="text-center text-sm font-inter text-slate-500 mt-6">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} case studies
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
