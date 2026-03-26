"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CartIcon from '@/components/shop/CartIcon';
import { CDN_ASSETS } from "@/lib/cdn";

// Navigation Data
const navData = {
    services: {
        label: "Services",
        href: "/services",
        description: "Expert security services",
        items: [
            { title: "Application Security", href: "/services/application-security", desc: "Web, API & source code security testing" },
            { title: "Cloud & DevSecOps", href: "/services/cloud-devsecops", desc: "Cloud misconfig & CI/CD security audits" },
            { title: "Secure AI Development", href: "/services/secure-ai-development", desc: "LLM security & AI abuse testing" },
            { title: "Compliance Readiness", href: "/services/compliance-readiness", desc: "ISO 27001, SOC 2 & DPDP preparation" },
        ]
    },
    resources: {
        label: "Resources",
        href: "/resources",
        description: "Security insights & research",
        items: [
            { title: "Security Research", href: "/resources/research", desc: "Vulnerability research & advisories" },
            { title: "Security Blog", href: "/blog", desc: "Latest insights & technical articles" },
            { title: "Whitepapers", href: "/resources/whitepapers", desc: "In-depth security research" },
            { title: "Case Studies", href: "/resources/case-studies", desc: "Real-world security solutions" },
        ]
    },
    academy: {
        label: "Academy",
        href: "/academy",
        description: "Certified security training",
        items: [
            { title: "Training", href: "/academy#courses", desc: "Certified security training programs" },
            { title: "Seminars", href: "/resources/seminars", desc: "Live workshops & events" },
        ]
    }
};

