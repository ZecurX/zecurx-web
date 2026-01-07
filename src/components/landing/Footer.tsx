"use client";
import React from 'react';
import { imgIcon } from './assets';
import { Shield } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="relative h-[700px] md:h-[500px] bg-background text-foreground" style={{ clipPath: "inset(0 0 0 0)" }}>
            <footer className="fixed bottom-0 left-0 w-full h-[700px] md:h-[500px] bg-background text-foreground flex flex-col justify-between overflow-hidden border-t border-border">

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20">

                    {/* Top Row: Logo & Columns */}
                    <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-24">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="xl:w-1/4 space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-10 h-10 object-contain" />
                                <span className="font-manrope font-bold text-2xl tracking-tight text-foreground">ZecurX</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
                                Transform your business with comprehensive cybersecurity solutions designed by industry experts.
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <a href="mailto:official@zecurx.com" className="block hover:text-foreground transition-colors">official@zecurx.com</a>
                                <a href="tel:+917488813601" className="block hover:text-foreground transition-colors">+91 7488813601</a>
                                <p>Bel Road, Bengaluru 560094, India</p>
                            </div>
                        </motion.div>

                        {/* Links Grid */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
                            {[
                                {
                                    title: 'Platform',
                                    items: [
                                        { label: 'Enterprise Security', href: '/platform/endpoint-security' },
                                        { label: 'Threat Detection', href: '/platform/threat-intelligence' },
                                        { label: 'Security Architecture', href: '/platform' },
                                        { label: 'Risk & Compliance', href: '/solutions/compliance' }
                                    ]
                                },
                                {
                                    title: 'Services',
                                    items: [
                                        { label: 'Security Assessments', href: '/services/offensive/vulnerability-management' },
                                        { label: 'Penetration Testing', href: '/services/offensive/penetration-testing' },
                                        { label: 'Red Teaming', href: '/services#offensive' },
                                        { label: 'Incident Response', href: '/services' },
                                        { label: 'Governance', href: '/services/engineering/consulting' }
                                    ]
                                },
                                {
                                    title: 'Industries',
                                    items: [
                                        { label: 'Finance', href: '/industries' },
                                        { label: 'Healthcare', href: '/industries' },
                                        { label: 'Education', href: '/industries' },
                                        { label: 'Technology', href: '/industries' },
                                        { label: 'Government', href: '/industries' },
                                        { label: 'Manufacturing', href: '/industries' }
                                    ]
                                },
                                {
                                    title: 'Company',
                                    items: [
                                        { label: 'About Us', href: '/why-zecurx' },
                                        { label: 'Mission', href: '/why-zecurx' },
                                        { label: 'Leadership', href: '/why-zecurx' },
                                        { label: 'Careers', href: '/' },
                                        { label: 'Contact', href: '/contact' },
                                        { label: 'Partners', href: '/' }
                                    ]
                                },
                                {
                                    title: 'Resources',
                                    items: [
                                        { label: 'Blog', href: '/resources/blog' },
                                        { label: 'Research', href: '/resources/research' },
                                        { label: 'Case Studies', href: '/resources' },
                                        { label: 'Webinars', href: '/resources/webinars' },
                                        { label: 'FAQ', href: '/resources' }
                                    ]
                                },
                                {
                                    title: 'Academy',
                                    items: [
                                        { label: 'Certifications', href: '#' },
                                        { label: 'Training', href: '#' },
                                        { label: 'Workshops', href: '#' },
                                        { label: 'For Academia', href: '#' },
                                        { label: 'Verify Certificate', href: '#' }
                                    ]
                                },
                            ].map((col, i) => (
                                <motion.div
                                    key={col.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col gap-4"
                                >
                                    <h4 className="font-manrope font-semibold text-xs uppercase tracking-wider text-muted-foreground">{col.title}</h4>
                                    <ul className="flex flex-col gap-3">
                                        {col.items.map((item) => (
                                            <li key={item.label}>
                                                <Link href={item.href} className="text-muted-foreground/80 hover:text-foreground transition-colors text-sm leading-snug block hover:translate-x-1 duration-300">
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-24 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-medium">
                        <p>&copy; 2025 ZecurX. All rights reserved.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</a>
                            <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                            <a href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>

                {/* Giant Watermark */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] pointer-events-none opacity-[0.03]">
                    <span className="text-[25vw] font-manrope font-bold leading-none tracking-tighter text-foreground">
                        ZecurX
                    </span>
                </div>

            </footer>
        </div>
    );
}
