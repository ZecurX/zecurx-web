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
        <>
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 border-b border-white/[0.08]">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-xs font-mono tracking-widest uppercase bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.05] hover:bg-white/[0.1]">
                            <ArrowLeft className="w-3 h-3" />
                            <span>Resources / Intelligence</span>
                        </Link>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground mb-8 leading-[1.1]">
                            Global Threat <br />
                            Intelligence.
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                            Real-time cybersecurity news, vulnerability disclosures, and research analysis curated from verified sources.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full py-8 bg-background text-foreground min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    
                    <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between sticky top-24 z-30 bg-background/95 backdrop-blur-xl p-3 md:p-4 rounded-xl border border-white/[0.08] shadow-sm">
                        
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:flex-1 lg:w-auto min-w-0 mask-linear-fade pr-4">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border
                                        ${activeCategory === cat.id 
                                            ? 'bg-white text-black border-white shadow-sm' 
                                            : 'bg-transparent text-muted-foreground border-transparent hover:bg-white/[0.05] hover:text-foreground'
                                        }
                                    `}
                                >
                                    <cat.icon className="w-3.5 h-3.5" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 lg:pl-2">
                            <div className="relative flex-1 lg:w-56">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-white/[0.2] focus:outline-none focus:ring-0 text-sm transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <div className="flex items-center gap-1 pl-1">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/[0.1] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/[0.1] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <motion.div 
                        layout
                        className={`
                            grid gap-4
                            ${viewMode === 'grid' 
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                                : "grid-cols-1"
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
                                        group relative flex border border-border bg-card hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md
                                        ${viewMode === 'grid' 
                                            ? 'flex-col justify-between p-6 rounded-xl h-full' 
                                            : 'flex-col md:flex-row md:items-start justify-between p-6 rounded-lg gap-6'
                                        }
                                    `}
                                >
                                    <motion.div layout className={viewMode === 'list' ? 'flex-1 min-w-0' : 'w-full'}>
                                        <div className={`flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3`}>
                                            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/20"></span>
                                                {story.domain || 'Direct Source'}
                                            </span>
                                            <span className="text-muted-foreground/30">•</span>
                                            <span className="flex items-center gap-1">
                                                {getRelativeTime(story.time)}
                                            </span>
                                            {story.score > 50 && (
                                                <>
                                                    <span className="text-muted-foreground/30">•</span>
                                                    <span className="flex items-center gap-1 text-foreground font-medium">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Trending
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <h3 className={`font-semibold text-foreground group-hover:text-primary/80 transition-colors leading-snug ${viewMode === 'grid' ? 'text-lg mb-4' : 'text-xl mb-3'}`}>
                                            <a 
                                                href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus:outline-none"
                                            >
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                {story.title}
                                            </a>
                                        </h3>

                                        {story.text && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 max-w-3xl leading-relaxed">
                                                {story.text}
                                            </p>
                                        )}
                                        
                                        {viewMode === 'grid' && (
                                            <motion.div layout className="flex flex-wrap gap-2 mt-auto pt-4">
                                                {story.categories.map(cat => (
                                                    <span key={cat} className="text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded bg-muted text-muted-foreground border border-border">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </motion.div>
                                        )}
                                        
                                        {viewMode === 'list' && (
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {story.categories.map(cat => (
                                                    <span key={cat} className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded bg-muted text-muted-foreground border border-border">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.div layout className={`flex items-center gap-4 ${viewMode === 'list' ? 'shrink-0 self-center' : 'mt-6 border-t border-border/50 pt-4 justify-between w-full'}`}>
                                        {viewMode === 'list' && (
                                            <div className="hidden md:block w-0" />
                                        )}
                                        
                                        <a 
                                            href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors text-xs font-medium z-10 bg-muted/50 px-4 py-2 rounded-full border border-border hover:bg-muted hover:border-foreground/20 cursor-pointer ${viewMode === 'grid' ? 'w-full justify-center' : ''}`}
                                        >
                                            <span>Read Article</span>
                                            <ArrowLeft className="w-3 h-3 rotate-[135deg]" />
                                        </a>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredStories.length === 0 && (
                        <div className="text-center py-24 border border-dashed border-white/[0.1] rounded-xl bg-white/[0.02]">
                            <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                                <Search className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-1">No intelligence found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                                We couldn't find any reports matching your current filter criteria.
                            </p>
                            <Button 
                                variant="outline" 
                                className="h-8 text-xs"
                                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-foreground"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {getPageNumbers().map((page, i) => (
                                <React.Fragment key={i}>
                                    {page === '...' ? (
                                        <span className="text-muted-foreground text-sm px-2">...</span>
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(page as number)}
                                            className={`
                                                w-8 h-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center
                                                ${currentPage === page 
                                                    ? 'bg-white text-black font-bold' 
                                                    : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
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
                                className="p-2 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-foreground"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}
