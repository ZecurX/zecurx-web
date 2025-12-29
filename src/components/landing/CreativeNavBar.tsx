"use client";
import React, { useState, useEffect } from 'react';
import {
    ChevronDown, Shield, Globe, Lock, Cpu, Eye,
    Zap, Cloud, KeyRound, Code, Target, Brain, Settings, ShieldCheck,
    Building2, Landmark, GraduationCap, Rocket, Heart, Coins,
    Users, Award, CheckCircle, GitCompare, FileText,
    BookOpen, FileSearch, Lightbulb, BookMarked, Video,
    ArrowRight, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

// Navigation Data
const navData = {
    platform: {
        label: "Platform",
        tagline: "Enterprise Security Capabilities",
        cta: { label: "Explore Platform", href: "#" },
        columns: [
            {
                title: "Core Security",
                items: [
                    { icon: Shield, title: "Endpoint Security", desc: "Advanced threat protection" },
                    { icon: Cloud, title: "Cloud Security", desc: "CNAPP & cloud workloads" },
                    { icon: KeyRound, title: "Identity Security", desc: "Zero trust access" },
                    { icon: Code, title: "Application Security", desc: "Secure SDLC" },
                ]
            },
            {
                title: "Intelligence & Automation",
                items: [
                    { icon: Target, title: "Threat Intelligence", desc: "Proactive hunting" },
                    { icon: Brain, title: "AI Detection", desc: "ML-powered analytics" },
                    { icon: Settings, title: "Security Automation", desc: "SOAR capabilities" },
                    { icon: ShieldCheck, title: "Data Protection", desc: "DLP & encryption" },
                ]
            },
        ]
    },
    solutions: {
        label: "Solutions",
        tagline: "Business-Aligned Security",
        cta: { label: "View All Solutions", href: "#" },
        columns: [
            {
                title: "Strategic",
                items: [
                    { icon: Zap, title: "Digital Transformation", desc: "Secure modernization" },
                    { icon: Brain, title: "AI-Powered SOC", desc: "Next-gen operations" },
                    { icon: Lock, title: "Zero Trust", desc: "Architecture design" },
                ]
            },
            {
                title: "Defense",
                items: [
                    { icon: Shield, title: "Ransomware Defense", desc: "Prevention & recovery" },
                    { icon: Cloud, title: "Cloud Security", desc: "Multi-cloud protection" },
                    { icon: FileText, title: "Compliance", desc: "Regulatory alignment" },
                ]
            },
        ]
    },
    services: {
        label: "Services",
        tagline: "Expert Security Delivery",
        cta: { label: "Explore Services", href: "#" },
        columns: [
            {
                title: "Offensive",
                items: [
                    { icon: Target, title: "Penetration Testing", desc: "Red team assessments" },
                    { icon: Eye, title: "Vulnerability Management", desc: "Continuous scanning" },
                ]
            },
            {
                title: "Engineering",
                items: [
                    { icon: Code, title: "Secure Development", desc: "Security by design" },
                    { icon: Globe, title: "Web & App Security", desc: "Application hardening" },
                    { icon: Settings, title: "DevSecOps", desc: "CI/CD security" },
                    { icon: Users, title: "Consulting", desc: "Strategic advisory" },
                ]
            },
        ]
    },
    industries: {
        label: "Industries",
        tagline: "Sector-Specific Security",
        cta: { label: "View Industries", href: "#" },
        columns: [
            {
                title: "Enterprise",
                items: [
                    { icon: Cpu, title: "Technology", desc: "Tech & SaaS" },
                    { icon: Coins, title: "Financial Services", desc: "Banking & fintech" },
                    { icon: Heart, title: "Healthcare", desc: "HIPAA compliance" },
                ]
            },
            {
                title: "Public & Growth",
                items: [
                    { icon: Landmark, title: "Government", desc: "Critical infrastructure" },
                    { icon: GraduationCap, title: "Education", desc: "Research protection" },
                    { icon: Rocket, title: "Startups", desc: "Scalable security" },
                ]
            },
        ]
    },
    whyZecurx: {
        label: "Why ZecurX",
        tagline: "Trust & Expertise",
        cta: { label: "Learn About Us", href: "#" },
        columns: [
            {
                title: "Company",
                items: [
                    { icon: Building2, title: "Overview", desc: "Our mission" },
                    { icon: Users, title: "Leadership", desc: "Security experts" },
                    { icon: Award, title: "Certifications", desc: "ISO, NIST & more" },
                ]
            },
            {
                title: "Differentiation",
                items: [
                    { icon: CheckCircle, title: "Methodology", desc: "Proven frameworks" },
                    { icon: GitCompare, title: "ZecurX vs Others", desc: "Why choose us" },
                ]
            },
        ]
    },
    resources: {
        label: "Resources",
        tagline: "Knowledge & Insights",
        cta: { label: "Browse Resources", href: "#" },
        columns: [
            {
                title: "Content",
                items: [
                    { icon: BookOpen, title: "Blog", desc: "Latest insights" },
                    { icon: FileSearch, title: "Whitepapers", desc: "Deep-dive reports" },
                    { icon: Lightbulb, title: "Research", desc: "Threat intelligence" },
                ]
            },
            {
                title: "Learning",
                items: [
                    { icon: BookMarked, title: "Security Guides", desc: "Best practices" },
                    { icon: Video, title: "Webinars", desc: "Expert sessions" },
                ]
            },
        ]
    }
};

export default function CreativeNavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full z-50"
            onMouseLeave={() => setActiveDropdown(null)}
        >
            {/* NAV BAR */}
            <nav
                className={cn(
                    "w-full transition-all duration-300",
                    isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-border" : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="hidden lg:flex items-center justify-between h-[68px]">

                        {/* LOGO */}
                        <a href="/" className="flex items-center gap-3">
                            <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-9 h-9 object-contain" />
                            <span className="text-foreground font-manrope font-bold text-xl">ZecurX</span>
                        </a>

                        {/* PRIMARY NAVIGATION */}
                        <div className="flex items-center">
                            {Object.entries(navData).map(([key, data]) => (
                                <button
                                    key={key}
                                    className={cn(
                                        "relative flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-colors",
                                        activeDropdown === key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onMouseEnter={() => setActiveDropdown(key)}
                                >
                                    {data.label}
                                    <ChevronDown className={cn(
                                        "w-3 h-3 transition-transform duration-200",
                                        activeDropdown === key && "rotate-180"
                                    )} />
                                </button>
                            ))}
                        </div>

                        {/* SECONDARY NAVIGATION */}
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Academy
                            </a>
                            <a href="#" className="px-5 py-2 bg-foreground text-background text-[13px] font-semibold rounded-lg hover:bg-foreground/90 transition-colors">
                                Contact Sales
                            </a>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* MOBILE */}
                    <div className="lg:hidden flex items-center justify-between h-16">
                        <a href="/" className="flex items-center gap-2">
                            <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-8 h-8" />
                            <span className="text-foreground font-manrope font-bold text-lg">ZecurX</span>
                        </a>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground p-2">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav >

            {/* MEGA MENU DROPDOWN - Directly connected to nav */}
            <AnimatePresence>
                {
                    activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full overflow-hidden"
                        >
                            <div className="bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
                                <div className="max-w-7xl mx-auto px-6 py-8">
                                    {navData[activeDropdown as keyof typeof navData] && (
                                        <MegaMenuContent data={navData[activeDropdown as keyof typeof navData]} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >


            {/* Backdrop overlay when menu is open */}
            <AnimatePresence>
                {
                    activeDropdown && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed top-[68px] inset-x-0 bottom-0 bg-black/50"
                            style={{ zIndex: -1 }}
                            onClick={() => setActiveDropdown(null)}
                            onMouseEnter={() => setActiveDropdown(null)}
                        />
                    )
                }
            </AnimatePresence >
        </div >
    );
}

interface MegaMenuContentProps {
    data: {
        label: string;
        tagline: string;
        cta: { label: string; href: string };
        columns: { title: string; items: { icon: any; title: string; desc: string }[] }[];
    };
}

function MegaMenuContent({ data }: MegaMenuContentProps) {
    return (
        <div className="flex gap-16">
            {/* Left */}
            <div className="w-48 flex-shrink-0">
                <h3 className="text-lg font-semibold text-foreground mb-1">{data.label}</h3>
                <p className="text-xs text-muted-foreground mb-5">{data.tagline}</p>
                <a href={data.cta.href} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group">
                    {data.cta.label}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
            </div>

            {/* Divider */}
            <div className="w-px bg-border" />

            {/* Columns */}
            <div className="flex-1 grid grid-cols-2 gap-12">
                {data.columns.map((column, colIdx) => (
                    <div key={colIdx}>
                        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">{column.title}</h4>
                        <div className="space-y-0.5">
                            {column.items.map((item, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</div>
                                        <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
