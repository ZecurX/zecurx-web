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
    ArrowRight, Menu, X, Terminal
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
            { icon: BookOpen, title: "Blog", href: "/blog", desc: "Latest insights" },
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
            <nav
                className={cn(
                    "fixed top-4 lg:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
                    "w-[95%] lg:w-auto",
                    "rounded-full border border-border/10",
                    "bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20",
                    "shadow-lg shadow-black/5"
                )}
                onMouseLeave={handleMouseLeave}
            >
                <div className="px-4 pr-2 lg:px-6 h-14 lg:h-14 flex items-center justify-between gap-4 lg:gap-8">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 mr-4">
                            <div className="relative w-7 h-7">
                                <Image
                                    src="/images/zecurx-logo.png"
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                    sizes="28px"
                                    priority
                                />
                            </div>
                            <span className="text-foreground font-manrope font-bold text-lg tracking-tight">ZecurX</span>
                        </Link>

                        {/* Center Navigation */}
                        <div className="flex items-center gap-1">
                            {Object.entries(navData).map(([key, data]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer",
                                        activeDropdown === key
                                            ? "text-foreground bg-muted/50"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    )}
                                    onMouseEnter={() => handleMouseEnter(key)}
                                    onClick={() => handleNavigation(data.href)}
                                >
                                    {data.label}
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-200 opacity-50",
                                        activeDropdown === key && "rotate-180 opacity-100"
                                    )} />
                                </button>
                            ))}
                            <Link
                                href="/why-zecurx"
                                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-full transition-all whitespace-nowrap"
                            >
                                Why ZecurX
                            </Link>
                            <Link
                                href="/industries"
                                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-full transition-all"
                            >
                                Industries
                            </Link>
                        </div>

                        {/* SECONDARY NAVIGATION */}
                        <div className="flex items-center gap-4 pl-4 border-l border-border/10">
                            <Link href="/shop" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
                                Shop
                            </Link>
                            <Link href="/academy" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
                                Academy
                            </Link>
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <Link
                                    href="/contact"
                                    className="px-5 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/zecurx-logo.png"
                                alt="ZecurX"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <span className="text-foreground font-manrope font-bold text-base">ZecurX</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-foreground cursor-pointer hover:bg-muted/20 rounded-full transition-colors"
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
                            initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-[calc(100%+8px)] left-1/2 w-[90vw] max-w-4xl"
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="bg-background/60 backdrop-blur-2xl border border-border/30 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
                                <DropdownContent
                                    data={navData[activeDropdown as keyof typeof navData]}
                                    onNavigate={handleNavigation}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {
                    mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background pt-24 overflow-y-auto lg:hidden"
                        >
                            <div className="px-6 py-8 space-y-6">
                                {Object.entries(navData).map(([key, data]) => (
                                    <div key={key} className="space-y-3">
                                        <Link
                                            href={data.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-lg font-semibold text-foreground"
                                        >
                                            {data.label}
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2">
                                            {data.items.slice(0, 4).map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-border space-y-3">
                                    <Link
                                        href="/shop"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-lg font-semibold text-foreground"
                                    >
                                        Shop
                                    </Link>
                                    <Link
                                        href="/academy"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-lg font-semibold text-foreground"
                                    >
                                        Academy
                                    </Link>
                                    <Link
                                        href="/why-zecurx"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-lg font-semibold text-foreground"
                                    >
                                        Why ZecurX
                                    </Link>
                                    <Link
                                        href="/industries"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-lg font-semibold text-foreground"
                                    >
                                        Industries
                                    </Link>
                                </div>
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full py-3 bg-foreground text-background text-center font-medium rounded-lg"
                                >
                                    Contact Sales
                                </Link>
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
                            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
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
        <div className="flex flex-col">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-border/10 bg-gradient-to-r from-muted/10 to-transparent">
                <h3 className="text-xs font-bold tracking-widest uppercase text-primary/80">
                    {data.label}
                </h3>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-0.5 bg-border/10 p-1">
                {data.items.map((item, index) => (
                    <motion.button
                        key={item.title}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.03 }}
                        onClick={() => onNavigate(item.href)}
                        className="group relative flex flex-col gap-2 p-5 bg-muted/40 hover:bg-muted/60 rounded-xl transition-all text-left cursor-pointer border border-transparent hover:border-border/30"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 -rotate-45 group-hover:rotate-0 group-hover:text-primary transition-all duration-200 flex-shrink-0" />
                        </div>
                        <span className="text-xs text-muted-foreground/60 line-clamp-2 group-hover:text-muted-foreground transition-colors">
                            {item.desc}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Footer Section */}
            <div className="bg-gradient-to-r from-muted/10 to-transparent border-t border-border/10 px-6 py-4">
                <button
                    onClick={() => onNavigate(data.href)}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                    <span>View All {data.label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

