"use client";
import React from 'react';
import { imgIcon } from './assets';
import { Shield } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
    return (
        <div
            className="relative md:h-[400px]"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="w-full">
                <footer className="h-full bg-background text-foreground border-t border-border flex flex-col justify-end">
                    <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
                        {/* Top Section: Logo & Columns */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 xl:gap-8 mb-auto">

                            {/* Brand Column */}
                            <div className="space-y-6">
                                <Link href="/" className="flex items-center gap-2.5">
                                    <div className="relative w-8 h-8">
                                        <img src="/images/zecurx-logo.png" alt="ZecurX" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-manrope font-bold text-xl tracking-tight text-foreground">ZecurX</span>
                                </Link>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                                    Security & Technology That Grows With You. Enterprise-grade protection for the modern era.
                                </p>
                            </div>

                            {/* Links Grid - Aligned with Navbar */}
                            <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
                                {/* Platform */}
                                <div className="space-y-4">
                                    <h4 className="font-manrope font-semibold text-sm text-foreground">Platform</h4>
                                    <ul className="space-y-3">
                                        <li><Link href="/platform/endpoint-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Endpoint Security</Link></li>
                                        <li><Link href="/platform/cloud-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cloud Security</Link></li>
                                        <li><Link href="/platform/identity-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Identity Security</Link></li>
                                        <li><Link href="/platform/application-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">App Security</Link></li>
                                    </ul>
                                </div>

                                {/* Solutions */}
                                <div className="space-y-4">
                                    <h4 className="font-manrope font-semibold text-sm text-foreground">Solutions</h4>
                                    <ul className="space-y-3">
                                        <li><Link href="/solutions/digital-transformation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Digital Transformation</Link></li>
                                        <li><Link href="/solutions/zero-trust" className="text-sm text-muted-foreground hover:text-primary transition-colors">Zero Trust</Link></li>
                                        <li><Link href="/solutions/ransomware-defense" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ransomware Defense</Link></li>
                                        <li><Link href="/solutions/compliance" className="text-sm text-muted-foreground hover:text-primary transition-colors">Compliance</Link></li>
                                    </ul>
                                </div>

                                {/* Services */}
                                <div className="space-y-4">
                                    <h4 className="font-manrope font-semibold text-sm text-foreground">Services</h4>
                                    <ul className="space-y-3">
                                        <li><Link href="/services/offensive/penetration-testing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Penetration Testing</Link></li>
                                        <li><Link href="/services/offensive/vulnerability-management" className="text-sm text-muted-foreground hover:text-primary transition-colors">Vulnerability Mgmt</Link></li>
                                        <li><Link href="/services/engineering/devsecops" className="text-sm text-muted-foreground hover:text-primary transition-colors">DevSecOps</Link></li>
                                        <li><Link href="/services/engineering/consulting" className="text-sm text-muted-foreground hover:text-primary transition-colors">Consulting</Link></li>
                                    </ul>
                                </div>

                                {/* Company & Resources */}
                                <div className="space-y-4">
                                    <h4 className="font-manrope font-semibold text-sm text-foreground">Company</h4>
                                    <ul className="space-y-3">
                                        <li><Link href="/why-zecurx" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                                        <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                                        <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                                        <li><Link href="/resources/research" className="text-sm text-muted-foreground hover:text-primary transition-colors">Research</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} ZecurX. All rights reserved.</p>
                            <div className="flex gap-6">
                                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                                <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
