"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Users,
  Award,
  Globe,
  Laptop,
  Target,
  Zap,
  BookOpen,
  GraduationCap,
  Terminal,
  Cpu,
  Code2,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import CourseCard from "@/components/academy/CourseCard";
import TrustedPartners from "@/components/landing/TrustedPartners";
import { CourseData, getCourseById } from "@/lib/courses";

const stats = [
  { icon: Users, value: "2,500+", label: "Trained" },
  { icon: Award, value: "8", label: "Certifications" },
  { icon: Globe, value: "15+", label: "Countries" },
  { icon: GraduationCap, value: "94%", label: "Placement" },
];

const valueProps = [
  {
    icon: Fingerprint,
    title: "ISO Verified",
    desc: "Globally recognized certification with ISO compliance.",
    gradient: "from-[#4c69e4] to-indigo-500",
  },
  {
    icon: Terminal,
    title: "Live Labs",
    desc: "Real attack surfaces, real tools, real experience.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Cpu,
    title: "AI-Powered",
    desc: "Cutting-edge GenAI security curriculum built in.",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    icon: Code2,
    title: "Job Ready",
    desc: "Portfolio projects + placement assistance included.",
    gradient: "from-amber-500 to-orange-600",
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
    <main className="min-h-screen bg-[#080b14] flex flex-col font-sans text-white">
      <CreativeNavBar expanded={!scrolled} />

      <div className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#4c69e4]/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />

          <div className="max-w-[1320px] mx-auto w-full relative z-10 pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* LEFT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight">
                  <span className="text-white">Become a</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#4c69e4] via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Cybersecurity
                  </span>
                  <br />
                  <span className="text-white">Professional</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed font-light">
                  Master offensive and defensive security with ISO-verified certifications. 
                  Train on live targets in dedicated cloud labs under expert mentorship.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#courses"
                    className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-xl px-8 py-4 text-sm font-semibold hover:bg-[#3b57d4] hover:shadow-lg hover:shadow-[#4c69e4]/25 transition-all active:scale-[0.98]"
                  >
                    Explore Programs
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl px-8 py-4 text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
                  >
                    Talk to Advisor
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT - Value props */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="space-y-4"
              >
                {valueProps.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="group flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-0.5">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== COURSES ===== */}
        <section id="courses" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0d1020]">
          <div className="max-w-[1320px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#4c69e4] bg-[#4c69e4]/10 rounded-full mb-4 border border-[#4c69e4]/20">
                Our Programs
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-[#4c69e4] to-indigo-400 bg-clip-text text-transparent">
                  Certification Path
                </span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                Structured learning tracks from foundational security to advanced penetration testing and AI defense.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialCourses.map((course, i) => {
                const enriched = { ...course, unsplashId: course.unsplashId || getCourseById(course.id)?.unsplashId };
                return <CourseCard key={course.id} {...enriched} delay={i * 0.08} />;
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY ZECURX ===== */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#080b14]" />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0.5px, transparent 0.5px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="max-w-[1320px] mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 rounded-full mb-4 border border-emerald-400/20">
                Why ZecurX
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                What Sets Us{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Apart
                </span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                We don&apos;t just teach theory. Every program is built around practical, job-ready skills.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Industry-Aligned",
                  desc: "Curriculum developed with input from hiring managers at top security firms. What you learn is exactly what employers need.",
                },
                {
                  icon: Zap,
                  title: "Accelerated Learning",
                  desc: "Structured 8-12 week programs designed to take you from foundation to job-ready faster than traditional education.",
                },
                {
                  icon: Laptop,
                  title: "Cloud Sandbox",
                  desc: "24/7 access to dedicated cloud labs. Practice exploits, defense strategies, and tool configurations on live environments.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-[#4c69e4]/20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#4c69e4]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0d1020]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1020] via-[#111530] to-[#0d1020]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)`,
              backgroundSize: "80px 80px",
            }}
          />

          <div className="max-w-[1320px] mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#4c69e4] bg-[#4c69e4]/20 rounded-full mb-4 border border-[#4c69e4]/30">
                Enterprise Training
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Level Up Your Team?
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg font-light">
                Custom corporate training programs with bulk pricing, dedicated support, and flexible scheduling.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#4c69e4] text-white rounded-xl px-8 py-4 text-sm font-semibold hover:bg-[#3b57d4] hover:shadow-lg hover:shadow-[#4c69e4]/25 transition-all active:scale-[0.98]"
                >
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl px-8 py-4 text-sm font-semibold hover:bg-white/10 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Programs
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <TrustedPartners />
      </div>

      <Footer />
    </main>
  );
}