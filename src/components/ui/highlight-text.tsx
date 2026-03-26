"use client";

import { useEffect, useRef } from "react";

export type DescriptionPart = string | { text: string; highlight: boolean };

export function HighlightText({
  parts,
  className,
}: {
  parts: DescriptionPart[];
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const highlights = el.querySelectorAll(".highlight-brush");
            highlights.forEach((h, i) => {
              setTimeout(() => {
                h.classList.add("animate");
              }, 300 + i * 200);
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={containerRef}
      className={
        className ??
        "text-base md:text-lg text-slate-600 leading-relaxed mt-3 max-w-lg"
      }
    >
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="highlight-brush text-slate-800 font-medium">
            {part.text}
          </span>
        )
      )}
    </p>
  );
}
