"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronDown, Shield, Globe, Lock, Cpu, Eye,
    Zap, Cloud, KeyRound, Code, Target, Brain, Settings, ShieldCheck,
    Building2, Landmark, GraduationCap, Rocket, Heart, Coins,
    Users, Award, CheckCircle, GitCompare, FileText,
    BookOpen, FileSearch, Lightbulb, BookMarked, Video,
    ArrowRight, Menu, X, Terminal, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

// Navigation Data with descriptions
const navData = {
    platform: {
        label: "Platform",
        href: "/platform",
        description: "Unified security architecture",
        items: [
            { icon: Shield, title: "Endpoint Security", href: "/platform/endpoint-security", desc: "Behavior-based protection" },
            { icon: Cloud, title: "Cloud Security", href: "/platform/cloud-security", desc: "Multi-cloud visibility" },
            { icon: KeyRound, title: "Identity Security", href: "/platform/identity-security", desc: "Zero trust access" },
            { icon: Code, title: "Application Security", href: "/platform/application-security", desc: "Secure SDLC" },
            { icon: Target, title: "Threat Intelligence", href: "/platform/threat-intelligence", desc: "Proactive hunting" },
            { icon: Brain, title: "AI Detection", href: "/platform/ai-detection", desc: "ML-powered analytics" },
        ]
    },
    solutions: {
        label: "Solutions",
        href: "/solutions",
        description: "Tailored security strategies",
        items: [
            { icon: Zap, title: "Digital Transformation", href: "/solutions/digital-transformation", desc: "Secure modernization" },
            { icon: Brain, title: "AI-Powered SOC", href: "/solutions/ai-powered-soc", desc: "Intelligent operations" },
            { icon: Lock, title: "Zero Trust", href: "/solutions/zero-trust", desc: "Never trust, verify" },
            { icon: Shield, title: "Ransomware Defense", href: "/solutions/ransomware-defense", desc: "Complete protection" },
            { icon: FileText, title: "Compliance", href: "/solutions/compliance", desc: "Regulatory adherence" },
        ]
    },
    services: {
        label: "Services",
        href: "/services",
        description: "Expert security services",
        items: [
            { icon: Target, title: "Penetration Testing", href: "/services/offensive/penetration-testing", desc: "Adversary simulation" },
            { icon: Eye, title: "Vulnerability Management", href: "/services/offensive/vulnerability-management", desc: "Risk prioritization" },
            { icon: Code, title: "Secure Development", href: "/services/engineering/secure-development", desc: "Build secure apps" },
            { icon: Settings, title: "DevSecOps", href: "/services/engineering/devsecops", desc: "Security automation" },
            { icon: Terminal, title: "VulnHunter Suite", href: "/tools", desc: "Free security tools" },
        ]
    },
    resources: {
        label: "Resources",
        href: "/resources",
        description: "Learn and explore",
        items: [
            { icon: BookOpen, title: "Blog", href: "/resources/blog", desc: "Latest insights" },
            { icon: FileSearch, title: "Whitepapers", href: "/resources/whitepapers", desc: "Deep dives" },
            { icon: Lightbulb, title: "Research", href: "/resources/research", desc: "Security research" },
            { icon: Video, title: "Webinars", href: "/resources/webinars", desc: "On-demand learning" },
        ]
    },
};

