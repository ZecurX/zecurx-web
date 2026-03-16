"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const SOLUTIONS = [
  {
    id: 0,
    title: "Vulnerability Management",
    description:
      "Continuous discovery, prioritization, and remediation tracking across your entire attack surface — not just a quarterly scan. Every CVE, every dependency, every misconfiguration — surfaced and tracked.",
    image: "https://zecurx-web.fsn1.your-objectstorage.com/solutions/sol-1.png",
    imageAlt: "Vulnerability management dashboard",
    caption: "Vulnerability Dashboard",
  },
  {
    id: 1,
    title: "Secure SDLC",
    description:
      "Shift-left security with automated gates in your GitHub/GitLab CI pipeline. Block vulnerabilities before they ever reach production — zero friction for your engineering team.",
    image: "https://zecurx-web.fsn1.your-objectstorage.com/solutions/sol-2.png",
    imageAlt: "CI/CD security gate pipeline",
    caption: "CI/CD Security Gate",
  },
  {
    id: 2,
    title: "Zero Trust Architecture",
    description:
      "Identity-first micro-segmentation, least-privilege access, and BeyondCorp principles enforced across every user, device, and application in your infrastructure.",
    image: "https://zecurx-web.fsn1.your-objectstorage.com/solutions/sol-3.png",
    imageAlt: "Zero trust network policy editor",
    caption: "Zero Trust Policy Editor",
  },
  {
    id: 3,
    title: "Security Observability",
    description:
      "Real-time event streams, SIEM integration, custom detection rules, and centralized dashboards — complete visibility into your threat landscape the moment incidents occur.",
    image: "https://zecurx-web.fsn1.your-objectstorage.com/solutions/sol-4.png",
    imageAlt: "Security observability SIEM dashboard",
    caption: "Threat Intelligence Dashboard",
  },
];

const N = SOLUTIONS.length;

