"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Resources", href: "/blog" },
    { label: "Academy", href: "/academy" },
    { label: "How We Work", href: "/how-we-work" },
];

export default function NavBarV2() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-7 h-7 transition-transform group-hover:scale-110 duration-300">
                            <Image
                                src="https://zecurx-web.fsn1.your-objectstorage.com/images/zecurx-logo.png"
                                alt="ZecurX"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-manrope font-bold text-lg tracking-tight text-white">
                            ZecurX
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300 font-inter"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/contact"
                            className="hidden md:flex h-9 px-6 items-center text-sm font-manrope font-medium text-black bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
                        >
                            Contact
                        </Link>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center text-white/60"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20"
                    >
                        <div className="max-w-sm mx-auto px-6 py-8 space-y-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-2xl font-manrope font-light text-white/60 hover:text-white transition-colors block py-2"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="pt-6 border-t border-white/10"
                            >
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="inline-flex h-12 px-8 items-center text-sm font-manrope font-semibold text-black bg-white"
                                >
                                    Contact Us
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
