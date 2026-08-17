"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Award,
  Globe,
  Laptop,
  Target,
  Zap,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialFooter from "@/components/editorial/EditorialFooter";
import CourseCard from "@/components/academy/CourseCard";
import { CourseData } from "@/lib/courses";

// Verbatim image src values from the supplied academy_code.html mockup
// (Ethical Hacking / Defensive Architecture / Security Leadership cards),
// cycled across however many real courses the database returns.
const ACADEMY_CARD_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCofzRkuVtOfnygu30F3GkuBvM6pc5_xMH6_54QoP61UxLDLm4MHjqgHAtklO8F1Y8hI6_11YnlfYWR217EojNVEaQCZk71bMAPtSSWuB3xpRB6vy3RgI_VCXmljOk6jRZjrZQRQ3kYnsJQ89_XmGddAQq49oFGCZwy-jYCg2KQN9f4aol1p6CWVtYNEsuogDyD79_epfzHedZHAgsfN-v1QfLmEqNCYRJ92AtqC8QJ7kMIWV3PeaYw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmAxu5SdF_nRthABNAqer8oCEDQJA3Q39VJ7ABvVrnrB_v7xyN0CfGGRfexgsxYNY76bUGrcI0MoEqE4asQRN1hHbnhunkQQBEP_yaJz7RfI2_LOTkLjQ8iQ6x9rYkhyXdkW34WdZwXkGLMeTiPEvp6jto0GFs3CI5BRjXaqH_AAIy3l8RxNaYbvYfs0lwn38mPc4QyHOWcWBzYITYDBIi6TwJc1s2fwYua4NIq8IM53o3WOrSK_xN",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBXVyEWO5DTwefp04M05Kc6KSAVIHVXaiDyXxURW60gAhU8PSR3SarFvy7iUJmo9HvsIRS2RIdcnKpqCOo5Xwa_v-RVEHTk5zuKiUSyo7xUVroeWcmEB1XgwKKmWD__ANBRd4SLKttAFWBcqazx8Xz-CzJpKF7xeb5peFyxZdnMsV4Q9JUzCf43739ElR08vG9RUmROGNDmPWKxMQM3hZkdqpAM9j3M_4PPRy_90fFXfFaYb321iC1",
];

const stats = [
  { icon: Users, value: "2,500+", label: "Trained" },
  { icon: Award, value: "8", label: "Certifications" },
  { icon: Globe, value: "15+", label: "Countries" },
  { icon: GraduationCap, value: "94%", label: "Placement" },
];

const whyItems = [
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
];

export default function AcademyClient({
  courses: initialCourses,
}: {
  courses: CourseData[];
}) {
  return (
    <div className="zx-editorial min-h-screen bg-[color:var(--zx-background)] text-[color:var(--zx-on-background)] font-manrope flex flex-col">
      <EditorialHeader active="academy" />

      <main className="flex-1 pt-20">
        {/* ===== HERO ===== */}
        <section className="relative w-full min-h-[560px] flex flex-col items-center justify-center pt-24 pb-24 px-5 overflow-hidden bg-[color:var(--zx-surface-container-lowest)]">
          <div aria-hidden="true" className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#1d1c16" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
            <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-secondary)] uppercase tracking-[0.2em]">
              Zecurx Academy
            </span>
            <h1 className="font-libre-caslon text-[40px] md:text-[64px] leading-[1.1] tracking-tight text-[color:var(--zx-on-surface)]">
              Master the Craft.
            </h1>
            <p className="text-lg leading-relaxed text-[color:var(--zx-on-surface-variant)] max-w-2xl">
              Advanced cybersecurity training blending theoretical depth with tactical execution. Elevate your
              strategic defense capabilities through rigorous, immersive curricula.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 bg-[color:var(--zx-primary)] text-[color:var(--zx-on-primary)] px-8 py-3 rounded-full font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
              >
                Explore Programs
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center bg-transparent text-[color:var(--zx-on-surface)] border border-[color:var(--zx-outline-variant)] px-8 py-3 rounded-full font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[color:var(--zx-surface-variant)]/30 transition-colors"
              >
                Talk to Advisor
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-8 pt-8 border-t border-[color:var(--zx-outline-variant)]/30">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-libre-caslon text-[28px] text-[color:var(--zx-on-surface)]">{stat.value}</div>
                  <div className="font-manrope text-[11px] text-[color:var(--zx-on-surface-variant)] uppercase tracking-[0.1em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COURSES ===== */}
        <section id="courses" className="w-full px-5 md:px-12 lg:px-24 pb-[80px] md:pb-[120px] relative bg-[color:var(--zx-background)]">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-16"
            >
              <div>
                <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-tertiary)] uppercase tracking-[0.2em]">
                  Our Programs
                </span>
                <h2 className="font-libre-caslon text-[32px] text-[color:var(--zx-on-background)] mt-4">
                  Choose Your Certification Path
                </h2>
              </div>
              <span className="font-manrope text-[11px] text-[color:var(--zx-on-surface-variant)] uppercase tracking-widest hidden md:block">
                01 / Curricula
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialCourses.map((course, i) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  cardImage={ACADEMY_CARD_IMAGES[i % ACADEMY_CARD_IMAGES.length]}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY ZECURX ===== */}
        <section className="w-full px-5 md:px-12 lg:px-24 py-[80px] md:py-[120px] bg-[color:var(--zx-surface-container-low)]">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 max-w-2xl mx-auto"
            >
              <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-secondary)] uppercase tracking-[0.2em]">
                Why Zecurx
              </span>
              <h2 className="font-libre-caslon text-[32px] text-[color:var(--zx-on-surface)] mt-4 mb-4">
                What Sets Us Apart
              </h2>
              <p className="text-[color:var(--zx-on-surface-variant)]">
                We don&apos;t just teach theory. Every program is built around practical, job-ready skills.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[color:var(--zx-surface)] rounded-xl p-8 border border-[color:var(--zx-outline-variant)]/30"
                >
                  <div className="w-12 h-12 rounded-full bg-[color:var(--zx-secondary-container)] flex items-center justify-center mb-6">
                    <item.icon className="w-5 h-5 text-[color:var(--zx-on-secondary-container)]" />
                  </div>
                  <h3 className="font-libre-caslon text-[20px] text-[color:var(--zx-on-surface)] mb-3">{item.title}</h3>
                  <p className="text-sm text-[color:var(--zx-on-surface-variant)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="w-full px-5 md:px-12 lg:px-24 py-[80px] md:py-[120px] bg-[color:var(--zx-primary-fixed-dim)]">
          <div className="max-w-[1280px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-on-primary-fixed)] uppercase tracking-[0.2em] block mb-4">
                Enterprise Training
              </span>
              <h2 className="font-libre-caslon text-[32px] md:text-[40px] text-[color:var(--zx-on-primary-fixed)] mb-6">
                Ready to Level Up Your Team?
              </h2>
              <p className="text-[color:var(--zx-on-primary-fixed)]/80 max-w-xl mx-auto mb-10">
                Custom corporate training programs with bulk pricing, dedicated support, and flexible scheduling.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[color:var(--zx-primary)] text-[color:var(--zx-on-primary)] rounded-full px-8 py-3 font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
                >
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 bg-transparent border border-[color:var(--zx-on-primary-fixed)]/30 text-[color:var(--zx-on-primary-fixed)] rounded-full px-8 py-3 font-manrope text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[color:var(--zx-on-primary-fixed)]/5 transition-colors"
                >
                  Browse Programs
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
}
