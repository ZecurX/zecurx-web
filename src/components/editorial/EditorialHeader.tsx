"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallback";

const urls = ["https://lms.zecurx.com/", "https://ctf.zecurx.com/"];

// Verbatim from the supplied mockups (about_code.html / academy_code.html /
// services_code.html / landing-page-code.html all reuse this exact avatar src).
const MOCKUP_AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida/AP1WRLstr1EK8ZVDKRrtr3I4SVhmq89mpzTAJp3t9jUby6M0JKETLlht4LI3gNm6YRKSGPVjPAhvR-sfKDwQislHJPpd0cyJc6-NJQHnGSUdlpG6B1I4E3plJhIdhmn-mkb90wPkfoGnkINLjXoPNmj_CMJ8uptvCK_eymGix-Y0epkn7LDn3Vv9irjynn4p7Gx__1YQyOSzsyd5tPiJJYQTNyf7c-Ylq9XdyJKXwUgZLM8C4t8O_Oxk7dLS6b8";

const navData = {
  services: {
    label: "Services",
    href: "/services",
    items: [
      { title: "Offensive Security & Penetration Testing", href: "/services/offensive-security" },
      { title: "Cloud & DevSecOps", href: "/services/cloud-devsecops" },
      { title: "Secure AI & LLM Security", href: "/services/secure-ai-llm" },
      { title: "Secure Application Development", href: "/services/secure-app-dev" },
      { title: "SOC, Detection & Response", href: "/services/soc-detection" },
      { title: "Compliance & Governance", href: "/services/compliance-governance" },
      { title: "Web3, Blockchain & NFT Development", href: "/services/web3-blockchain-nft" },
    ],
  },
  resources: {
    label: "Resources",
    href: "/resources",
    items: [
      { title: "Security Research", href: "/resources/research" },
      { title: "Security Blog", href: "/blog" },
      { title: "Whitepapers", href: "/resources/whitepapers" },
      { title: "Case Studies", href: "/resources/case-studies" },
      { title: "LMS", href: urls[0] },
      { title: "CTF", href: urls[1] },
    ],
  },
  academy: {
    label: "Academy",
    href: "/academy",
    items: [
      { title: "Training", href: "/academy#courses" },
      { title: "Seminars", href: "/resources/seminars" },
    ],
  },
};

const simpleLinks = [
  { key: "industries", label: "Industries", href: "/industries" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

const megaMenus = Object.entries(navData).map(([key, data]) => ({
  key,
  label: data.label,
  href: data.href,
  items: data.items,
}));

export default function EditorialHeader({ active }: { active?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      ref={wrapRef}
      className="zx-editorial fixed top-0 left-0 right-0 z-50 border-b border-[color:var(--zx-outline-variant)]/40 bg-[color:var(--zx-surface)]/85 backdrop-blur-xl"
    >
      <div className="h-20 w-full px-5 md:px-8 lg:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-libre-caslon text-2xl text-[color:var(--zx-on-surface)] tracking-tight shrink-0"
        >
          Zecurx
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {megaMenus.map((menu) => (
            <button
              key={menu.key}
              onMouseEnter={() => setOpenMenu(menu.key)}
              onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                active === menu.key
                  ? "text-[color:var(--zx-primary)]"
                  : "text-[color:var(--zx-on-surface-variant)] hover:text-[color:var(--zx-on-surface)]",
              )}
            >
              {menu.label}
              <ChevronDown
                size={12}
                className={cn("transition-transform duration-200", openMenu === menu.key ? "rotate-180" : "")}
              />
            </button>
          ))}
          {simpleLinks.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onMouseEnter={() => setOpenMenu(null)}
              className={cn(
                "px-4 py-2 font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                active === l.key
                  ? "text-[color:var(--zx-primary)]"
                  : "text-[color:var(--zx-on-surface-variant)] hover:text-[color:var(--zx-on-surface)]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center bg-[color:var(--zx-tertiary)] text-[color:var(--zx-on-tertiary)] px-6 py-2 rounded-full font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
          >
            Client Portal
          </Link>
          <div className="hidden md:flex w-8 h-8 rounded-full bg-[color:var(--zx-tertiary)] items-center justify-center overflow-hidden shrink-0">
            <ImageWithFallback
              src={MOCKUP_AVATAR_SRC}
              alt="Profile"
              className="w-full h-full object-cover"
              fallback={<Image src="/icons/icon.png" alt="Zecurx" width={18} height={18} className="object-contain" />}
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[color:var(--zx-on-surface)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Dropdown panel */}
      {openMenu && (
        <div
          onMouseLeave={() => setOpenMenu(null)}
          className="absolute left-0 right-0 top-full border-b border-[color:var(--zx-outline-variant)]/40 bg-[color:var(--zx-surface-container-lowest)] shadow-none"
        >
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
            {megaMenus
              .find((m) => m.key === openMenu)
              ?.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpenMenu(null)}
                  className="group flex flex-col gap-1 border-l border-[color:var(--zx-outline-variant)]/50 pl-4 py-1 hover:border-[color:var(--zx-secondary)] transition-colors"
                >
                  <span className="font-manrope text-[13px] font-semibold text-[color:var(--zx-on-surface)] group-hover:text-[color:var(--zx-secondary)] transition-colors">
                    {item.title}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-[color:var(--zx-surface)] overflow-y-auto">
          <div className="p-6 space-y-8">
            {megaMenus.map((menu) => (
              <div key={menu.key}>
                <div className="font-libre-caslon text-lg text-[color:var(--zx-on-surface)] mb-3">
                  {menu.label}
                </div>
                <div className="space-y-2">
                  {menu.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 font-manrope text-sm text-[color:var(--zx-on-surface-variant)]"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-[color:var(--zx-outline-variant)]/40 space-y-3">
              {simpleLinks.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-manrope text-sm font-semibold uppercase tracking-[0.1em] text-[color:var(--zx-on-surface-variant)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
