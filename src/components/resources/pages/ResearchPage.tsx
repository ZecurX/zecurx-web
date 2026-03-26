"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Search,
    Shield,
    Globe,
    Lock,
    Database,
    Filter,
    TrendingUp,
    Building2,
    Code2,
    ChevronRight,
    List,
    LayoutGrid,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EnrichedStory } from "@/lib/hacker-news";
import { BlurFade } from "@/components/ui/blur-fade";

interface ResearchPageProps {
    initialStories: EnrichedStory[];
}

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'Threat Intelligence', label: 'Threats', icon: Shield },
    { id: 'Vulnerabilities', label: 'Vulns', icon: Search },
    { id: 'Data Breaches', label: 'Breaches', icon: Database },
    { id: 'Crypto & Privacy', label: 'Crypto', icon: Lock },
    { id: 'App Security', label: 'AppSec', icon: Code2 },
    { id: 'Industry News', label: 'Industry', icon: Building2 },
    { id: 'General Security', label: 'General', icon: Filter },
];

export default function ResearchPage({ initialStories = [] }: ResearchPageProps) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredStories = useMemo(() => {
        return initialStories.filter(story => {
            const matchesCategory = activeCategory === 'all' 
                ? true 
                : story.categories.includes(activeCategory);
            
            const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (story.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            return matchesCategory && matchesSearch;
        });
    }, [initialStories, activeCategory, searchQuery]);

    const paginatedStories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStories, currentPage]);

    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getRelativeTime = (timestamp: number) => {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
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

                <div className="text-center max-w-4xl mx-auto mb-16">
                    <BlurFade delay={0.2}>
                        <div className="flex justify-center mb-4">
                            <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                                THREAT RESEARCH
                            </span>
                        </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.3}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
                            Global Threat <span className="text-[#4c69e4]">Intelligence</span>
                        </h1>
                    </BlurFade>
                    
                    <BlurFade delay={0.4}>
                        <p className="text-lg text-slate-600 font-inter leading-relaxed max-w-2xl mx-auto">
                            Real-time cybersecurity news, vulnerability disclosures, and research analysis curated from verified sources.
                        </p>
                    </BlurFade>
                </div>

                <BlurFade delay={0.5}>
                    <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between sticky top-24 z-30 bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-slate-200/60 shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:flex-1 lg:w-auto min-w-0 pr-4">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-inter font-medium transition-all whitespace-nowrap border
                                        ${activeCategory === cat.id 
                                            ? 'bg-[#4c69e4] text-white border-transparent shadow-md' 
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#0c1a2e]'
                                        }
                                    `}
                                >
                                    <cat.icon className="w-3.5 h-3.5" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-3 lg:pt-0">
                            <div className="relative flex-1 lg:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search intelligence..." 
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:border-[#4c69e4] focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/20 text-sm font-inter transition-all placeholder:text-slate-400 text-[#0c1a2e]"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-200">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-[#4c69e4] shadow-sm' : 'text-slate-400 hover:text-[#0c1a2e]'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-[#4c69e4] shadow-sm' : 'text-slate-400 hover:text-[#0c1a2e]'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </BlurFade>

                <motion.div 
                    layout
                    className={`
                        grid gap-6
                        ${viewMode === 'grid' 
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1 max-w-4xl mx-auto"
                        }
                    `}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {paginatedStories.map((story) => (
                            <motion.div
                                key={story.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                                transition={{ 
                                    opacity: { duration: 0.2 },
                                    layout: { duration: 0.3, ease: "easeOut" }
                                }}
                                className={`
                                    group glass-card relative flex border border-slate-200/60 bg-white/50 hover:bg-white transition-all duration-300 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] hover:-translate-y-1 overflow-hidden
                                    ${viewMode === 'grid' 
                                        ? 'flex-col justify-between p-8 rounded-3xl h-full' 
                                        : 'flex-col md:flex-row md:items-start justify-between p-6 md:p-8 rounded-3xl gap-6'
                                    }
                                `}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c69e4]/5 blur-[40px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors pointer-events-none" />
                                
                                <motion.div layout className={`relative z-10 ${viewMode === 'list' ? 'flex-1 min-w-0' : 'w-full'}`}>
                                    <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
                                        <span className="flex items-center gap-1.5 font-space-grotesk font-semibold tracking-wide text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#4c69e4]"></span>
                                            {story.domain || 'Direct Source'}
                                        </span>
                                        <span className="text-slate-400 font-inter">
                                            {getRelativeTime(story.time)}
                                        </span>
                                        {story.score > 50 && (
                                            <span className="flex items-center gap-1 text-[#f59e0b] font-inter font-medium bg-[#fef3c7] px-2 py-1 rounded-full">
                                                <TrendingUp className="w-3 h-3" />
                                                Trending
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`font-manrope font-bold text-[#0c1a2e] group-hover:text-[#4c69e4] transition-colors leading-snug ${viewMode === 'grid' ? 'text-xl mb-4' : 'text-2xl mb-3'}`}>
                                        <a 
                                            href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="focus:outline-none"
                                        >
                                            <span className="absolute inset-0 z-0" aria-hidden="true" />
                                            {story.title}
                                        </a>
                                    </h3>

                                    {story.text && (
                                        <p className="text-[15px] font-inter text-slate-600 line-clamp-2 mb-6 leading-relaxed">
                                            {story.text}
                                        </p>
                                    )}
                                    
                                    <div className={`flex flex-wrap gap-2 ${viewMode === 'grid' ? 'mt-auto pt-4' : 'mt-auto'}`}>
                                        {story.categories.map(cat => (
                                            <span key={cat} className="text-[11px] font-space-grotesk font-semibold tracking-widest text-[#4c69e4] uppercase bg-blue-50 px-3 py-1.5 rounded-full">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div layout className={`relative z-10 flex items-center gap-4 ${viewMode === 'list' ? 'shrink-0 self-center' : 'mt-6 border-t border-slate-100 pt-6 justify-between w-full'}`}>
                                    {viewMode === 'list' && (
                                        <div className="hidden md:block w-0" />
                                    )}
                                    
                                    <a 
                                        href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 text-[#0c1a2e] hover:text-[#4c69e4] transition-colors text-[13px] font-inter font-semibold z-10 bg-white px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#4c69e4] hover:bg-[#f8fbff] shadow-sm cursor-pointer ${viewMode === 'grid' ? 'w-full justify-center' : ''}`}
                                    >
                                        <span>Read Article</span>
                                        <ArrowLeft className="w-3.5 h-3.5 rotate-[135deg]" />
                                    </a>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredStories.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-slate-300 rounded-3xl bg-white/50 max-w-4xl mx-auto">
                        <div className="w-16 h-16 rounded-full bg-[#f8fbff] border border-blue-100 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-6 h-6 text-[#4c69e4]" />
                        </div>
                        <h3 className="text-xl font-manrope font-bold text-[#0c1a2e] mb-2">No intelligence found</h3>
                        <p className="text-[15px] font-inter text-slate-500 max-w-sm mx-auto mb-8">
                            We couldn't find any reports matching your current filter criteria.
                        </p>
                        <Button 
                            variant="outline" 
                            className="rounded-full bg-white border-slate-200 text-[#0c1a2e] hover:bg-slate-50 font-inter px-6"
                            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0c1a2e] hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {getPageNumbers().map((page, i) => (
                            <React.Fragment key={i}>
                                {page === '...' ? (
                                    <span className="text-slate-400 font-inter px-2">...</span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page as number)}
                                        className={`
                                            w-10 h-10 rounded-full text-[15px] font-inter font-medium transition-all flex items-center justify-center
                                            ${currentPage === page 
                                                ? 'bg-[#4c69e4] text-white shadow-md' 
                                                : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0c1a2e] hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