export function Solutions() {
  // Outer tall scroll container
  const outerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the full outer container
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active index (0 → N-1)
  // Each item owns 1/N of the scroll range
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(N - 1, Math.floor(v * N)),
  );

  // ── Hover override ──────────────────────────────────────────────
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // displayIndex = hover takes priority over scroll
  const displayIndex = useMotionValue<number>(0);

  useEffect(() => {
    if (hoveredIndex !== null) {
      displayIndex.set(hoveredIndex);
      return;
    }
    // When not hovering, keep displayIndex in sync with scroll
    const unsub = activeIndex.on("change", (v) => displayIndex.set(v));
    displayIndex.set(activeIndex.get());
    return unsub;
  }, [hoveredIndex, activeIndex, displayIndex]);

  return (
    // Outer: tall enough for the scroll to drive through all items
    <div ref={outerRef} id="solutions" style={{ height: `${N * 50}vh` }}>
      {/* Inner: sticks to the top of the viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-background text-foreground">
        <div className="container mx-auto px-6 lg:px-8 max-w-[90rem] w-full">
          {/* Section header */}
          <div className="mb-10">
            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
              Solutions
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground">
              One platform.{" "}
              <span className="font-newsreader italic text-muted-foreground">
                Every layer secured.
              </span>
            </h2>
          </div>

          {/* Main two-column layout */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
            {/* ─── LEFT: Image panel ─── */}
            <div className="lg:w-[60%] w-full flex-shrink-0">
              <div className="relative">
                {/* + corner decorators */}
                <span className="absolute -top-2 -left-2 text-sm leading-none text-border select-none pointer-events-none z-20">
                  +
                </span>
                <span className="absolute -top-2 -right-2 text-sm leading-none text-border select-none pointer-events-none z-20">
                  +
                </span>
                <span className="absolute -bottom-2 -left-2 text-sm leading-none text-border select-none pointer-events-none z-20">
                  +
                </span>
                <span className="absolute -bottom-2 -right-2 text-sm leading-none text-border select-none pointer-events-none z-20">
                  +
                </span>

                {/* Image container (transparent, no window chrome) */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-transparent">
                  {/* Image area — cross-fade driven by scroll */}
                  <div
                    className="relative w-full flex items-center justify-center p-8"
                    style={{ aspectRatio: "16/10" }}
                  >
                    {SOLUTIONS.map((sol, i) => (
                      <ScrollImage
                        key={sol.id}
                        sol={sol}
                        index={i}
                        activeIndex={displayIndex}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <ActiveCaption activeIndex={displayIndex} asCaption />
            </div>

            {/* ─── RIGHT: Feature list with Graphite border-l treatment ─── */}
            <div className="lg:w-[40%] w-full flex flex-col">
              {SOLUTIONS.map((sol, i) => (
                <ScrollListItem
                  key={sol.id}
                  sol={sol}
                  index={i}
                  activeIndex={displayIndex}
                  totalItems={N}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

interface SolItem {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  caption: string;
}

function ScrollImage({
  sol,
  index,
  activeIndex,
}: {
  sol: SolItem;
  index: number;
  activeIndex: MotionValue<number>;
}) {
  const opacity = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? 1 : 0,
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full h-full" style={{ isolation: "isolate" }}>
        <Image
          src={sol.image}
          alt={sol.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={75}
          className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180 will-change-transform"
          priority={index === 0}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTJlIi8+PC9zdmc+"
        />
      </div>
    </motion.div>
  );
}

function ScrollListItem({
  sol,
  index,
  activeIndex,
  totalItems,
  onMouseEnter,
  onMouseLeave,
}: {
  sol: SolItem;
  index: number;
  activeIndex: MotionValue<number>;
  totalItems: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  // Border color: bright when active, barely visible when not
  const borderColor = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? "var(--color-foreground)" : "var(--color-border)",
  );

  const titleColor = useTransform(activeIndex, (v) =>
    Math.round(v) === index
      ? "var(--color-foreground)"
      : "var(--color-muted-foreground)",
  );

  const titleOpacity = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? 1 : 0.55,
  );

  const titleWeight = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? 600 : 400,
  );

  // Description + CTA opacity
  const contentOpacity = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? 1 : 0,
  );
  const contentHeight = useTransform(activeIndex, (v) =>
    Math.round(v) === index ? "auto" : "0px",
  );

  return (
    <motion.div
      className="relative py-5 pr-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        borderLeft: "1.5px solid",
        borderLeftColor: borderColor,
        paddingLeft: "20px",
        borderBottom:
          index < totalItems - 1 ? "1px solid var(--color-border)" : "none",
        cursor: "pointer",
      }}
    >
      <motion.h3
        className="text-xl font-manrope leading-snug"
        style={{
          color: titleColor,
          fontWeight: titleWeight,
          opacity: titleOpacity,
        }}
      >
        {sol.title}
      </motion.h3>

      <motion.div
        className="overflow-hidden"
        style={{ opacity: contentOpacity, height: contentHeight }}
      >
        <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
          {sol.description}
        </p>
        <Link href="/book-demo">
          <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline transition-all">
            Learn more →
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ActiveCaption({
  activeIndex,
  asCaption = false,
}: {
  activeIndex: MotionValue<number>;
  asCaption?: boolean;
}) {
  const text = useTransform(activeIndex, (v) => {
    const i = Math.min(SOLUTIONS.length - 1, Math.round(v));
    return asCaption
      ? SOLUTIONS[i].caption
      : `zecurx://security/${SOLUTIONS[i].caption.toLowerCase().replace(/\s+/g, "-")}`;
  });

  if (asCaption) {
    return (
      <motion.p className="mt-3 text-center text-xs font-medium text-muted-foreground">
        {text}
      </motion.p>
    );
  }

  return (
    <motion.span
      className="ml-3 text-[10px] font-mono"
      style={{ color: "rgba(255,255,255,0.3)" }}
    >
      {text}
    </motion.span>
  );
}
