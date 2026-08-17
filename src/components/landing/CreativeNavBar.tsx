"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Plus,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Cloud,
  Bot,
  Code,
  Terminal,
  FileText,
  Globe,
  Search,
  BookOpen,
  FileSpreadsheet,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import CartIcon from "@/components/shop/CartIcon";
import { CDN_ASSETS } from "@/lib/cdn";
import logoText from "../../../design/images/raw/logo-text.png";

const urls = ["https://lms.zecurx.com/", "https://ctf.zecurx.com/"];

const iconMap: Record<string, React.ElementType> = {
  // Services
  "Offensive Security & Penetration Testing": Shield,
  "Cloud & DevSecOps": Cloud,
  "Secure AI & LLM Security": Bot,
  "Secure Application Development": Code,
  "SOC, Detection & Response": Terminal,
  "Compliance & Governance": FileText,
  "Web3, Blockchain & NFT Development": Globe,
  // Resources
  "Security Research": Search,
  "Security Blog": BookOpen,
  Whitepapers: FileSpreadsheet,
  "Case Studies": Briefcase,
  LMS: GraduationCap,
  CTF: Shield,
  // Academy
  Training: GraduationCap,
  Seminars: Users,
};

const navData = {
  services: {
    label: "Services",
    href: "/services",
    description: "Expert security services",
    featuredCta: "View all Services",
    items: [
      {
        title: "Offensive Security & Penetration Testing",
        href: "/services/offensive-security",
        desc: "Web, API, and infrastructure penetration testing with real-world attack simulation",
      },
      {
        title: "Cloud & DevSecOps",
        href: "/services/cloud-devsecops",
        desc: "Cloud posture management and CI/CD pipeline security across AWS, GCP, and Azure",
      },
      {
        title: "Secure AI & LLM Security",
        href: "/services/secure-ai-llm",
        desc: "LLM security, prompt injection protection, and AI abuse testing",
      },
      {
        title: "Secure Application Development",
        href: "/services/secure-app-dev",
        desc: "Secure SDLC implementation from design to deployment",
      },
      {
        title: "SOC, Detection & Response",
        href: "/services/soc-detection",
        desc: "24/7 monitoring, threat detection, and incident response",
      },
      {
        title: "Compliance & Governance",
        href: "/services/compliance-governance",
        desc: "SOC 2, ISO 27001, GDPR and DPDP readiness programs",
      },
      {
        title: "Web3, Blockchain & NFT Development",
        href: "/services/web3-blockchain-nft",
        desc: "Smart contract security and decentralized application protection",
      },
    ],
  },
  resources: {
    label: "Resources",
    href: "/resources",
    description: "Security insights & research",
    featuredCta: "Explore Resources",
    items: [
      {
        title: "Security Research",
        href: "/resources/research",
        desc: "Vulnerability research & advisories",
      },
      {
        title: "Security Blog",
        href: "/blog",
        desc: "Latest insights & technical articles",
      },
      {
        title: "Whitepapers",
        href: "/resources/whitepapers",
        desc: "In-depth security research",
      },
      {
        title: "Case Studies",
        href: "/resources/case-studies",
        desc: "Real-world security solutions",
      },
      {
        title: "LMS",
        href: urls[0],
        desc: "Learn without limits. Grow without boundaries.",
      },
      {
        title: "CTF",
        href: urls[1],
        desc: "Advanced CTF Platform to Master Ethical hacking",
      },
    ],
  },
  academy: {
    label: "Academy",
    href: "/academy",
    description: "Certified security training",
    featuredCta: "Explore Academy",
    items: [
      {
        title: "Training",
        href: "/academy#courses",
        desc: "Certified security training programs",
      },
      {
        title: "Seminars",
        href: "/resources/seminars",
        desc: "Live workshops & events",
      },
    ],
  },
};

const simpleLinks = [
  { label: "Industries", href: "/industries" },
  { label: "Security Toolkit", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "How We Work", href: "/how-we-work" },
];

const megaMenus = Object.entries(navData).map(([key, data]) => ({
  key,
  label: data.label,
  href: data.href,
  description: data.description,
  featuredCta: data.featuredCta,
  items: data.items.map((item, i) => ({
    id: String(i + 1).padStart(2, "0"),
    title: item.title,
    description: item.desc,
    href: item.href,
  })),
}));

