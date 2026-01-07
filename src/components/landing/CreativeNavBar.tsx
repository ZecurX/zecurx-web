"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (href: string) => {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        router.push(href);
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                    (isScrolled || activeDropdown)
                        ? "bg-background border-b border-border/30"
                        : "bg-transparent"
                )}
                onMouseLeave={() => setActiveDropdown(null)}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-8 h-8 object-contain" />
                            <span className="text-foreground font-manrope font-bold text-lg tracking-tight">ZecurX</span>
                        </Link>

                        {/* Center Navigation */}
                        <div className="flex items-center gap-1">
                            {Object.entries(navData).map(([key, data]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                        activeDropdown === key
                                            ? "text-foreground bg-muted/50"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    )}
                                    onMouseEnter={() => setActiveDropdown(key)}
                                    onClick={() => handleNavigation(data.href)}
                                >
                                    {data.label}
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-200",
                                        activeDropdown === key && "rotate-180"
                                    )} />
                                </button>
                            ))}
                            <Link
                                href="/why-zecurx"
                                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Why ZecurX
                            </Link>
                            <Link
                                href="/industries"
                                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Industries
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/academy"
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Academy
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                            >
                                Contact Sales
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden flex items-center justify-between h-14">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-7 h-7" />
                        <span className="text-foreground font-manrope font-bold text-base">ZecurX</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-foreground"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Redesigned Desktop Dropdown */}
            <AnimatePresence>
                {activeDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 w-full bg-background border-b border-border/30"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-8">
                            <DropdownContent
                                data={navData[activeDropdown as keyof typeof navData]}
                                onNavigate={handleNavigation}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >

            {/* Mobile Menu */ }
            <AnimatePresence>
    {
        mobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background pt-14 overflow-y-auto lg:hidden"
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

        {/* Backdrop */ }
        <AnimatePresence>
    {
        activeDropdown && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                style={{ top: '64px' }}
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
        <div className="grid grid-cols-12 gap-8">
            {/* Left: Overview */}
            <div className="col-span-3 border-r border-border/40 pr-8">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70 mb-3 block">
                    {data.label}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {data.description}
                </p>
                <button
                    onClick={() => onNavigate(data.href)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground group"
                >
                    <span className="border-b border-foreground/30 group-hover:border-foreground transition-colors pb-0.5">
                        View all
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Right: Links Grid */}
            <div className="col-span-9 grid grid-cols-3 gap-x-6 gap-y-1">
                {data.items.map((item, index) => (
                    <motion.button
                        key={item.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        onClick={() => onNavigate(item.href)}
                        className="flex items-center gap-3 px-3 py-3 -mx-3 rounded-lg hover:bg-muted/40 transition-all text-left group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
                            <item.icon className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">
                                {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                                {item.desc}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

