"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

// Navigation Data
const navData = {
    platform: {
        label: "Platform",
        tagline: "Enterprise Security Capabilities",
        cta: { label: "Explore Platform", href: "/platform" },
        columns: [
            {
                title: "Core Security",
                items: [
                    { icon: Shield, title: "Endpoint Security", desc: "Advanced threat protection", href: "/platform/endpoint-security" },
                    { icon: Cloud, title: "Cloud Security", desc: "CNAPP & cloud workloads", href: "/platform/cloud-security" },
                    { icon: KeyRound, title: "Identity Security", desc: "Zero trust access", href: "/platform/identity-security" },
                    { icon: Code, title: "Application Security", desc: "Secure SDLC", href: "/platform/application-security" },
                ]
            },
            {
                title: "Intelligence & Automation",
                items: [
                    { icon: Target, title: "Threat Intelligence", desc: "Proactive hunting", href: "/platform/threat-intelligence" },
                    { icon: Brain, title: "AI Detection", desc: "ML-powered analytics", href: "/platform/ai-detection" },
                    { icon: Settings, title: "Security Automation", desc: "SOAR capabilities", href: "/platform/security-automation" },
                    { icon: ShieldCheck, title: "Data Protection", desc: "DLP & encryption", href: "/platform/data-protection" },
                ]
            },
        ]
    },
    solutions: {
        label: "Solutions",
        tagline: "Business-Aligned Security",
        cta: { label: "View All Solutions", href: "/solutions" },
        columns: [
            {
                title: "Strategic",
                items: [
                    { icon: Zap, title: "Digital Transformation", desc: "Secure modernization", href: "/solutions/digital-transformation" },
                    { icon: Brain, title: "AI-Powered SOC", desc: "Next-gen operations", href: "/solutions/ai-powered-soc" },
                    { icon: Lock, title: "Zero Trust", desc: "Architecture design", href: "/solutions/zero-trust" },
                ]
            },
            {
                title: "Defense",
                items: [
                    { icon: Shield, title: "Ransomware Defense", desc: "Prevention & recovery", href: "/solutions/ransomware-defense" },
                    { icon: Cloud, title: "Cloud Security", desc: "Multi-cloud protection", href: "/solutions/cloud-security" },
                    { icon: FileText, title: "Compliance", desc: "Regulatory alignment", href: "/solutions/compliance" },
                ]
            },
        ]
    },
    services: {
        label: "Services",
        tagline: "Expert Security Delivery",
        cta: { label: "Explore Services", href: "/services" },
        columns: [
            {
                title: "Offensive",
                items: [
                    { icon: Target, title: "Penetration Testing", desc: "Red team assessments", href: "/services/offensive/penetration-testing" },
                    { icon: Eye, title: "Vulnerability Management", desc: "Continuous scanning", href: "/services/offensive/vulnerability-management" },
                ]
            },
            {
                title: "Engineering",
                items: [
                    { icon: Code, title: "Secure Development", desc: "Security by design", href: "/services/engineering/secure-development" },
                    { icon: Globe, title: "Web & App Security", desc: "Application hardening", href: "/services/engineering/web-app-security" },
                    { icon: Settings, title: "DevSecOps", desc: "CI/CD security", href: "/services/engineering/devsecops" },
                    { icon: Users, title: "Consulting", desc: "Strategic advisory", href: "/services/engineering/consulting" },
                ]
            },
            {
                title: "Tools",
                items: [
                    { icon: Terminal, title: "VulnHunter Suite", desc: "Recon & Analysis", href: "/tools" },
                ]
            }
        ]
    },
    resources: {
        label: "Resources",
        tagline: "Knowledge & Insights",
        cta: { label: "Browse Resources", href: "/resources" },
        columns: [
            {
                title: "Content",
                items: [
                    { icon: BookOpen, title: "Blog", desc: "Latest insights", href: "/resources/blog" },
                    { icon: FileSearch, title: "Whitepapers", desc: "Deep-dive reports", href: "/resources/whitepapers" },
                    { icon: Lightbulb, title: "Research", desc: "Threat intelligence", href: "/resources/research" },
                ]
            },
            {
                title: "Learning",
                items: [
                    { icon: BookMarked, title: "Security Guides", desc: "Best practices", href: "/resources/guides" },
                    { icon: Video, title: "Webinars", desc: "Expert sessions", href: "/resources/webinars" },
                ]
            },
        ]
    },
    whyZecurx: {
        label: "Why ZecurX",
        tagline: "Trust & Expertise",
        cta: { label: "Learn About Us", href: "/why-zecurx" },
        columns: [
            {
                title: "Company",
                items: [
                    { icon: Building2, title: "Overview", desc: "Our mission", href: "/why-zecurx#overview" },
                    { icon: Users, title: "Leadership", desc: "Security experts", href: "/why-zecurx#leadership" },
                    { icon: Award, title: "Certifications", desc: "ISO, NIST & more", href: "/why-zecurx#certifications" },
                ]
            },
            {
                title: "Differentiation",
                items: [
                    { icon: CheckCircle, title: "Methodology", desc: "Proven frameworks", href: "/why-zecurx#methodology" },
                    { icon: GitCompare, title: "ZecurX vs Others", desc: "Why choose us", href: "/why-zecurx#comparison" },
                ]
            },
        ]
    },
    industries: {
        label: "Industries",
        tagline: "Sector-Specific Security",
        cta: { label: "View Industries", href: "/industries" },
        columns: [
            {
                title: "Enterprise",
                items: [
                    { icon: Cpu, title: "Technology", desc: "Tech & SaaS", href: "/industries?tab=tech" },
                    { icon: Coins, title: "Financial Services", desc: "Banking & fintech", href: "/industries?tab=bfsi" },
                    { icon: Heart, title: "Healthcare", desc: "HIPAA compliance", href: "/industries?tab=healthcare" },
                ]
            },
            {
                title: "Public & Growth",
                items: [
                    { icon: Landmark, title: "Government", desc: "Critical infrastructure", href: "/industries?tab=gov" },
                    { icon: GraduationCap, title: "Education", desc: "Research protection", href: "/industries?tab=edu" },
                    { icon: Rocket, title: "Startups", desc: "Scalable security", href: "/industries?tab=tech" },
                ]
            },
        ]
    }
};