export default function CreativeNavBar({
  forceDark = false,
  showCart = false,
  expanded = false,
}: {
  forceDark?: boolean;
  showCart?: boolean;
  expanded?: boolean;
}) {
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

  const active = megaMenus.find((m) => m.key === openMenu);

  return (
    <>
      <div
        ref={wrapRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[999] transition-all duration-300",
          expanded
            ? "p-0 md:px-0 pt-0"
            : "p-4 md:px-8 pt-6"
        )}
      >
        <div className={cn("mx-auto transition-all duration-300", expanded ? "max-w-full" : "max-w-[1180px]")}>
          <nav className={cn(
            "flex items-center justify-between border border-white/60 bg-white/70 px-5 py-2 shadow-[0_8px_32px_-8px_rgba(91,110,245,0.18)] backdrop-blur-xl transition-all duration-300",
            expanded ? "rounded-none" : "rounded-full"
          )}>
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              {/* No background, no rounded container—just the icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/icons/icon.png"
                  alt="ZecurX Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <Image
                src={logoText}
                alt="ZecurX"
                width={150}
                height={40}
                className="h-5 w-auto object-contain"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1 rounded-full bg-white/40 px-1.5 py-1.5">
              {megaMenus.map((menu) => (
                <button
                  key={menu.key}
                  onMouseEnter={() => setOpenMenu(menu.key)}
                  onClick={() =>
                    setOpenMenu(openMenu === menu.key ? null : menu.key)
                  }
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-all",
                    openMenu === menu.key
                      ? "bg-white text-[#4C4FE0] shadow-sm"
                      : "text-[#55577A] hover:bg-white/70",
                  )}
                >
                  {menu.label}{" "}
                  <ChevronDown
                    size={13}
                    className={cn(
                      "transition-transform duration-200",
                      openMenu === menu.key ? "rotate-180" : "",
                    )}
                  />
                </button>
              ))}
              {simpleLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onMouseEnter={() => setOpenMenu(null)}
                  className="rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#55577A] transition-colors hover:bg-white/70"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {showCart && <CartIcon />}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(91,110,245,0.55)] transition-transform hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg,#5B6EF5,#8B5CF6)",
                }}
              >
                Contact <ArrowUpRight size={15} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseLeave={() => setOpenMenu(null)}
                className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 mx-auto max-w-[880px] overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_30px_60px_-20px_rgba(76,79,224,0.35)] backdrop-blur-2xl"
              >
                <div className="grid grid-cols-12">
                  <div
                    className="col-span-12 md:col-span-4 p-8 flex flex-col justify-between"
                    style={{
                      background: "linear-gradient(155deg,#EEF0FE,#F7F1FE)",
                    }}
                  >
                    <div>
                      <span className="text-[10.5px] font-bold tracking-wide text-[#5B6EF5] uppercase">
                        Overview
                      </span>
                      <h3 className="mt-4 text-[24px] font-extrabold text-[#1A1B2E] leading-tight">
                        {active.description}
                      </h3>
                    </div>
                    <Link
                      href={active.href}
                      onClick={() => setOpenMenu(null)}
                      className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#4C4FE0]"
                    >
                      {active.featuredCta} <ArrowUpRight size={14} />
                    </Link>
                  </div>
                  <div className="col-span-12 md:col-span-8 p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {active.items.map((item) => {
                      // 1. Get the specific icon from your iconMap
                      const IconComponent = iconMap[item.title];

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/90"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FE] group-hover:bg-[#5B6EF5] transition-colors text-[#5B6EF5] group-hover:text-white">
                            {/* 2. Render the Lucide icon if it exists, otherwise fallback to a default */}
                            {IconComponent ? (
                              <IconComponent size={18} />
                            ) : (
                              <Shield size={18} />
                            )}
                          </div>
                          <div>
                            <span className="block text-[13px] font-bold text-[#1A1B2E]">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] text-[#8688A6]">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#F4F9FF] lg:hidden shadow-2xl flex flex-col h-full"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <Image src={logoText} alt="ZecurX" width={120} height={30} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500"
                >
                  <X />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {megaMenus.map((menu) => (
                  <div key={menu.key}>
                    <div className="text-sm font-bold text-[#5B6EF5] mb-3">
                      {menu.label}
                    </div>
                    {menu.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-[15px] font-medium text-slate-700"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className={cn("transition-all duration-300", expanded ? "h-[52px]" : "h-[84px]")} />
    </>
  );
}