export default function CreativeNavBar({ forceDark = false, showCart = false }: { forceDark?: boolean, showCart?: boolean }) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

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
                            : "border border-border",
                        !forceDark && "shadow-lg",
                    )}
                    style={!forceDark ? { backgroundColor: 'rgba(237, 244, 255, 0.85)', backdropFilter: 'blur(12px)' } : undefined}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex items-center justify-between h-16 px-6">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            <motion.div
                                className="relative w-12 h-12"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Image
                                    src={CDN_ASSETS.brand.logo}
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                            <span className={cn("font-manrope font-semibold text-[1.5rem] leading-none tracking-tight", forceDark ? "text-white" : "text-foreground")}>
                                ZecurX
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-2 relative">
                            {Object.entries(navData).filter(([key]) => key !== 'academy').map(([key, data]) => (
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
                                    aria-expanded={activeDropdown === key}
                                    aria-haspopup="true"
                                >
                                    {data.label}
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-200",
                                        activeDropdown === key && "rotate-180"
                                    )} />
                                </Link>
                            ))}

                            <Link
                                href="/industries"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Industries
                            </Link>
                            <Link
                                href="/tools"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Security Toolkit
                            </Link>
                            <Link
                                href="/how-we-work"
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                How We Work
                            </Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('academy')}
                            >
                                <Link
                                    href="/academy"
                                    className={cn(
                                        "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                                        activeDropdown === 'academy'
                                            ? (forceDark ? "text-white" : "text-foreground")
                                            : (forceDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")
                                    )}
                                >
                                    Academy
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === 'academy' && "rotate-180")} />
                                </Link>
                            </div>

                            <div className="mx-1 flex items-center gap-3">
                                {showCart && <CartIcon />}
                            </div>

                            <div className="relative ml-2">
                                <Button
                                    asChild
                                    className={cn(
                                        "relative px-6 py-2.5 h-auto rounded-full",
                                        "border border-transparent bg-[#4c69e4] text-white",
                                        "hover:bg-[#4c69e4]",
                                        "shadow-[0px_0px_0px_0px_#92c4fd]",
                                        "hover:translate-y-[-3px] hover:shadow-[0px_3px_0px_0px_#92c4fd]",
                                        "active:translate-y-[-2px] active:shadow-[0px_2px_0px_0px_#92c4fd]",
                                        "transition-transform duration-200"
                                    )}
                                >
                                    <Link href="/contact">
                                        <span>Contact</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="lg:hidden flex items-center gap-3">
                            {showCart && <CartIcon />}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
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
                        {activeDropdown && activeDropdown in navData && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                className={cn(
                                    "overflow-hidden border-t",
                                    forceDark ? "border-white/10" : "border-border/60"
                                )}
                                onMouseEnter={() => {
                                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                }}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="p-4 md:p-5">
                                    <motion.div
                                        className={cn(
                                            "grid gap-3 items-stretch",
                                            activeDropdown === "academy"
                                                ? "min-w-[420px] grid-cols-1 md:grid-cols-[1fr_1.1fr]"
                                                : "min-w-[620px] grid-cols-1 md:grid-cols-[1.05fr_1.5fr]"
                                        )}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.05 }}
                                    >
                                        <Link
                                            href={navData[activeDropdown as keyof typeof navData].href}
                                            onClick={() => setActiveDropdown(null)}
                                            className={cn(
                                                "group flex flex-col justify-between rounded-2xl border p-4 md:p-5 transition-all",
                                                forceDark
                                                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                                                    : "border-sky-100 bg-gradient-to-br from-white/90 via-sky-50/80 to-white/90 hover:border-sky-200"
                                            )}
                                        >
                                            <div>
                                                <p className={cn(
                                                    "text-[11px] font-semibold uppercase tracking-[0.1em]",
                                                    forceDark ? "text-white/60" : "text-sky-700/75"
                                                )}>
                                                    {navData[activeDropdown as keyof typeof navData].label}
                                                </p>
                                                <h4 className={cn(
                                                    "mt-2 text-base font-semibold",
                                                    forceDark ? "text-white" : "text-slate-900"
                                                )}>
                                                    Explore {navData[activeDropdown as keyof typeof navData].label}
                                                </h4>
                                                <p className={cn(
                                                    "mt-1.5 text-sm leading-relaxed",
                                                    forceDark ? "text-white/70" : "text-slate-600"
                                                )}>
                                                    {navData[activeDropdown as keyof typeof navData].description}
                                                </p>
                                            </div>
                                            <span className={cn(
                                                "mt-4 inline-flex items-center gap-1.5 text-sm font-medium",
                                                forceDark ? "text-white/85" : "text-[#4c69e4]"
                                            )}>
                                                View all {navData[activeDropdown as keyof typeof navData].label}
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </span>
                                        </Link>

                                        <div className={cn(
                                            "grid gap-2",
                                            activeDropdown === "academy" ? "grid-cols-1" : "grid-cols-2"
                                        )}>
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
                                                        className={cn(
                                                            "group block rounded-xl border p-3 transition-all",
                                                            forceDark
                                                                ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                                                                : "border-sky-100/80 bg-white/80 hover:border-sky-200 hover:bg-white"
                                                        )}
                                                    >
                                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                                            <div className={cn(
                                                                "text-sm font-semibold transition-colors",
                                                                forceDark ? "text-white group-hover:text-sky-200" : "text-slate-900 group-hover:text-[#3d5fd9]"
                                                            )}>
                                                                {item.title}
                                                            </div>
                                                            <ArrowRight className={cn(
                                                                "h-3.5 w-3.5 transition-all opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5",
                                                                forceDark ? "text-white/70" : "text-slate-500"
                                                            )} />
                                                        </div>
                                                        <div className={cn(
                                                            "text-xs leading-relaxed",
                                                            forceDark ? "text-white/65" : "text-slate-600"
                                                        )}>
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
                                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={CDN_ASSETS.brand.logo}
                                            alt="ZecurX"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-manrope font-semibold text-[1.5rem] leading-none tracking-tight">ZecurX</span>
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                    aria-label="Close menu"
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
                                        href="/industries"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        Industries
                                    </Link>

                                    <Link
                                        href="/tools"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        Security Toolkit
                                    </Link>

                                    <Link
                                        href="/how-we-work"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between w-full py-4 text-base font-medium text-foreground border-b border-border/40"
                                    >
                                        How We Work
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 border-t border-border/50 bg-muted/30 shrink-0">
                                <Button
                                    asChild
                                    className="w-full py-6 h-auto text-base font-semibold rounded-xl mb-4 bg-[#4c69e4] text-white hover:bg-[#4c69e4] hover:opacity-90"
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
