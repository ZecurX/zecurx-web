"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Fingerprint,
  Terminal,
  Cpu,
  Code2,
  Target,
  Zap,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import CourseCard from "@/components/academy/CourseCard";
import TrustedPartners from "@/components/landing/TrustedPartners";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { CourseData, getCourseById } from "@/lib/courses";

const valueProps = [
  { icon: Fingerprint, title: "ISO Verified", desc: "Globally recognized, ISO-compliant certification." },
  { icon: Terminal, title: "Live Labs", desc: "Real attack surfaces, real tools, real experience." },
  { icon: Cpu, title: "AI-Powered", desc: "Cutting-edge GenAI security built into the curriculum." },
  { icon: Code2, title: "Job Ready", desc: "Portfolio projects and placement assistance included." },
];

const differentiators = [
  {
    icon: Target,
    title: "Industry-Aligned",
    desc: "Curriculum developed with input from hiring managers at top security firms — what you learn is exactly what employers need.",
  },
  {
    icon: Zap,
    title: "Accelerated Learning",
    desc: "Structured 8–12 week programs designed to take you from foundation to job-ready faster than traditional education.",
  },
  {
    icon: Laptop,
    title: "Cloud Sandbox",
    desc: "24/7 access to dedicated cloud labs — practice exploits, defense strategies, and tool configurations on live environments.",
  },
];

export default function AcademyClient({
  courses: initialCourses,
}: {
  courses: CourseData[];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      <CreativeNavBar expanded={!scrolled} />

      <div className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <DotPattern width={18} height={18} cr={1.1} randomOpacity className="text-slate-400" />

          <div className="max-w-[1320px] mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pt-20 md:pb-20">
            <BlurFade delay={0.1} inView direction="up">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-manrope font-bold text-foreground leading-[1.1] max-w-2xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Become a <span className="text-blue-600">cybersecurity</span> professional
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} inView direction="up">
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Master offensive and defensive security with ISO-verified certifications.
                Train on live targets in dedicated cloud labs, under expert mentorship.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView direction="up">
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <a href="#courses" className="group/cta pb-[5px] inline-block">
                  <button
                    className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-7 sm:px-8 py-4 sm:py-3.5 text-base sm:text-sm font-semibold cursor-pointer border border-transparent shadow-[0px_0px_0px_0px_#92c4fd] group-hover/cta:translate-y-[-5px] group-hover/cta:shadow-[0px_5px_0px_0px_#92c4fd] group-active/cta:translate-y-[-3px] group-active/cta:shadow-[0px_3px_0px_0px_#92c4fd] transition-transform duration-200"
                    style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                  >
                    Explore Programs
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </button>
                </a>
                <Link href="/contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto border border-border bg-background text-foreground rounded-full px-7 sm:px-8 py-4 sm:py-3.5 text-base sm:text-sm font-medium cursor-pointer transition-colors duration-200 hover:border-slate-300">
                    Talk to Advisor
                  </button>
                </Link>
              </div>
            </BlurFade>

            {/* Value props — plain row, no card chrome */}
            <BlurFade delay={0.4} inView direction="up">
              <div className="mt-14 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                {valueProps.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ===== COURSES ===== */}
        <section id="courses" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade inView className="mb-12 md:mb-14 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Our Programs
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-manrope font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                Choose your certification path
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Structured learning tracks from foundational security to advanced penetration testing and AI defense.
              </p>
            </BlurFade>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialCourses.map((course, i) => {
                const enriched = { ...course, unsplashId: course.unsplashId || getCourseById(course.id)?.unsplashId };
                return <CourseCard key={course.id} {...enriched} delay={i * 0.06} />;
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY ZECURX ===== */}
        <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#eef4ff] border-t border-border">
          <div className="max-w-[1320px] mx-auto">
            <BlurFade inView className="mb-12 md:mb-14 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Why ZecurX
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-manrope font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                What sets us apart
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                We don&apos;t just teach theory. Every program is built around practical, job-ready skills.
              </p>
            </BlurFade>

            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {differentiators.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <item.icon className="w-6 h-6 text-blue-600 mb-4" />
                  <h3 className="text-lg font-manrope font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-[1320px] mx-auto text-center">
            <BlurFade inView>
              <h2 className="text-3xl md:text-4xl font-manrope font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                Ready to level up your team?
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Custom corporate training programs with bulk pricing, dedicated support, and flexible scheduling.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link href="/contact" className="group/cta2 pb-[5px] inline-block">
                  <button
                    className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-3.5 text-sm font-semibold cursor-pointer shadow-[0px_0px_0px_0px_#92c4fd] group-hover/cta2:translate-y-[-5px] group-hover/cta2:shadow-[0px_5px_0px_0px_#92c4fd] transition-transform duration-200"
                    style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                  >
                    Contact Sales
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 border border-border bg-background text-foreground rounded-full px-8 py-3.5 text-sm font-medium hover:border-slate-300 transition-colors"
                >
                  Browse Programs
                </a>
              </div>
            </BlurFade>
          </div>
        </section>

        <TrustedPartners />
      </div>

      <Footer />
    </main>
  );
}
