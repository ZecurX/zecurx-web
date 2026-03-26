"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileSearch, Search, Lock, Code2, FolderSearch, Radar } from "lucide-react";
import dynamic from 'next/dynamic';
import securityVulnData from "../../../public/lottie/securityvuln.json";
import subdomainData from "../../../public/lottie/subdomain.json";
import dirfinderData from "../../../public/lottie/dirfinder.json";
import radarData from "../../../public/lottie/radar.json";
import sslData from "../../../public/lottie/ssl.json";
import paramData from "../../../public/lottie/param.json";
import headerData from "../../../public/lottie/header.json";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";
import { MagicCard } from "@/components/ui/magic-card";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const tools = [
  {
    title: "Subdomain Finder",
    description:
      "Uncover hidden subdomains with lightning speed. Essential for mapping the attack surface of an organization.",
    icon: Search,
    href: "/tools/subdomain-finder",
    image: "/assets/tool-subdomain.webp",
    lottie: subdomainData,
  },
  {
    title: "Directory Scanner",
    description:
      "Discovers hidden website directories and paths. Finds admin panels, backup files, and sensitive configurations.",
    icon: FolderSearch,
    href: "/tools/directory-scanner",
    image: "/assets/tool-directory.webp",
    lottie: dirfinderData,
  },
  {
    title: "Port Radar",
    description:
      "Identifies open network service ports. Determine which services are running and potentially vulnerable.",
    icon: Radar,
    href: "/tools/port-radar",
    image: "/assets/tool-port.webp",
    lottie: radarData,
  },
  {
    title: "TLS/SSL Analyzer",
    description:
      "Checks certificate security and configuration. Ensures your encryption standards meet modern safety requirements.",
    icon: Lock,
    href: "/tools/ssl-analyzer",
    image: "/assets/tool-ssl.webp",
    lottie: sslData,
  },
  {
    title: "Param Finder",
    description:
      "Detects website parameters for testing. Critical for finding XSS, SQLi, and other injection vulnerabilities.",
    icon: Code2,
    href: "/tools/param-finder",
    image: "/assets/tool-param.webp",
    lottie: paramData,
  },
  {
    title: "Header Scanner",
    description:
      "Analyzes HTTP response security headers. Verifies presence of HSTS, CSP, X-Frame-Options, and more.",
    icon: FileSearch,
    href: "/tools/header-scanner",
    image: "/assets/tool-header.webp",
    lottie: headerData,
  },
];

export default function ToolsClient() {
  return (
    <main className="relative min-h-screen bg-background font-sans">
      <div className="relative z-10 bg-background text-foreground selection:bg-foreground/20 overflow-hidden mb-[700px] md:mb-[420px]">
        <CreativeNavBar />

      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden bg-background min-h-[50vh] md:min-h-[60vh] px-4 pt-32 pb-20 contain-paint">
        {/* Organic blue-white blobs - exactly from hero.tsx */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto', contain: 'strict' }}>
          {/* Top-left blue blob */}
          <div
            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle at center, rgba(74, 111, 250, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
              willChange: 'transform',
            }}
          />
          {/* Center-right blue blob */}
          <div
            className="absolute top-1/3 right-[5%] w-[700px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.14) 0%, transparent 65%)",
              filter: "blur(70px)",
              willChange: 'transform',
            }}
          />
          {/* Center white patch (adapted for semantic text-foreground in light/dark) */}
          <div
            className="absolute top-[8%] left-[35%] w-[500px] h-[400px] rounded-full bg-foreground/5"
            style={{
              filter: "blur(40px)",
              willChange: 'transform',
            }}
          />
        </div>

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
                <Lottie 
                  animationData={securityVulnData} 
                  loop={true} 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </BlurFade>
            </div>
            
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="pb-24 md:pb-32 px-4 md:px-6 relative z-10 bg-background">
        <div className="max-w-[1320px] mx-auto">
          <BlurFade delay={0.4} inView={true} direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <Link href={tool.href} key={idx} className="block group h-full focus:outline-none">
                  <MagicCard
                    className="h-full flex flex-col p-6 md:p-8 bg-background hover:bg-muted/10 transition-colors border-border/40 shadow-sm"
                    gradientColor="rgba(74, 111, 250, 0.08)"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-xl bg-muted/50 text-foreground/80 group-hover:text-[#4c69e4] group-hover:bg-[#4c69e4]/10 transition-colors">
                        <tool.icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-[#4c69e4] group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3 font-manrope tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 flex-grow font-inter">
                      {tool.description}
                    </p>

                    <div className="w-full h-48 mt-auto rounded-xl overflow-hidden border border-border/50 relative bg-muted/20 flex items-center justify-center group-hover:border-[#4c69e4]/30 transition-colors group-hover:shadow-[0_0_30px_-10px_rgba(74,111,250,0.2)]">
                      
                      {tool.lottie ? (
                        <Lottie 
                          
                          animationData={tool.lottie} 
                          loop={true} 
                          className="w-full h-full object-contain p-4 transition-all group-hover:scale-105 duration-700 ease-out z-10"
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
          </BlurFade>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-border/40">
        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-muted/20 backdrop-blur-sm p-10 md:p-20 text-center">
            {/* Ambient Background for CTA Card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                  background: "radial-gradient(circle at center, rgba(74, 111, 250, 0.1) 0%, transparent 60%)",
                  filter: "blur(40px)",
                }}
              />
            </div>

            <div className="relative z-10">
              <BlurFade delay={0.2} inView={true} direction="up">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-foreground mb-6 tracking-tight">
                  Ready to Go Deeper?
                </h2>
              </BlurFade>
              <BlurFade delay={0.3} inView={true} direction="up">
                <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto font-inter">
                  Join thousands of security researchers using ZecurX tools to
                  discover vulnerabilities faster and secure their assets.
                </p>
              </BlurFade>
              <BlurFade delay={0.4} inView={true} direction="up">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contact" className="group w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer transition-all duration-300 hover:bg-[#375bde] hover:shadow-[0_0_20px_rgba(74,111,250,0.4)] hover:-translate-y-0.5">
                      Get Enterprise Access
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/services#ptaas" className="group w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-transparent text-foreground rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer border border-border/50 transition-all duration-300 hover:bg-muted/50 hover:border-border hover:-translate-y-0.5">
                      Explore PTaaS
                    </button>
                  </Link>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </main>
  );
}
