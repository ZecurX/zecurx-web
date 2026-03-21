"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  GraduationCap,
  Award,
  Users,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import CourseCard from "@/components/academy/CourseCard";
import { getCdnUrl } from "@/lib/cdn";
import TrustedPartners from "@/components/landing/TrustedPartners";
import { CourseData } from "@/lib/courses";
import { LottieAnimation } from "@/components/ui/lottie-animation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const stats = [
  { icon: Users, value: "1,200+", label: "Students Trained" },
  { icon: Award, value: "95%", label: "Pass Rate" },
  { icon: BookOpen, value: "10+", label: "Courses" },
  { icon: GraduationCap, value: "10+", label: "Expert Instructors" },
];

export default function AcademyClient({
  courses: initialCourses,
}: {
  courses: CourseData[];
}) {
  const [courses] = useState(initialCourses);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(getCdnUrl("lottie/cert.json"))
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => { /* Lottie fetch error silently handled */ });

    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".hero-word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.5s ease-out forwards";
      }, delay);
    });

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px oklch(0.6 0.1 260 / 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fbff] flex flex-col font-sans relative overflow-hidden">
      <CreativeNavBar />

      <div className="flex-1 relative z-10 bg-[#f8fbff] mb-[700px] md:mb-[420px]">
        {/* HERO SECTION - Inspired by Home Page */}
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center">
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a6ffa]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
              <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
          </div>

          <div className="max-w-[1320px] mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white font-space-grotesk text-xs font-medium tracking-widest uppercase mb-6 opacity-0"
                  style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.1s" }}
                >
                  Learn From The Experts
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0c1a2e] mb-6 leading-[1.05] font-manrope">
                  <span className="hero-word" data-delay="300">ZecurX</span><br />
                  <span className="hero-word text-[#4a6ffa]" data-delay="400">Professional</span><br />
                  <span className="hero-word" data-delay="500">Certificates</span>
                </h1>

                <p 
                  className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-10 font-inter opacity-0"
                  style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.6s" }}
                >
                  Elite cybersecurity training for the modern threat landscape. Master the skills that matter with our hands-on curriculum.
                </p>

                <div 
                  className="flex flex-wrap gap-4 opacity-0"
                  style={{ animation: "word-appear 0.5s ease-out forwards", animationDelay: "0.8s" }}
                >
                  <a
                    href="#courses"
                    className="relative inline-flex items-center justify-center gap-2 bg-[#4a6ffa] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                  >
                    Explore Curriculum
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-[#0c1a2e] rounded-full px-8 py-4 text-[15px] font-semibold font-inter hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop
                  </Link>
                </div>
              </div>

              <div 
                className="flex justify-center lg:justify-end opacity-0"
                style={{ animation: "word-appear 0.6s ease-out forwards", animationDelay: "0.3s" }}
              >
                <div className="w-full max-w-[500px] aspect-square">
                  {animationData && (
                    <Lottie
                      animationData={animationData}
                      loop
                      autoplay
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS SECTION ───────────────────────── */}
        <section className="py-12 border-y border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-4 md:py-8 group">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c1a2e] mb-2 font-manrope transition-colors duration-300 group-hover:text-[#496ae8]">
                    {stat.value}
                  </span>
                  <span className="text-slate-500 font-medium text-xs md:text-sm tracking-wide font-inter text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION */}
        <section className="py-20 md:py-32 relative z-10">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
              {[
                {
                  title: "Industry Recognized",
                  description:
                    "ISO Certified curriculum aligned with global standards like CEH, CISSP, OSCP, and CompTIA.",
                },
                {
                  title: "Hands-On Labs",
                  description:
                    "Real-world attack simulations and defense scenarios in our dedicated cloud infrastructure.",
                },
                {
                  title: "Career Acceleration",
                  description:
                    "Proven track record of placing graduates in top security roles with 15-30% salary hikes.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/40 p-8 rounded-3xl border border-slate-200/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)]"
                >
                  <h3 className="text-xl font-bold text-[#0c1a2e] mb-4 font-manrope">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-inter leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COURSES SECTION */}
        <section id="courses" className="py-20 md:py-32 bg-white/40 relative z-10 border-y border-slate-100">
          <div className="max-w-[1320px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
            >
              <div>
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-4">
                  Curriculum
                </span>
                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-4">
                  Professional <span className="text-[#4a6ffa]">Programs</span>
                </h2>
                <p className="text-slate-600 max-w-xl text-lg font-inter">
                  From foundational security to advanced red teaming.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/shop"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0c1a2e] border border-slate-200 bg-white rounded-full hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[#4a6ffa] text-white rounded-full hover:bg-[#385be6] transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} {...course} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* ENTERPRISE CTA */}
        <section className="py-20 md:py-32 px-6 relative z-10">
          <div className="max-w-[1000px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-10 md:p-16 rounded-[2.5rem] border border-[#4a6ffa]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 shadow-[0_20px_60px_rgba(74,111,250,0.08)] overflow-hidden text-center"
            >
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4a6ffa10_1px,transparent_1px),linear-gradient(to_bottom,#4a6ffa10_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-6 mx-auto">
                  For Teams
                </span>
                <h2 className="text-3xl md:text-5xl font-manrope font-bold text-[#0c1a2e] mb-6">
                  <span className="text-[#4a6ffa]">Enterprise</span> Training
                </h2>
                <p className="text-slate-600 font-inter mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                  Customized security capability building for engineering and operations teams. Upskill your entire department.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="/contact"
                    className="relative inline-flex items-center justify-center gap-2 bg-[#4a6ffa] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-5px] hover:shadow-[0px_5px_0px_0px_#92c4fd] active:translate-y-[-3px] active:shadow-[0px_3px_0px_0px_#92c4fd] transition-all duration-200"
                  >
                    Contact Sales
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="bg-white">
          <TrustedPartners />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </main>
  );
}