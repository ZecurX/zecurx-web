"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CDN_ASSETS } from "@/lib/cdn";

export default function FooterV2() {
    return (
        <footer className="relative border-t border-white/[0.06] bg-black">
            <div className="max-w-6xl mx-auto w-full px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 xl:gap-8 mb-16">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                            aria-label="ZecurX Home"
                        >
                            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300">
                                <Image
                                    src={CDN_ASSETS.brand.logo}
                                    alt="ZecurX"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-manrope font-bold text-xl tracking-tight text-white">
                                ZecurX
                            </span>
                        </Link>
                        <p className="text-white/25 text-sm leading-relaxed max-w-xs font-inter">
                            Security & Technology That Grows With You.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <FooterColumn
                            title="Services"
                            links={[
                                { label: "Application Security", href: "/services/application-security" },
                                { label: "Cloud & DevSecOps", href: "/services/cloud-devsecops" },
                                { label: "Secure AI Development", href: "/services/secure-ai-development" },
                                { label: "Compliance Readiness", href: "/services/compliance-readiness" },
                            ]}
                        />
                        <FooterColumn
                            title="Industries"
                            links={[
                                { label: "SaaS & Startups", href: "/industries" },
                                { label: "AI Companies", href: "/industries" },
                                { label: "SMEs", href: "/industries" },
                                { label: "EdTech & Colleges", href: "/industries" },
                            ]}
                        />
                        <FooterColumn
                            title="Resources"
                            links={[
                                { label: "Blog", href: "/blog" },
                                { label: "Guides & Checklists", href: "/resources/guides" },
                                { label: "Free Tools", href: "/tools" },
                                { label: "Academy", href: "/academy" },
                            ]}
                        />
                        <FooterColumn
                            title="Company"
                            links={[
                                { label: "How We Work", href: "/how-we-work" },
                                { label: "Contact", href: "/contact" },
                            ]}
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/20">
                        &copy; 2026 ZecurX Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link
                            href="/privacy-policy"
                            className="text-xs text-white/20 hover:text-white/50 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="text-xs text-white/20 hover:text-white/50 transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div className="space-y-4">
            <h4 className="font-manrope font-semibold text-xs text-white/40 uppercase tracking-[0.15em]">
                {title}
            </h4>
            <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                    <li key={link.href + link.label}>
                        <Link
                            href={link.href}
                            className="text-sm text-white/20 hover:text-white/60 transition-colors font-inter"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
