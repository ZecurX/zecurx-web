"use client";

import Link from "next/link";
import { Shield, Cloud, Brain, FileCheck } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";

const SERVICES = [
  {
    id: "application-security",
    title: "Application Security",
    description:
      "Web, API & source code security testing. We uncover logic flaws and deep vulnerabilities that automated scanners miss, securing your apps before they ship.",
    bullets: [
      "OWASP Top 10 Coverage",
      "Business Logic Testing",
      "Authenticated Deep Scanning",
    ],
    href: "/services/application-security",
    icon: Shield,
  },
  {
    id: "cloud-devsecops",
    title: "Cloud & DevSecOps",
    description:
      "Cloud misconfig & CI/CD security audits. We secure your AWS, Azure, and GCP environments while embedding shift-left security directly into your pipelines.",
    bullets: [
      "AWS / Azure / GCP Audits",
      "Infrastructure as Code Review",
      "CI/CD Pipeline Security",
    ],
    href: "/services/cloud-devsecops",
    icon: Cloud,
  },
  {
    id: "secure-ai-development",
    title: "Secure AI Development",
    description:
      "LLM security & AI abuse testing. Protect your models and AI agents from prompt injection, data poisoning, and unauthorized model access.",
    bullets: [
      "Prompt Injection Testing",
      "Model Access Controls",
      "Data Poisoning Assessment",
    ],
    href: "/services/secure-ai-development",
    icon: Brain,
  },
  {
    id: "compliance-readiness",
    title: "Compliance Readiness",
    description:
      "ISO 27001, SOC 2 & DPDP preparation. We fast-track your compliance goals with gap assessments, penetration testing, and evidence collection workflows.",
    bullets: [
      "Gap Assessment & Roadmap",
      "Evidence Collection Automation",
      "Audit Preparation & Support",
    ],
    href: "/services/compliance-readiness",
    icon: FileCheck,
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <BlurFade inView={true} delay={0} className="mb-12 md:mb-16">
          <span className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter">
            Security across{" "}
            <span className="font-newsreader italic">every attack surface</span>
          </h2>
        </BlurFade>

        {/* 2x2 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <BlurFade key={service.id} inView={true} delay={0.1 * index}>
                <MagicCard
                  gradientFrom="#38bdf8"
                  gradientTo="#0284c7"
                  className="p-8 rounded-2xl relative"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-manrope font-semibold">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-base leading-relaxed mt-3">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="mt-5 flex flex-col gap-3">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <CheckIcon />
                        </span>
                        <span className="text-sm font-medium">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link
                    href={service.href}
                    className="inline-block mt-6 text-primary font-medium hover:underline"
                  >
                    Learn more &rarr;
                  </Link>

                  {/* Animated Border */}
                  <BorderBeam
                    colorFrom="#38bdf8"
                    colorTo="#0284c7"
                    size={100}
                    duration={8}
                  />
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