export default function CreativeNavBar() {
    const pathname = usePathname();
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
                            {Object.entries(navData).map(([key, data]) => {
                                if (key === 'industries' || key === 'whyZecurx') {
                                    return (
                                        <a
                                            key={key}
                                            href={data.cta.href}
                                            className={cn(
                                                "relative flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-colors",
                                                "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {data.label}
                                        </a>
                                    );
                                }
                                return (
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
                                );
                            })}
                        </div>

                        {/* SECONDARY NAVIGATION */}
                        <div className="flex items-center gap-6">
                            <a href="/academy" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                                        <MegaMenuContent
                                            data={navData[activeDropdown as keyof typeof navData]}
                                            onLinkClick={() => setActiveDropdown(null)}
                                            currentPathname={pathname}
                                        />
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
        columns: { title: string; items: { icon: any; title: string; desc: string; href?: string }[] }[];
    };
    onLinkClick?: () => void;
    currentPathname: string;
}

function MegaMenuContent({ data, onLinkClick, currentPathname }: MegaMenuContentProps) {
    const router = useRouter();

    const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        // Check if href contains a hash
        if (href.includes('#')) {
            const [path, hash] = href.split('#');
            // Normalize paths (remove trailing slashes for comparison)
            const normalize = (p: string) => p.replace(/\/+$/, '');
            const targetPath = path ? normalize(path) : normalize(currentPathname);
            const currentPath = normalize(currentPathname);

            // If we're already on the target page
            if (currentPath === targetPath) {
                // Close menu first to clear view
                onLinkClick?.();

                // Allow a tiny microtask pause for menu close (if affects layout), then scroll
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Update URL hash strictly
                        window.history.pushState(null, '', `#${hash}`);
                    } else {
                        // Fallback: just set hash and let browser try
                        window.location.hash = hash;
                    }
                }, 10);
            } else {
                onLinkClick?.();
                // Navigate to the page first
                router.push(href);
            }
        } else {
            onLinkClick?.();
            // Force scroll to top for standard navigation to ensure "fresh" load feel
            window.scrollTo({ top: 0, behavior: 'instant' });
            router.push(href);
        }
    };

    return (
        <div className="flex gap-16">
            {/* Left */}
            <div className="w-48 flex-shrink-0">
                <h3 className="text-lg font-semibold text-foreground mb-1">{data.label}</h3>
                <p className="text-xs text-muted-foreground mb-5">{data.tagline}</p>
                <a
                    href={data.cta.href}
                    onClick={(e) => handleNavigate(e, data.cta.href)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                    {data.cta.label}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
            </div>

            {/* Divider */}
            <div className="w-px bg-border" />

            {/* Columns */}
            <div className={`flex-1 grid grid-cols-2 lg:grid-cols-${data.columns.length > 2 ? '3' : '2'} gap-8`}>
                {data.columns.map((column, colIdx) => (
                    <div key={colIdx}>
                        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">{column.title}</h4>
                        <div className="space-y-0.5">
                            {column.items.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href || "#"}
                                    onClick={(e) => handleNavigate(e, item.href || "#")}
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
