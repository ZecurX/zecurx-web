"use client";

import { Marquee } from "@/components/ui/marquee";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const TESTIMONIALS = [
  {
    quote:
      "ZecurX delivered exceptional quality from UI/UX design to full-stack development. Their VAPT assessment gave us confidence in our platform's security.",
    name: "Gurudev Engicon",
    role: "Enterprise Client",
    logo: `${CDN_URL}/logos/GURUDEV.webp`,
  },
  {
    quote:
      "The team transformed our online presence with a beautiful, mobile-first website. Their security hardening and 24/7 support gives us peace of mind.",
    name: "Honey Herbal",
    role: "Business Client",
    logo: `${CDN_URL}/logos/HONEY-HERBAL.webp?v=4`,
  },
  {
    quote:
      "Working with ZecurX on our security assessment was seamless. They identified critical gaps and provided clear, actionable remediation steps.",
    name: "IBM",
    role: "Technology Partner",
    logo: `${CDN_URL}/logos/IBM.webp`,
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="w-[350px] mx-2 shrink-0">
      <MagicCard
        gradientFrom="#38bdf8"
        gradientTo="#0284c7"
        className="rounded-2xl h-full"
      >
        <div className="p-6">
          {/* Decorative quote mark */}
          <div className="text-4xl text-primary/20 font-serif leading-none mb-4">
            &ldquo;
          </div>

          {/* Quote */}
          <p className="font-newsreader italic text-base md:text-lg text-foreground/90 leading-relaxed">
            {t.quote}
          </p>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* Client info */}
          <div className="flex items-center gap-4">
            <img
              src={t.logo}
              alt={t.name}
              loading="lazy"
              decoding="async"
              className="h-8 w-auto object-contain grayscale opacity-60"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
}

export function StaggerTestimonials() {
  return (
    <section className="py-24 md:py-32 bg-background px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <BlurFade inView={true} delay={0}>
          <div className="text-center mb-16">
            <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-manrope font-semibold tracking-tight text-foreground">
              What our clients say
            </h2>
          </div>
        </BlurFade>

        {/* Marquee rows */}
        <div className="space-y-4">
          <Marquee pauseOnHover className="[--duration:30s]">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
