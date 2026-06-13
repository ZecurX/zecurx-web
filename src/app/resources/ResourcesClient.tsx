"use client";


import React from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  Lightbulb,
  Shield,
  Video,
  TrendingUp,
  Search,
  Cloud,
  Scale,
  Bot,
  ArrowRight,
  BarChart2,
  ShieldCheck,
  Presentation,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HeroWords, heroEnd } from "@/components/ui/hero-words";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";
import { BlurFade } from "@/components/ui/blur-fade";


const featuredResources = [
  {
    icon: BookOpen,
    title: "ZecurX Blog",
    description:
      "Stay ahead of the curve with expert analysis on the evolving cybersecurity landscape. Our engineers break down emerging threats and practical defense strategies.",
    href: "/blog",
  },
  {
    icon: FileText,
    title: "Whitepapers",
    description:
      "Comprehensive technical documents and strategic reports that provide in-depth perspectives on cybersecurity challenges and frameworks.",
    href: "/resources/whitepapers",
  },
  {
    icon: Briefcase,
    title: "Case Studies",
    description:
      "Real-world success stories showcasing how organizations strengthened their security posture and achieved measurable outcomes.",
    href: "/resources/case-studies",
  },
  {
    icon: BarChart2,
    title: "Research & Insights",
    description:
      "Data-driven research, industry analysis, and proprietary threat intelligence findings that reveal key cybersecurity trends.",
    href: "/resources/research",
  },
  {
    icon: ShieldCheck,
    title: "Security Guides",
    description:
      "Practical playbooks and step-by-step guides designed to help teams implement proven security best practices.",
    href: "/resources/guides",
  },
  {
    icon: Presentation,
    title: "Seminars",
    description:
      "On-demand and live sessions featuring industry experts discussing security challenges, compliance, and emerging threats.",
    href: "/resources/seminars",
  },
];


const blogTopics = [
  { icon: TrendingUp, label: "Threat Intelligence & Cyber Trends" },
  { icon: Search, label: "Ethical Hacking & Penetration Testing" },
  { icon: Cloud, label: "Cloud & Application Security" },
  { icon: Scale, label: "Governance, Risk & Compliance" },
  { icon: Bot, label: "AI and Automation in Cybersecurity" },
];


export default function ResourcesClient() {
  return (
    <main className="bg-[#f8fbff] min-h-screen relative overflow-hidden">
      <CreativeNavBar />


      <div className="relative z-10 bg-[#f8fbff] mb-[700px] md:mb-[420px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">


        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
            <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
          </div>


          <div className="max-w-[1320px] mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center md:text-left">
              <BlurFade delay={0.1}>
                <div className="flex justify-center md:justify-start mb-6">
                  <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                    KNOWLEDGE BASE
                  </span>
                </div>
              </BlurFade>


              <BlurFade delay={0.2}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
                  Expert <span className="text-[#4c69e4]">Knowledge</span> & Insights
                </h1>
              </BlurFade>


              <BlurFade delay={0.3}>
                <p className="text-lg md:text-xl text-slate-600 font-inter mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                  Stay informed with expert insights, technical research, real-world case studies, and education from ZecurX professionals.
                </p>
              </BlurFade>
            </div>
            <div className="flex-1 w-full max-w-[500px] relative hidden md:block">
              <BlurFade delay={0.4}>
                <div className="relative w-full aspect-square opacity-90">
                  <LottieAnimation src={getCdnUrl("lottie/service-main.json")} />
                </div>
              </BlurFade>
            </div>
          </div>
        </section>


        {/* Featured Resources Grid */}
        <section className="py-20 md:py-32 relative z-10 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                LIBRARY
              </span>
            </div>
            <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-manrope font-medium text-[#0f172a] mb-16 tracking-tight">
              Featured <span className="text-[#4c69e4]">Resources</span>
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredResources.map((item, index) => (
                <BlurFade key={index} delay={index * 0.1}>
                  <Link href={item.href} className="group block h-full">
                    <div className="glass-card rounded-3xl p-7 h-full flex flex-col border border-slate-200/60 bg-white/50 relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#4c69e4]/20 hover:shadow-[0_25px_60px_rgba(76,105,228,0.12)] before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(circle_at_top_left,rgba(76,105,228,0.12),transparent_45%)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300">
                      {/* Background glow */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#4c69e4]/5 blur-[60px] rounded-full group-hover:bg-[#4c69e4]/10 transition-colors duration-300" />

                      <div className="relative z-10 flex flex-col h-full">
                        {/* Icon + Title */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-[#4c69e4]/15 blur-xl rounded-full" />

                            <div className="relative w-12 h-12 flex items-center justify-center text-[#4c69e4] transition-transform duration-300 group-hover:scale-110">
                              <item.icon className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-manrope font-bold text-[#0c1a2e] transition-colors duration-300 group-hover:text-[#4c69e4]">
                              {item.title}
                            </h3>

                            <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-60 transition-all duration-300 group-hover:text-[#4c69e4] group-hover:opacity-100 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-500 font-inter text-[15px] leading-relaxed flex-grow">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>


        {/* Blog Topics */}
        <section className="py-20 md:py-32 relative z-10 bg-[#f8fbff]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                CATEGORIES
              </span>
            </div>
            <h2 className="text-center text-3xl md:text-5xl lg:text-6xl font-manrope font-medium text-[#0f172a] mb-12 tracking-tight">
              Explore by <span className="text-[#4c69e4]">Topic</span>
            </h2>


            <div className="flex flex-wrap justify-center gap-4">
              {blogTopics.map((topic, i) => (
                <BlurFade key={i} delay={0.2 + i * 0.05}>
                  <Link href={`/resources/blog?topic=${encodeURIComponent(topic.label)}`}>
                    <div className="group flex items-center gap-3 px-6 py-4 bg-white rounded-full border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#4c69e4]/30 transition-all duration-300">
                      <div className="text-slate-400 group-hover:text-[#4c69e4] transition-colors">
                        <topic.icon className="w-5 h-5" />
                      </div>
                      <span className="font-inter font-medium text-[#0c1a2e] text-[15px]">
                        {topic.label}
                      </span>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 md:py-24 relative z-10 px-4">
          <BlurFade delay={0.2}>
            <div className="max-w-5xl mx-auto glass-card rounded-3xl p-10 md:p-16 border border-white/70 shadow-[0_18px_44px_rgba(30,58,95,0.10)] relative overflow-hidden text-center bg-white/40">
              <div className="absolute inset-0 bg-gradient-to-b from-[#dbeafe]/30 to-transparent pointer-events-none" />


              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                  Ready to secure your <span className="text-[#4c69e4] font-caveat">future?</span>
                </h2>
                <p className="text-lg text-slate-600 font-inter mb-10 max-w-2xl mx-auto">
                  Get full access to our premium whitepapers, research, and security guides by subscribing to our updates.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contact" className="w-full sm:w-auto relative inline-flex justify-center items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200">
                    Subscribe Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/services" className="w-full sm:w-auto inline-flex justify-center items-center bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200">
                    View Services
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>
        </section>


      </div>


      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </main>
  );
}



