"use client";
import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative mt-20 border-t border-white/10 bg-background/50 backdrop-blur-xl">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 xl:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
                                <Image 
                                    src="/images/zecurx-logo.png" 
                                    alt="ZecurX" 
                                    fill
                                    className="object-contain" 
                                />
                            </div>
                            <span className="font-manrope font-bold text-2xl tracking-tight text-foreground">ZecurX</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-light">
                            Security & Technology That Grows With You. Enterprise-grade protection for the modern era.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <h4 className="font-manrope font-semibold text-sm text-foreground tracking-wide">Platform</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/platform/endpoint-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Endpoint Security</Link></li>
                                <li><Link href="/platform/cloud-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cloud Security</Link></li>
                                <li><Link href="/platform/identity-security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Identity Security</Link></li>
                                <li><Link href="/platform/ai-detection" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Detection</Link></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <h4 className="font-manrope font-semibold text-sm text-foreground tracking-wide">Solutions</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/solutions/digital-transformation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Digital Transformation</Link></li>
                                <li><Link href="/solutions/zero-trust" className="text-sm text-muted-foreground hover:text-primary transition-colors">Zero Trust</Link></li>
                                <li><Link href="/solutions/ransomware-defense" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ransomware Defense</Link></li>
                                <li><Link href="/solutions/ai-powered-soc" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI SOC</Link></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                            <h4 className="font-manrope font-semibold text-sm text-foreground tracking-wide">Services</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/services/offensive/penetration-testing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Penetration Testing</Link></li>
                                <li><Link href="/services/offensive/vulnerability-management" className="text-sm text-muted-foreground hover:text-primary transition-colors">Red Teaming</Link></li>
                                <li><Link href="/services/engineering/devsecops" className="text-sm text-muted-foreground hover:text-primary transition-colors">DevSecOps</Link></li>
                                <li><Link href="/services/engineering/consulting" className="text-sm text-muted-foreground hover:text-primary transition-colors">CISO Advisory</Link></li>
                            </ul>
                        </div>

                        {/* Column 4 */}
                        <div className="space-y-4">
                            <h4 className="font-manrope font-semibold text-sm text-foreground tracking-wide">Company</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/why-zecurx" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground/60">
                        &copy; {new Date().getFullYear()} ZecurX Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="/sitemap" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
