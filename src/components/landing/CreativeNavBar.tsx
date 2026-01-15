"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '@/components/ui/button';

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
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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
                        forceDark 
                            ? "bg-black border border-white/10 shadow-2xl shadow-black/50" 
                            : "bg-white dark:bg-black border border-gray-100 dark:border-white/10",
                        !forceDark && "shadow-lg",
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
                                <Link
                                    key={key}
                                    href={data.href}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                                        activeDropdown === key
                                            ? (forceDark ? "text-white" : "text-foreground")
                                            : (forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")
                                    )}
                                    onMouseEnter={() => handleMouseEnter(key)}
                                    onClick={() => {
                                        setActiveDropdown(null);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {data.label}
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-200",
                                        activeDropdown === key && "rotate-180"
                                    )} />
                                </Link>
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
                            
                            <Button
                                asChild
                                className={cn(
                                    "relative ml-2 px-6 py-2.5 h-auto rounded-full overflow-hidden",
                                    "bg-foreground text-background",
                                    "hover:shadow-lg hover:shadow-foreground/20 transition-all duration-300",
                                    "group"
                                )}
                            >
                                <Link href="/contact">
                                    <span className="relative z-10">Contact</span>
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="lg:hidden flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
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
                                        <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl flex flex-col justify-between">
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
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background lg:hidden border-l border-border/50 shadow-2xl flex flex-col h-full"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src="/images/zecurx-logo.png"
                                            alt="ZecurX"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-semibold text-lg">ZecurX</span>
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="p-6 space-y-2">
                                    {Object.entries(navData).map(([key, data]) => (
                                        <div key={key} className="border-b border-border/40 last:border-0">
                                            <button
                                                onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                                                className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground group"
                                            >
                                                {data.label}
                                                <ChevronDown 
                                                    className={cn(
                                                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                                                        mobileExpanded === key ? "rotate-180" : "group-hover:text-foreground"
                                                    )} 
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {mobileExpanded === key && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pb-4 space-y-1">
                                                            {data.items.map((item) => (
                                                                <Link
                                                                    key={item.title}
                                                                    href={item.href}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                    className="block py-2.5 px-4 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}

                                    <Link
                                        href="/why-zecurx"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        Why ZecurX
                                    </Link>

                                    <Link
                                        href="/academy"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        Academy
                                    </Link>

                                    <Link
                                        href="/shop"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        Shop
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border/50 bg-muted/30 shrink-0">
                                <Button
                                    asChild
                                    className="w-full py-6 h-auto text-base font-semibold rounded-xl mb-4"
                                >
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get a demo
                                    </Link>
                                </Button>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Experiencing an incident?</p>
                                    <Link 
                                        href="/contact" 
                                        className="text-sm font-medium text-primary hover:underline"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
