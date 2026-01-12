"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronDown, ArrowRight, Menu, X, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

// Navigation Data (No Icons in Main Nav)
const navData = {
    platform: {
        label: "Platform",
        href: "/platform",
        description: "Unified security architecture",
        items: [
            { title: "Endpoint Security", href: "/platform/endpoint-security", desc: "Behavior-based protection" },
            { title: "Cloud Security", href: "/platform/cloud-security", desc: "Multi-cloud visibility" },
            { title: "Identity Security", href: "/platform/identity-security", desc: "Zero trust access" },
            { title: "Application Security", href: "/platform/application-security", desc: "Secure SDLC" },
            { title: "Threat Intelligence", href: "/platform/threat-intelligence", desc: "Proactive hunting" },
            { title: "AI Detection", href: "/platform/ai-detection", desc: "ML-powered analytics" },
        ]
    },
    solutions: {
        label: "Solutions",
        href: "/solutions",
        description: "Tailored security strategies",
        items: [
            { title: "Digital Transformation", href: "/solutions/digital-transformation", desc: "Secure modernization" },
            { title: "AI-Powered SOC", href: "/solutions/ai-powered-soc", desc: "Intelligent operations" },
            { title: "Zero Trust", href: "/solutions/zero-trust", desc: "Never trust, verify" },
            { title: "Ransomware Defense", href: "/solutions/ransomware-defense", desc: "Complete protection" },
            { title: "Compliance", href: "/solutions/compliance", desc: "Regulatory adherence" },
        ]
    },
    services: {
        label: "Services",
        href: "/services",
        description: "Expert security services",
        items: [
            { title: "Penetration Testing", href: "/services/offensive/penetration-testing", desc: "Adversary simulation" },
            { title: "Vulnerability Management", href: "/services/offensive/vulnerability-management", desc: "Risk prioritization" },
            { title: "Secure Development", href: "/services/engineering/secure-development", desc: "Build secure apps" },
            { title: "DevSecOps", href: "/services/engineering/devsecops", desc: "Security automation" },
            { title: "VulnHunter Suite", href: "/tools", desc: "Free security tools" },
        ]
    },
    resources: {
        label: "Resources",
        href: "/resources",
        description: "Learn and explore",
        items: [
            { title: "Blog", href: "/resources/blog", desc: "Latest insights" },
            { title: "Whitepapers", href: "/resources/whitepapers", desc: "Deep dives" },
            { title: "Research", href: "/resources/research", desc: "Security research" },
            { title: "Webinars", href: "/resources/webinars", desc: "On-demand learning" },
        ]
    },
};

export default function CreativeNavBar() {
    const router = useRouter();
    const { scrollY } = useScroll();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Dynamic sizing based on scroll
    const navTop = useTransform(scrollY, [0, 50], ["20px", "12px"]);
    const navWidth = useTransform(scrollY, [0, 50], ["1000px", "900px"]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
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
                    y: navTop,
                }}
                className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            >
                <motion.div
                    style={{
                        width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? navWidth : "100%",
                    }}
                    className={cn(
                        "pointer-events-auto transition-all duration-500 ease-out",
                        "flex items-center justify-between p-1.5",
                        "bg-background/80 backdrop-blur-xl border border-border/40",
                        "rounded-full shadow-lg shadow-black/5 dark:shadow-black/20",
                        "max-w-full lg:max-w-none"
                    )}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors group shrink-0">
                        <div className="relative w-6 h-6">
                            <Image
                                src="/images/zecurx-logo.png"
                                alt="ZecurX"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="font-semibold text-sm tracking-tight text-foreground">
                            ZecurX
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-0.5">
                        {Object.entries(navData).map(([key, data]) => (
                            <button
                                key={key}
                                className={cn(
                                    "relative px-4 py-2 text-[13px] font-medium transition-colors rounded-full",
                                    activeDropdown === key
                                        ? "text-foreground bg-muted/60"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                )}
                                onMouseEnter={() => handleMouseEnter(key)}
                                onClick={() => handleNavigation(data.href)}
                            >
                                {data.label}
                            </button>
                        ))}
                        <div className="w-px h-4 bg-border/40 mx-1" />
                        <Link
                            href="/why-zecurx"
                            className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-full transition-all"
                        >
                            Why Us
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-1.5 pl-1">
                        <div className="scale-75 origin-right">
                             <ThemeToggle />
                        </div>
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-[13px] font-medium text-foreground hover:text-foreground/70 transition-colors rounded-full hover:bg-muted/30"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/book-demo"
                            className="px-4 py-2 text-[13px] font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all shadow-sm"
                        >
                            Book Demo
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-2 ml-auto pr-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-foreground hover:bg-muted/50 rounded-full transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </motion.div>

                {/* Dropdown Panel */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute top-full pointer-events-auto"
                            onMouseEnter={() => {
                                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                            }}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Inner Panel Content */}
                            <div className="w-[800px] p-2 bg-background/90 backdrop-blur-2xl border border-border/40 rounded-[24px] shadow-2xl shadow-black/10 overflow-hidden">
                                <div className="grid grid-cols-[220px_1fr] gap-2">
                                    {/* Sidebar */}
                                    <div className="p-5 flex flex-col justify-between bg-muted/40 rounded-[18px]">
                                        <div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 opacity-70">
                                                Collection
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1.5">
                                                {navData[activeDropdown as keyof typeof navData].label}
                                            </h3>
                                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                                {navData[activeDropdown as keyof typeof navData].description}
                                            </p>
                                        </div>
                                        <Link
                                            href={navData[activeDropdown as keyof typeof navData].href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="group flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-blue-500 transition-colors mt-6"
                                        >
                                            Overview 
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </div>

                                    {/* Link Grid */}
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        {navData[activeDropdown as keyof typeof navData].items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="group flex flex-col p-3 rounded-[14px] hover:bg-muted/60 transition-colors"
                                            >
                                                <div className="text-[13px] font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                                                    {item.title}
                                                </div>
                                                <div className="text-[12px] text-muted-foreground/70 mt-0.5 group-hover:text-muted-foreground transition-colors line-clamp-1">
                                                    {item.desc}
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
                        className="fixed inset-0 z-40 bg-background lg:hidden pt-28 px-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-8 pb-12">
                            {Object.entries(navData).map(([key, data]) => (
                                <div key={key} className="space-y-4">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {data.label}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {data.items.slice(0, 5).map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block py-2 text-[15px] font-medium text-foreground hover:text-blue-500"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            <div className="pt-8 border-t border-border/50 grid gap-3">
                                <Link
                                    href="/book-demo"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3.5 bg-foreground text-background font-semibold rounded-xl text-center"
                                >
                                    Book a Demo
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3.5 bg-muted text-foreground font-semibold rounded-xl text-center"
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
