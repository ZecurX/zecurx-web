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
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

// Navigation Data (Original Content)
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
    const router = useRouter();
    const { scrollY } = useScroll();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Dynamic width animation based on scroll
    const navWidth = useTransform(scrollY, [0, 100], ["100%", "90%"]);
    const navTop = useTransform(scrollY, [0, 100], ["0px", "24px"]);
    const navBorderRadius = useTransform(scrollY, [0, 100], ["0px", "9999px"]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const handleNavigation = (href: string) => {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        router.push(href);
    };

    const handleMouseEnter = (key: string) => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setActiveDropdown(key);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
    };

    return (
        <>
            <motion.div
                style={{ 
                    width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? navWidth : "100%",
                    top: typeof window !== 'undefined' && window.innerWidth >= 1024 ? navTop : "0px",
                    borderRadius: typeof window !== 'undefined' && window.innerWidth >= 1024 ? navBorderRadius : "0px"
                }}
                className={cn(
                    "fixed left-0 right-0 z-50 mx-auto transition-all duration-300",
                    "lg:max-w-6xl", // Constraint max width on large screens
                    scrolled 
                        ? "lg:bg-background/80 lg:backdrop-blur-xl lg:border lg:border-white/10 lg:shadow-[0_8px_32px_rgba(0,0,0,0.12)]" 
                        : "lg:bg-transparent lg:border-transparent lg:shadow-none",
                    "bg-background/90 backdrop-blur-lg border-b border-white/5 lg:border-b-0" // Mobile style
                )}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center justify-between px-6 h-16 lg:h-14">
                    {/* Logo Section */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                <Shield className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                ZecurX
                            </span>
                        </Link>

                        {/* Desktop Dock Items */}
                        <nav className="hidden lg:flex items-center gap-1 p-1">
                            {Object.entries(navData).map(([key, data]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200",
                                        activeDropdown === key
                                            ? "text-white"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onMouseEnter={() => handleMouseEnter(key)}
                                    onClick={() => handleNavigation(data.href)}
                                >
                                    {activeDropdown === key && (
                                        <motion.div
                                            layoutId="dock-hover"
                                            className="absolute inset-0 bg-foreground rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative flex items-center gap-1">
                                        {data.label}
                                        <ChevronDown className={cn(
                                            "w-3 h-3 transition-transform duration-200",
                                            activeDropdown === key && "rotate-180"
                                        )} />
                                    </span>
                                </button>
                            ))}
                            <Link
                                href="/why-zecurx"
                                className="px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Why Us
                            </Link>
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <ThemeToggle />
                        <div className="w-px h-4 bg-border/50" />
                        <Link
                            href="/shop"
                            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/contact"
                            className="group flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                        >
                            <span>Contact Sales</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            href="/book-demo"
                            className="px-4 py-1.5 text-[13px] font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Book Demo
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
                        >
                            <motion.span 
                                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-foreground rounded-full origin-center" 
                            />
                            <motion.span 
                                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-6 h-0.5 bg-foreground rounded-full" 
                            />
                            <motion.span 
                                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-foreground rounded-full origin-center" 
                            />
                        </button>
                    </div>
                </div>

                {/* Floating Dropdown */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(5px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(5px)" }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[calc(100%+12px)] left-0 right-0 flex justify-center perspective-1000"
                            onMouseEnter={() => {
                                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                            }}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="w-auto min-w-[600px] max-w-5xl mx-4 bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                                <div className="p-2 flex gap-2">
                                    {/* Sidebar */}
                                    <div className="w-64 p-6 flex flex-col justify-between bg-muted/30 rounded-2xl">
                                        <div>
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                                                <Sparkles className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">
                                                {navData[activeDropdown as keyof typeof navData].label}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {navData[activeDropdown as keyof typeof navData].description}
                                            </p>
                                        </div>
                                        <Link
                                            href={navData[activeDropdown as keyof typeof navData].href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-500 transition-colors mt-8"
                                        >
                                            View Overview <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Grid */}
                                    <div className="flex-1 p-4 grid grid-cols-2 gap-2">
                                        {navData[activeDropdown as keyof typeof navData].items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="mt-1 p-2 rounded-lg bg-background border border-border/50 text-muted-foreground group-hover:text-blue-500 group-hover:border-blue-500/30 transition-colors shadow-sm">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                                                        {item.title}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl lg:hidden pt-24 px-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-8 pb-12">
                            {Object.entries(navData).map(([key, data]) => (
                                <div key={key} className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        {data.label}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {data.items.slice(0, 4).map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20"
                                            >
                                                <item.icon className="w-5 h-5 text-muted-foreground" />
                                                <span className="text-base font-medium">{item.title}</span>
                                            </Link>
                                        ))}
                                        <Link
                                            href={data.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-2 p-3 text-sm font-medium text-blue-500"
                                        >
                                            View all {data.label} <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="pt-8 border-t border-border/50 grid gap-3">
                                <Link
                                    href="/book-demo"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl text-center"
                                >
                                    Book a Demo
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 bg-muted text-foreground font-semibold rounded-xl text-center"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
