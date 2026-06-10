"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import CourseCard from "@/components/academy/CourseCard";
import TrustedPartners from "@/components/landing/TrustedPartners";
import { CourseData } from "@/lib/courses";

export default function AcademyClient({
  courses: initialCourses,
}: {
  courses: CourseData[];
}) {
  const [courses] = useState(initialCourses);

  useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>(".hero-word");

    const handleEnter = (e: Event) => {
      (e.target as HTMLElement).style.textShadow =
        "0 0 20px oklch(0.6 0.1 260 / 0.5)";
    };

    const handleLeave = (e: Event) => {
      (e.target as HTMLElement).style.textShadow = "none";
    };

    words.forEach((word) => {
      word.addEventListener("mouseenter", handleEnter);
      word.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      words.forEach((word) => {
        word.removeEventListener("mouseenter", handleEnter);
        word.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fbff] flex flex-col font-sans relative overflow-hidden">
      <CreativeNavBar />

      <div className="flex-1 relative z-10 bg-[#f8fbff] mb-[700px] md:mb-[420px]">
        
        {/* HERO SECTION */}
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c69e4]/10 blur-[120px] rounded-full opacity-70" />
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full opacity-60" />
          </div>

          <div className="max-w-[1320px] mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* LEFT CONTENT */}
              <div>
                <div className="inline-flex px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white text-xs tracking-widest uppercase mb-6 opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.1s]">
                  Learn From The Experts
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0c1a2e] mb-6 leading-[1.05]">
                  <span className="hero-word opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.3s]">
                    ZecurX
                  </span>
                  <br />
                  <span className="hero-word text-[#4c69e4] opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.4s]">
                    Professional
                  </span>
                  <br />
                  <span className="hero-word opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.5s]">
                    Certificates
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-10 opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.6s]">
                  Elite cybersecurity training for the modern threat landscape.
                  Master the skills that matter with hands-on curriculum.
                </p>

                <div className="flex flex-wrap gap-4 opacity-0 animate-[word-appear_0.5s_ease-out_forwards] [animation-delay:0.8s]">
                  <a
                    href="#courses"
                    className="flex items-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-sm font-semibold hover:-translate-y-1 transition"
                  >
                    Explore Curriculum
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <Link
                    href="/shop"
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-8 py-4 text-sm font-semibold hover:bg-slate-50 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop
                  </Link>
                </div>
              </div>

              {/* RIGHT VALUE PROPS */}
              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Industry Recognized",
                    description:
                      "ISO Certified curriculum aligned with CEH, CISSP, OSCP, and CompTIA.",
                  },
                  {
                    title: "Hands-On Labs",
                    description:
                      "Real-world attack simulations in dedicated cloud labs.",
                  },
                  {
                    title: "Career Acceleration",
                    description:
                      "Graduates placed in top roles with strong salary growth.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                    className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-[#0c1a2e] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* COURSES */}
        <section id="courses" className="py-20 md:py-32 bg-white border-y">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Professional Programs
                </h2>
                <p className="text-slate-600">
                  From foundational to advanced security.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/shop"
                  className="flex items-center gap-2 px-5 py-2 border rounded-full"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-5 py-2 bg-[#4c69e4] text-white rounded-full"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <CourseCard key={course.id} {...course} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Enterprise Training
          </h2>
          <p className="text-slate-600 mb-8">
            Upskill your entire engineering team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#4c69e4] text-white px-8 py-4 rounded-full"
          >
            Contact Sales
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        <TrustedPartners />
      </div>

      <Footer />
    </main>
  );
}