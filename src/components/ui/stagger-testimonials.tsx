"use client";

import React from "react";
import { Star } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  stars: number;
}

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://zecurx-web.fsn1.your-objectstorage.com";

const testimonials: Testimonial[] = [
  {
    text: "ZecurX redesigned our digital storefront and secured our payment systems end-to-end. The attention to detail in both design and security was impressive.",
    image: `${CDN_URL}/logos/my-garden-v3.webp`,
    name: "My Garden",
    role: "Business Client",
    stars: 5,
  },
  {
    text: "ZecurX delivered exceptional quality from UI/UX design to full-stack development. Their VAPT assessment gave us confidence in our platform's security. Truly enterprise-grade service.",
    image: `${CDN_URL}/logos/GURUDEV.webp`,
    name: "Gurudev Engicon Pvt. Ltd.",
    role: "Enterprise Client",
    stars: 5,
  },
  {
    text: "The team transformed our online presence with a beautiful, mobile-first website. Their security hardening and 24/7 support gives us peace of mind.",
    image: `${CDN_URL}/logos/HONEY-HERBAL.webp?v=4`,
    name: "Honey Herbal Beauty Parlour",
    role: "Business Client",
    stars: 5,
  },
  {
    text: "Working with ZecurX on our security assessment was seamless. They identified critical gaps in our infrastructure and provided clear, actionable remediation steps.",
    image: `${CDN_URL}/logos/IBM.webp`,
    name: "IBM",
    role: "Technology Partner",
    stars: 5,
  },
  {
    text: "From web application development to penetration testing, ZecurX handled everything with precision. Their team understands both the development and security sides deeply.",
    image: `${CDN_URL}/logos/MATEX.webp`,
    name: "MateX",
    role: "Business Client",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < count
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-[340px] sm:w-[380px] p-7 rounded-xl border border-slate-200/80 bg-blue-50 flex-shrink-0">
      <StarRating count={t.stars} />
      <p className="text-[15px] text-slate-600 leading-relaxed font-normal mt-4">
        {t.text}
      </p>
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
        <img
          width={40}
          height={40}
          src={t.image}
          alt={t.name}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-100"
        />
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold tracking-tight leading-4 text-slate-900 font-manrope">
            {t.name}
          </span>
          <span className="text-[12px] leading-4 tracking-tight text-slate-400 mt-1">
            {t.role}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StaggerTestimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 md:py-24 bg-[#BFDBFE] relative overflow-hidden contain-paint"
    >
      {/* Header */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-14">
        <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
          Testimonials
        </span>
        <h2
          id="testimonials-heading"
          className="text-3xl md:text-4xl font-manrope font-medium tracking-tight text-foreground mt-5"
          style={{ letterSpacing: "-0.015em" }}
        >
          What our clients say
        </h2>
        <p className="mt-3 text-slate-700 text-base leading-relaxed max-w-lg">
          Trusted by startups, enterprises, and engineering teams to secure what
          matters most.
        </p>
      </div>

      {/* Infinite auto-scrolling carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-gradient-to-r from-[#BFDBFE] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-[25%] bg-gradient-to-r from-transparent to-[#BFDBFE] pointer-events-none z-10" />

        <Marquee
          pauseOnHover
          repeat={2}
          className="[--duration:35s] [--gap:1.25rem]"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
