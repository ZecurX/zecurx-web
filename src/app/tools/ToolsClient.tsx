"use client";

import React from "react";
import Link from "next/link";
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
  { title: "Subdomain Finder", description: "Uncover hidden subdomains...", href: "/tools/subdomain-finder", lottie: subdomainData },
  { title: "Directory Scanner", description: "Discovers hidden website directories...", href: "/tools/directory-scanner", lottie: dirfinderData },
  { title: "Port Radar", description: "Identifies open network ports...", href: "/tools/port-radar", lottie: radarData },
  { title: "TLS/SSL Analyzer", description: "Checks certificate security...", href: "/tools/ssl-analyzer", lottie: sslData },
  { title: "Param Finder", description: "Detects website parameters...", href: "/tools/param-finder", lottie: paramData },
  { title: "Header Scanner", description: "Analyzes HTTP response headers...", href: "/tools/header-scanner", lottie: headerData },
];

export default function ToolsClient() {
  return (
    <main className="relative min-h-screen bg-background font-sans">

      <div className="relative z-10 bg-background text-foreground overflow-hidden">
        <CreativeNavBar />

        {/* HERO */}
        <section className="relative flex items-center justify-center overflow-hidden bg-background min-h-[50vh] md:min-h-[60vh] px-4 pt-32 pb-20 contain-paint">

          {/* 🔥 ORIGINAL GLOW BLOBS (RESTORED) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-[60px]" />
            <div className="absolute top-1/3 right-[5%] w-[700px] h-[500px] rounded-full bg-blue-400/15 blur-[70px]" />
            <div className="absolute top-[8%] left-[35%] w-[500px] h-[400px] rounded-full bg-foreground/5 blur-[40px]" />
          </div>

          <DotPattern width={18} height={18} cr={1.1} randomOpacity />

          <div className="relative z-10 max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 items-center">

            {/* TEXT */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05]">
                <HeroWords>VulnHunter</HeroWords>
                <br />
                <HeroWords delay={heroEnd(1)}>
                  <span
                    className="text-[#4c69e4]"
                    style={{
                      fontFamily: "var(--font-caveat)",
                      fontSize: "1.2em"
                    }}
                  >
                    Suite
                  </span>
                </HeroWords>
              </h1>

              {/* ✅ ORIGINAL SPACING RESTORED */}
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
                Advanced reconnaissance and asset monitoring tools used by our own
                red teams. Now available for your security operations.
              </p>
            </div>

            {/* ✅ FIXED SIZE + RESTORED GLOW */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-[420px]">
                <Lottie
                  animationData={securityVulnData}
                  loop
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>

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

                    <div className="h-48 rounded-xl bg-muted/10 flex items-center justify-center">
                      <Lottie
                        animationData={tool.lottie}
                        loop
                        className="w-full h-full p-4 group-hover:scale-105 transition"
                      />
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