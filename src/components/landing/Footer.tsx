"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CDN_ASSETS } from "@/lib/cdn";

const footerLinks = {
  Services: [
    { label: "Application Security", href: "/services/application-security" },
    { label: "Cloud & DevSecOps", href: "/services/cloud-devsecops" },
    {
      label: "Secure AI Development",
      href: "/services/secure-ai-development",
    },
    { label: "Compliance Readiness", href: "/services/compliance-readiness" },
  ],
  Industries: [
    { label: "SaaS & Startups", href: "/industries" },
    { label: "AI Companies", href: "/industries" },
    { label: "SMEs", href: "/industries" },
    { label: "EdTech & Colleges", href: "/industries" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Guides & Checklists", href: "/resources/guides" },
    { label: "Free Tools", href: "/tools" },
    { label: "Academy", href: "/academy" },
  ],
  Company: [
    { label: "How We Work", href: "/how-we-work" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Sitemap", href: "/sitemap" },
] as const;

export default function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden border-t border-blue-200/70 bg-[linear-gradient(180deg,#dbeafe_0%,#eaf3ff_42%,#f4f8ff_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(74,111,250,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,111,250,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(65%_55%_at_50%_30%,black,transparent)]" />
      <div className="relative max-w-[1320px] mx-auto px-6 py-14 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 rounded-3xl border border-white/75 bg-white/55 p-8 shadow-[0_20px_55px_rgba(30,58,95,0.12)] backdrop-blur-md xl:grid-cols-4 md:p-10">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="ZecurX Home"
            >
              <div className="relative w-14 h-14">
                <Image
                  src={CDN_ASSETS.brand.logo}
                  alt="ZecurX"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-manrope text-2xl font-semibold text-slate-900">
                ZecurX
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Security &amp; Technology That Grows With You.
            </p>
          </div>

          {/* Links Grid */}
          <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="mb-4 font-space-grotesk text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {heading}
                </h4>
                <ul className="space-y-2.5" role="list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-700 transition-colors hover:text-[#3658d8]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-7 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; 2026 ZecurX Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-slate-500 transition-colors hover:text-[#3658d8]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