export default function CreativeNavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const handleNavigation = (href: string) => {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        router.push(href);
    };

    const handleMouseEnter = (key: string) => {
        // Cancel any pending close
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setActiveDropdown(key);
    };

    const handleMouseLeave = () => {
        // Delay closing to allow mouse to move to dropdown
        closeTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150); // 150ms delay
    };

    const handleDropdownEnter = () => {
        // Cancel close when entering dropdown
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-6 left-1/2 z-50 transition-all duration-300",
                    "w-[92%] lg:w-fit",
                    "rounded-full border border-white/10 dark:border-white/5",
                    "bg-white/80 dark:bg-black/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/40",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
                    isScrolled && "top-4 bg-white/90 dark:bg-black/80 border-white/20 dark:border-white/10 shadow-xl"
                )}
                onMouseLeave={handleMouseLeave}
            >
                <div className="px-5 pr-3 h-14 flex items-center justify-between gap-6 lg:gap-2">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 mr-6 group relative">
                            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                                <Image
                                    src="/images/zecurx-logo.png"
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                    sizes="32px"
                                    priority
                                />
                            </div>
                            <span className="text-foreground font-manrope font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                                ZecurX
                            </span>
                        </Link>

                        {/* Center Navigation */}
                        <div className="flex items-center p-1 rounded-full bg-muted/5 border border-white/5">
                            {Object.entries(navData).map(([key, data]) => (
                                <div key={key} className="relative">
                                    <button
                                        className={cn(
                                            "relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer",
                                            activeDropdown === key
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                        onMouseEnter={() => handleMouseEnter(key)}
                                        onClick={() => handleNavigation(data.href)}
                                    >
                                        {data.label}
                                        <ChevronDown className={cn(
                                            "w-3 h-3 transition-transform duration-300",
                                            activeDropdown === key && "rotate-180"
                                        )} />
                                    </button>
                                    {activeDropdown === key && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-background shadow-sm rounded-full border border-border/50"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="w-px h-4 bg-border/20 mx-2" />
                            <Link
                                href="/why-zecurx"
                                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/10"
                            >
                                Why ZecurX
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-3 pl-2">
                        <ThemeToggle />
                        <Link
                            href="/contact"
                            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <span className="relative z-10">Get Demo</span>
                            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </Link>
                    </div>

                    {/* Mobile Navigation Header */}
                    <div className="lg:hidden flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/zecurx-logo.png"
                                alt="ZecurX"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                            <span className="text-foreground font-manrope font-bold text-lg">ZecurX</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2.5 text-foreground cursor-pointer bg-muted/10 hover:bg-muted/20 rounded-full transition-colors border border-border/10"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Redesigned Floating Dropdown */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96, x: "-50%", filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%", filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 8, scale: 0.96, x: "-50%", filter: "blur(2px)" }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-[calc(100%+12px)] left-1/2 w-[600px] lg:w-[800px]"
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="relative bg-background/80 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden p-2">
                                <DropdownContent
                                    data={navData[activeDropdown as keyof typeof navData]}
                                    onNavigate={handleNavigation}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {
                    mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-28 overflow-y-auto lg:hidden"
                        >
                            <div className="px-6 pb-20 space-y-8">
                                {Object.entries(navData).map(([key, data]) => (
                                    <div key={key} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={data.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-xl font-bold text-foreground"
                                            >
                                                {data.label}
                                            </Link>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{data.items.length} Items</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {data.items.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-transparent active:scale-[0.98] transition-all"
                                                >
                                                    <div className="p-2.5 rounded-lg bg-background shadow-sm text-primary">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{item.title}</div>
                                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-6 border-t border-border space-y-4">
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background font-bold text-lg rounded-xl"
                                    >
                                        Contact Sales
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Backdrop */}
            <AnimatePresence>
                {
                    activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-30 bg-black/5 dark:bg-black/20 backdrop-blur-[1px]"
                            onClick={() => setActiveDropdown(null)}
                        />
                    )
                }
            </AnimatePresence >
        </>
    );
}

interface DropdownContentProps {
    data: {
        label: string;
        href: string;
        description: string;
        items: { icon: any; title: string; href: string; desc: string }[];
    };
    onNavigate: (href: string) => void;
}

function DropdownContent({ data, onNavigate }: DropdownContentProps) {
    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar / Highlight */}
            <div className="lg:w-1/3 bg-muted/30 p-6 rounded-2xl flex flex-col justify-between m-1">
                <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                            {data.label}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {data.description}. Explore our comprehensive suite of {data.label.toLowerCase()} tailored for modern enterprises.
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => onNavigate(data.href)}
                    className="group flex items-center gap-2 text-sm font-semibold text-primary mt-6 hover:opacity-80 transition-opacity"
                >
                    View All {data.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            {/* Grid of Items */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-2">
                {data.items.map((item, index) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.href);
                        }}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                    >
                        <div className="mt-1 p-1.5 rounded-lg bg-muted/20 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                            </div>
                            <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-0.5">
                                {item.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

