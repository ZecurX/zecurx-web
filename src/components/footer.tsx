"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const NAV_LINKS = {
    "Services": [
        { label: "Application Security", href: "/services/appsec" },
        { label: "Cloud Security", href: "/services/cloud" },
        { label: "AI Security", href: "/services/ai" },
        { label: "Compliance", href: "/services/compliance" },
    ],
    "Company": [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
    ],
    "Resources": [
        { label: "Case Studies", href: "/resources" },
        { label: "Security Guides", href: "/resources/guides" },
        { label: "Book a Demo", href: "/book-demo" },
    ]
}

export function Footer() {
    return (
        <footer className="border-t border-border pt-16 pb-10 bg-background">
            <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-5">
                            <span className="text-xl font-bold text-blue-500">ZecurX</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                            Enterprise-grade cybersecurity for startups and engineering teams. Security that lets you ship fearlessly.
                        </p>
                        <div className="space-y-2 text-sm mb-5">
                            <a href="mailto:hello@zecurx.com" className="block text-muted-foreground hover:text-foreground transition-colors">
                                hello@zecurx.com
                            </a>
                        </div>
                        <div className="flex gap-2">
                            {[{ label: "LinkedIn", icon: "in" }, { label: "Twitter", icon: "𝕏" }].map((s) => (
                                <motion.a
                                    key={s.label}
                                    href="#"
                                    whileHover={{ y: -1 }}
                                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={s.label}
                                >
                                    {s.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(NAV_LINKS).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">{section}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} ZecurX Security Pvt. Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
