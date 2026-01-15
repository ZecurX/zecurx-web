"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

// Navigation Data
const navData = {
    platform: {
        label: "Platform",
        href: "/platform",
        description: "Unified security architecture",
        items: [
            { title: "Endpoint Security", href: "/platform/endpoint-security", desc: "Behavior-based protection for all devices" },
            { title: "Cloud Security", href: "/platform/cloud-security", desc: "Multi-cloud visibility and control" },
            { title: "Identity Security", href: "/platform/identity-security", desc: "Zero trust access management" },
            { title: "Application Security", href: "/platform/application-security", desc: "Secure your development lifecycle" },
            { title: "Threat Intelligence", href: "/platform/threat-intelligence", desc: "Proactive threat hunting capabilities" },
            { title: "AI Detection", href: "/platform/ai-detection", desc: "ML-powered threat analytics" },
        ]
    },
    solutions: {
        label: "Solutions",
        href: "/solutions",
        description: "Tailored security strategies",
        items: [
            { title: "Digital Transformation", href: "/solutions/digital-transformation", desc: "Secure your modernization journey" },
            { title: "AI-Powered SOC", href: "/solutions/ai-powered-soc", desc: "Intelligent security operations" },
            { title: "Zero Trust", href: "/solutions/zero-trust", desc: "Never trust, always verify" },
            { title: "Ransomware Defense", href: "/solutions/ransomware-defense", desc: "Complete protection strategy" },
            { title: "Compliance", href: "/solutions/compliance", desc: "Meet regulatory requirements" },
        ]
    },
    services: {
        label: "Services",
        href: "/services",
        description: "Expert security services",
        items: [
            { title: "Penetration Testing", href: "/services/offensive/penetration-testing", desc: "Adversary simulation and red teaming" },
            { title: "Vulnerability Management", href: "/services/offensive/vulnerability-management", desc: "Risk prioritization and remediation" },
            { title: "Secure Development", href: "/services/engineering/secure-development", desc: "Build secure applications" },
            { title: "DevSecOps", href: "/services/engineering/devsecops", desc: "Security automation pipelines" },
            { title: "VulnHunter Suite", href: "/tools", desc: "Free security tools" },
        ]
    },
    resources: {
        label: "Resources",
        href: "/resources",
        description: "Learn and explore",
        items: [
            { title: "Blog", href: "/blog", desc: "Latest security insights and updates" },
            { title: "Whitepapers", href: "/resources/whitepapers", desc: "In-depth research and analysis" },
            { title: "Research", href: "/resources/research", desc: "Security research publications" },
            { title: "Webinars", href: "/resources/webinars", desc: "On-demand learning sessions" },
        ]
    },
};

export default function CreativeNavBar({ forceDark = false }: { forceDark?: boolean }) {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Smooth scroll detection
    const { scrollY } = useScroll();
    
    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

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
            {/* Navbar Container - transforms from integrated to floating dock on scroll */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
            >
                <motion.header
                    layout
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className={cn(
                        "relative w-full max-w-[1400px]",
                        "rounded-2xl",
                        forceDark ? "bg-black/70 border-white/10 shadow-2xl shadow-black/50" : "bg-background/70 backdrop-blur-2xl border border-white/[0.08] dark:border-white/[0.06]",
                        forceDark && "backdrop-blur-xl",
                        !forceDark && "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
                        !forceDark && "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.2)]",
                    )}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex items-center justify-between h-16 px-6">
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            <motion.div 
                                className="relative w-8 h-8"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Image
                                    src="/images/zecurx-logo.png"
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                            <span className={cn("font-semibold text-base tracking-tight", forceDark ? "text-white" : "text-foreground")}>
                                ZecurX
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-2 relative">
                            {Object.entries(navData).map(([key, data]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                                        activeDropdown === key
                                            ? (forceDark ? "text-white" : "text-foreground")
                                            : (forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")
                                    )}
                                    onMouseEnter={() => handleMouseEnter(key)}
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
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Why ZecurX
                            </Link>
                            <Link
                                href="/industries"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Industries
                            </Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Link
                                href="/shop"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Shop
                            </Link>
                            <Link
                                href="/academy"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Academy
                            </Link>
                            
                            <div className="mx-3">
                                <ThemeToggle />
                            </div>
                            
                            <Link
                                href="/contact"
                                className={cn(
                                    "relative ml-2 px-6 py-2.5 text-sm font-medium rounded-full overflow-hidden",
                                    "bg-foreground text-background",
                                    "hover:shadow-lg hover:shadow-foreground/20 transition-all duration-300",
                                    "group"
                                )}
                            >
                                <span className="relative z-10">Contact</span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="lg:hidden flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <motion.div
                                    animate={mobileMenuOpen ? "open" : "closed"}
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {activeDropdown && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                className="overflow-hidden border-t border-white/[0.06]"
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="p-4">
                                    <motion.div 
                                        className="grid grid-cols-[200px_1fr] gap-6 min-h-[200px]"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.05 }}
                                    >
                                        {/* Sidebar */}
                                        <div className="p-4 bg-white/[0.03] dark:bg-white/[0.02] rounded-xl flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground mb-1">
                                                    {navData[activeDropdown as keyof typeof navData].label}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {navData[activeDropdown as keyof typeof navData].description}
                                                </p>
                                            </div>
                                            <Link
                                                href={navData[activeDropdown as keyof typeof navData].href}
                                                onClick={() => setActiveDropdown(null)}
                                                className="group flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors mt-4"
                                            >
                                                Explore all
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>

                                        {/* Links Grid */}
                                        <div className="grid grid-cols-2 gap-1">
                                            {navData[activeDropdown as keyof typeof navData].items.map((item, i) => (
                                                <motion.div
                                                    key={item.title}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.15, delay: i * 0.02 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setActiveDropdown(null)}
                                                        className="group block p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                                                    >
                                                        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-0.5">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors line-clamp-1">
                                                            {item.desc}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.header>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
                    >
                        <motion.div 
                            className="pt-24 px-6 h-full overflow-y-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="space-y-8 pb-12">
                                {Object.entries(navData).map(([key, data], idx) => (
                                    <motion.div 
                                        key={key} 
                                        className="space-y-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {data.label}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-1">
                                            {data.items.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block py-2.5 text-base font-medium text-foreground hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                
                                <motion.div 
                                    className="pt-8 border-t border-border/50 space-y-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        href="/book-demo"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-foreground text-background font-semibold rounded-xl text-center"
                                    >
                                        Book a Demo
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-white/5 text-foreground font-semibold rounded-xl text-center border border-border/50"
                                    >
                                        Contact Us
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
