"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileSearch, Search, Lock, Code2, FolderSearch, Radar } from "lucide-react";
import { getCdnUrl } from "@/lib/cdn";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";
import { MagicCard } from "@/components/ui/magic-card";

const tools = [
  {
    title: "Subdomain Finder",
    description:
      "Uncover hidden subdomains with lightning speed. Essential for mapping the attack surface of an organization.",
    icon: Search,
    href: "/tools/subdomain-finder",
    image: "/assets/tool-subdomain.webp",
    lottie: getCdnUrl("lottie/subdomain.json"),
  },
  {
    title: "Directory Scanner",
    description:
      "Discovers hidden website directories and paths. Finds admin panels, backup files, and sensitive configurations.",
    icon: FolderSearch,
    href: "/tools/directory-scanner",
    image: "/assets/tool-directory.webp",
    lottie: getCdnUrl("lottie/dirfinder.json"),
  },
  {
    title: "Port Radar",
    description:
      "Identifies open network service ports. Determine which services are running and potentially vulnerable.",
    icon: Radar,
    href: "/tools/port-radar",
    image: "/assets/tool-port.webp",
    lottie: getCdnUrl("lottie/radar.json"),
  },
  {
    title: "TLS/SSL Analyzer",
    description:
      "Checks certificate security and configuration. Ensures your encryption standards meet modern safety requirements.",
    icon: Lock,
    href: "/tools/ssl-analyzer",
    image: "/assets/tool-ssl.webp",
    lottie: getCdnUrl("lottie/ssl.json"),
  },
  {
    title: "Param Finder",
    description:
      "Detects website parameters for testing. Critical for finding XSS, SQLi, and other injection vulnerabilities.",
    icon: Code2,
    href: "/tools/param-finder",
    image: "/assets/tool-param.webp",
    lottie: getCdnUrl("lottie/param.json"),
  },
  {
    title: "Header Scanner",
    description:
      "Analyzes HTTP response security headers. Verifies presence of HSTS, CSP, X-Frame-Options, and more.",
    icon: FileSearch,
    href: "/tools/header-scanner",
    image: "/assets/tool-header.webp",
    lottie: getCdnUrl("lottie/header.json"),
  },
];

export default function ToolsClient() {
  return (
    <main className="relative min-h-screen bg-background font-sans">

      <div className="relative z-10 bg-background text-foreground overflow-hidden">
        <CreativeNavBar />

        {/* HERO */}
        <section className="relative flex items-center justify-center overflow-hidden bg-background min-h-[50vh] md:min-h-[60vh] px-4 pt-32 pb-20 contain-paint">

          {/* Dot matrix pattern */}
          <DotPattern
            width={18}
            height={18}
            cr={1.1}
            randomOpacity
            className="text-slate-400/50 dark:text-slate-500/30"
          />

          <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <div className="flex flex-col items-start text-left">
                <BlurFade delay={0.2} inView={true} direction="up">
                  <h1
                    className="text-5xl sm:text-6xl md:text-7xl font-manrope font-bold text-foreground leading-[1.05] mb-6"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    <HeroWords>VulnHunter</HeroWords>
                    <br />
                    <HeroWords delay={heroEnd(1)}>
                      <span
                        className="text-[#4c69e4]"
                        style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2em" }}
                      >
                        Suite
                      </span>
                    </HeroWords>
                  </h1>
                </BlurFade>

                <BlurFade delay={0.3} inView={true} direction="up">
                  <p className="mt-4 text-lg md:text-xl text-muted-foreground font-inter leading-relaxed max-w-xl">
                    Advanced reconnaissance and asset monitoring tools used by our own
                    red teams. Now available for your security operations.
                  </p>
                </BlurFade>
              </div>

              <div className="relative flex justify-center items-center h-[300px] md:h-[450px]">
                <BlurFade delay={0.4} inView={true} direction="up" className="w-full h-full max-w-[500px]">
                  <LottieAnimation
                    src={getCdnUrl("lottie/securityvuln.json")}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    speed={1}
                  />
                </BlurFade>
              </div>
              
            </div>

            <DotPattern width={18} height={18} cr={1.1} randomOpacity />


          </div>
        </section>

        {/* TOOLS */}
        <section className="pt-16 md:pt-20 pb-24 md:pb-32 px-6">
          <div className="max-w-[1320px] mx-auto">

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {tools.map((tool, idx) => (
                <Link key={idx} href={tool.href} className="group h-full">

                  {/* ✅ MAGICCARD FIX (NO DARK GLOW) */}
                  <MagicCard
                    className="h-full flex flex-col p-6 md:p-8 bg-background border border-border/40 shadow-sm hover:shadow-md transition"
                    gradientColor="transparent"
                  >

                    <h3 className="text-2xl font-bold mb-3 text-center group-hover:text-[#4c69e4] transition">
                      {tool.title}
                    </h3>

                    <p className="text-muted-foreground text-center mb-6 flex-grow">
                      {tool.description}
                    </p>

                    <div className="w-full h-48 mt-auto rounded-xl overflow-hidden border border-border/50 relative bg-muted/20 flex items-center justify-center group-hover:border-[#4c69e4]/30 transition-colors group-hover:shadow-[0_0_30px_-10px_rgba(74,111,250,0.2)]">
                      
                      {tool.lottie ? (
                        <LottieAnimation
                          src={tool.lottie}
                          className="w-full h-full object-contain p-4 transition-all group-hover:scale-105 duration-700 ease-out z-10"
                          speed={1}
                        />
                      ) : (
                        <>
                          {/* Image placeholder adhering to requirements */}
                          <img
                            src={tool.image}
                            alt={`${tool.title} interface`}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-700 ease-out z-10"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          {/* Fallback layout if image not present */}
                          <div className="flex flex-col items-center justify-center text-muted-foreground/40 relative z-0">
                            <tool.icon className="w-10 h-10 mb-3 opacity-50" strokeWidth={1} />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Interface Preview</span>
                          </div>
                        </>
                      )}
                    </div>

                  </MagicCard>

                </Link>
              ))}

            </div>
          </div>
        </section>

        {/* CTA (UNCHANGED ORIGINAL STYLE) */}
        <section className="py-24 md:py-32 bg-background border-t border-border/40">
          <div className="max-w-[1320px] mx-auto px-6 text-center">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Go Deeper?
            </h2>

            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Join thousands of security researchers using ZecurX tools to discover vulnerabilities faster.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <button className="bg-[#4c69e4] text-white px-8 py-4 rounded-full hover:bg-[#375bde] transition">
                  Get Enterprise Access
                </button>
              </Link>

              <Link href="/services#ptaas">
                <button className="border border-border/50 px-8 py-4 rounded-full hover:bg-muted/50 transition">
                  Explore PTaaS
                </button>
              </Link>
            </div>

          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}