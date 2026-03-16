"use client";

import React, { useEffect, useRef } from "react";

import { GAP } from "@/lib/hero-timing";

export { heroEnd } from "@/lib/hero-timing";

interface HeroWordsProps {
  children: React.ReactNode;
  /** Extra className on the wrapper span */
  className?: string;
  /** Delay (ms) before the first word starts animating. Default 0. */
  delay?: number;
}

/**
 * Wraps children text into per-word `<span class="hero-word">` elements
 * that play the `word-appear` CSS keyframes with staggered delays.
 *
 * Supports mixed content: plain strings are split by whitespace into
 * individual word spans, while React elements (e.g. `<br />`, styled
 * `<span>`) are emitted as-is and each counts as one "word" for the
 * stagger counter.
 *
 * Usage:
 *   <HeroWords delay={200}>Security that lets you ship fearlessly.</HeroWords>
 *   <HeroWords className="text-muted-foreground">Some subtitle text</HeroWords>
 */
export function HeroWords({ children, className, delay = 0 }: HeroWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll<HTMLElement>(".hero-word");
    words.forEach((el) => {
      const d = parseInt(el.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        el.style.animation = "word-appear 0.5s ease-out forwards";
      }, d);
    });
  }, []);

  let counter = 0;

  function process(node: React.ReactNode): React.ReactNode[] {
    const out: React.ReactNode[] = [];

    React.Children.forEach(node, (child) => {
      if (typeof child === "string") {
        const words = child.split(/(\s+)/);
        for (const w of words) {
          if (/^\s+$/.test(w)) {
            out.push(w);
            continue;
          }
          if (w === "") continue;
          const d = delay + counter * GAP;
          counter++;
          out.push(
            <span key={`w-${d}`} className="hero-word" data-delay={d}>
              {w}
            </span>,
          );
        }
      } else if (React.isValidElement(child)) {
        // If the element has string children (e.g. <span>word</span>),
        // wrap the whole element in a hero-word span so it animates as one unit.
        const d = delay + counter * GAP;
        counter++;
        out.push(
          <span key={`e-${d}`} className="hero-word" data-delay={d}>
            {child}
          </span>,
        );
      }
    });

    return out;
  }

  return (
    <span ref={ref} className={className}>
      {process(children)}
    </span>
  );
}
