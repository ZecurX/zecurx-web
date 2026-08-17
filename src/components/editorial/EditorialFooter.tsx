"use client";

import React from "react";
import Link from "next/link";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Settings", href: "/cookie-policy" },
] as const;

export default function EditorialFooter() {
  return (
    <footer className="zx-editorial w-full bg-[color:var(--zx-surface-container-low)] pt-[120px] pb-12 overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="flex-1">
          <h2 className="font-libre-caslon text-[12vw] leading-none text-[color:var(--zx-on-surface)] opacity-[0.05] select-none -mb-4 -ml-4">
            Zecurx
          </h2>
          <div className="flex flex-wrap gap-8 items-center">
            <div className="h-8 w-px bg-[color:var(--zx-outline-variant)]/30" />
            <div className="font-manrope text-[11px] opacity-40 uppercase tracking-widest text-[color:var(--zx-on-surface)]">
              ISO 27001 Certified
            </div>
            <div className="font-manrope text-[11px] opacity-40 uppercase tracking-widest text-[color:var(--zx-on-surface)]">
              SOC2 Type II
            </div>
            <div className="font-manrope text-[11px] opacity-40 uppercase tracking-widest text-[color:var(--zx-on-surface)]">
              GDPR Compliant
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <span className="font-manrope text-[11px] font-semibold text-[color:var(--zx-on-surface-variant)] uppercase tracking-[0.1em]">
            Newsletter
          </span>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-[color:var(--zx-surface-variant)]/20 border border-[color:var(--zx-outline-variant)]/30 rounded-full px-6 py-3 font-manrope text-sm text-[color:var(--zx-on-surface)] focus:outline-none focus:border-[color:var(--zx-tertiary)]/50"
            />
            <button
              type="button"
              aria-label="Subscribe"
              className="p-3 rounded-full bg-[color:var(--zx-secondary-container)] text-[color:var(--zx-on-secondary-container)] hover:bg-[color:var(--zx-secondary-fixed)] transition-colors flex items-center justify-center"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 border-t border-[color:var(--zx-outline-variant)]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[color:var(--zx-on-surface-variant)] font-manrope text-[10px] uppercase tracking-[0.2em]">
        <span>&copy; {new Date().getFullYear()} Zecurx Global. Intellectual protection for the digital age.</span>
        <div className="flex gap-8">
          {legalLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-[color:var(--zx-on-surface)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
