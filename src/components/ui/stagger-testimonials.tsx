"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
  darkImgSrc?: string;
}

const testimonials: Testimonial[] = [
  {
    tempId: 0,
    testimonial:
      "ZecurX delivered exceptional quality from UI/UX design to full-stack development. Their VAPT assessment gave us confidence in our platform's security. Truly enterprise-grade service.",
    by: "Gurudev Engicon Pvt. Ltd., Enterprise Client",
    imgSrc: `${CDN_URL}/logos/GURUDEV.webp`,
  },
  {
    tempId: 1,
    testimonial:
      "The team transformed our online presence with a beautiful, mobile-first website. Their security hardening and 24/7 support gives us peace of mind.",
    by: "Honey Herbal Beauty Parlour, Business Client",
    imgSrc: `${CDN_URL}/logos/HONEY-HERBAL.webp?v=3`,
  },
  {
    tempId: 2,
    testimonial:
      "Working with ZecurX on our security assessment was seamless. They identified critical gaps in our infrastructure and provided clear, actionable remediation steps.",
    by: "IBM, Technology Partner",
    imgSrc: `${CDN_URL}/logos/IBM.webp`,
  },
  {
    tempId: 3,
    testimonial:
      "ZecurX built us a modern e-commerce platform that handles our peak festival season traffic without breaking a sweat. Their ongoing security monitoring keeps our customer data safe.",
    by: "Kanti Sweets, Business Client",
    imgSrc: `${CDN_URL}/logos/KANTI.webp`,
  },
  {
    tempId: 4,
    testimonial:
      "From web application development to penetration testing, ZecurX handled everything with precision. Their team understands both the development and security sides deeply.",
    by: "MateX, Business Client",
    imgSrc: `${CDN_URL}/logos/MATEX.webp`,
    darkImgSrc: `${CDN_URL}/logos/MATEX-dark.webp`,
  },
  {
    tempId: 5,
    testimonial:
      "ZecurX redesigned our digital storefront and secured our payment systems end-to-end. The attention to detail in both design and security was impressive.",
    by: "My Garden, Business Client",
    imgSrc: `${CDN_URL}/logos/my-garden-v3.webp`,
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-xl border-2 p-8",
        "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-in-out",
        isCenter
          ? "z-10 bg-card text-card-foreground border-primary"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50",
      )}
      style={{
        width: cardSize,
        height: cardSize * 1.25,
        transform: `translate(-50%, -50%) translateX(${cardSize * 0.8 * position}px) translateY(${isCenter ? -40 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter
          ? "0px 8px 0px 4px var(--border)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      {testimonial.darkImgSrc ? (
        <>
          <img
            src={testimonial.imgSrc}
            alt={testimonial.by.split(",")[0]}
            loading="lazy"
            decoding="async"
            className="mb-4 h-14 w-auto max-w-[120px] rounded-sm object-contain dark:hidden"
            style={{ boxShadow: "3px 3px 0px var(--background)" }}
          />
          <img
            src={testimonial.darkImgSrc}
            alt={testimonial.by.split(",")[0]}
            loading="lazy"
            decoding="async"
            className="mb-4 hidden h-14 w-auto max-w-[120px] rounded-sm object-contain dark:block"
            style={{ boxShadow: "3px 3px 0px var(--background)" }}
          />
        </>
      ) : (
        <img
          src={testimonial.imgSrc}
          alt={testimonial.by.split(",")[0]}
          loading="lazy"
          decoding="async"
          className="mb-4 h-14 w-auto max-w-[120px] rounded-sm object-contain"
          style={{ boxShadow: "3px 3px 0px var(--background)" }}
        />
      )}
      <h3 className="font-newsreader text-base font-bold italic text-foreground/90 sm:text-lg leading-relaxed">
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p className="absolute bottom-8 left-8 right-8 mt-2 font-space-grotesk text-sm text-muted-foreground">
        - {testimonial.by}
      </p>
    </div>
  );
};

export function StaggerTestimonials() {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] =
    useState<Testimonial[]>(testimonials);

  const handleMove = useCallback((steps: number) => {
    setTestimonialsList((prev) => {
      const newList = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return prev;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return prev;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  }, []);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => handleMove(1), 6000);
  }, [handleMove]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetAutoScroll]);

  const handleUserMove = useCallback(
    (steps: number) => {
      handleMove(steps);
      resetAutoScroll();
    },
    [handleMove, resetAutoScroll],
  );

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="w-full px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center">
          <span className="block font-space-grotesk text-2xl font-medium text-muted-foreground">
            What Our Clients Say
          </span>
          <span className="font-space-grotesk text-2xl font-black tracking-tight text-primary md:text-3xl">
            Client Stories
          </span>
        </h2>
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 680 }}
        >
          {/* Feathered edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-background to-transparent sm:w-48" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-background to-transparent sm:w-48" />
          {testimonialsList.map((testimonial, index) => {
            const position =
              testimonialsList.length % 2
                ? index - (testimonialsList.length + 1) / 2
                : index - testimonialsList.length / 2;
            return (
              <TestimonialCard
                key={testimonial.tempId}
                testimonial={testimonial}
                handleMove={handleUserMove}
                position={position}
                cardSize={cardSize}
              />
            );
          })}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <button
              onClick={() => handleUserMove(-1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl",
                "motion-safe:transition-colors",
                "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => handleUserMove(1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl",
                "motion-safe:transition-colors",
                "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
