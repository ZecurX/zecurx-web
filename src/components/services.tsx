"use client";

import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";
import {
  HighlightText,
  type DescriptionPart,
} from "@/components/ui/highlight-text";

const SERVICES: {
  id: string;
  title: string;
  description: DescriptionPart[];
  href: string;
  lottie: string;
}[] = [
  {
    id: "application-security",
    title: "Application Security",
    description: [
      "Your app ships fast. Attackers move faster. Scanners catch the obvious — ",
      { text: "business logic flaws", highlight: true },
      " don't show up in automated reports. The bugs that matter are the ones ",
      { text: "no tool was built to find", highlight: true },
      ".",
    ],
    href: "/services/application-security",
    lottie: getCdnUrl("lottie/appsec.json"),
  },
  {
    id: "cloud-devsecops",
    title: "Cloud & DevSecOps",
    description: [
      "One misconfigured IAM role. One open S3 bucket. One CI pipeline ",
      { text: "without a gate", highlight: true },
      ". That's all it takes. Your infrastructure changes daily — your security posture ",
      { text: "shouldn't lag behind", highlight: true },
      ".",
    ],
    href: "/services/cloud-devsecops",
    lottie: getCdnUrl("lottie/cloudsec.json"),
  },
  {
    id: "secure-ai-development",
    title: "Secure AI Development",
    description: [
      "Your LLM takes instructions from users. That's the feature — and ",
      { text: "the vulnerability", highlight: true },
      ". Prompt injection, data exfiltration, model abuse. Traditional security tools ",
      { text: "weren't built for this", highlight: true },
      ".",
    ],
    href: "/services/secure-ai-development",
    lottie: getCdnUrl("lottie/aisec.json"),
  },
  {
    id: "compliance-readiness",
    title: "Compliance Readiness",
    description: [
      "The audit is in six weeks. Evidence is scattered across Notion, Slack, and someone's laptop. SOC 2 doesn't have to mean ",
      { text: "months of paperwork", highlight: true },
      ". Get audit-ready without ",
      { text: "losing your mind", highlight: true },
      ".",
    ],
    href: "/services/compliance-readiness",
    lottie: getCdnUrl("lottie/compla.json"),
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-24 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1320px]">
        {/* Header */}
        <BlurFade inView={true} delay={0} className="mb-14 md:mb-16">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
              SERVICES
            </span>
          </div>
          <h2
            className="text-center text-4xl md:text-5xl lg:text-6xl font-manrope font-medium"
            style={{ letterSpacing: "-0.015em" }}
          >
            Security across every <span className="text-blue-600">attack</span>{" "}
            <span className="text-blue-600">surface</span>
          </h2>
        </BlurFade>

        {/* Service blocks */}
        <div className="space-y-8 md:space-y-0 md:divide-y md:divide-slate-200/60">
          {SERVICES.map((service, index) => {
            const isEven = index % 2 === 1;

            return (
              <div key={service.id} className="py-6 md:py-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12 items-center">
                  {/* Text column */}
                  <BlurFade
                    inView={true}
                    delay={0.1}
                    className={isEven ? "md:order-2" : ""}
                  >
                    <div>
                      <h3
                        className="text-2xl md:text-3xl lg:text-4xl font-manrope font-bold text-blue-600 leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {service.title}
                      </h3>
                      <HighlightText
                        parts={service.description}
                        className="text-base md:text-lg text-slate-600 leading-relaxed mt-3 max-w-lg"
                      />

                      {/* Link */}
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1 mt-4 text-blue-600 font-semibold text-base hover:underline"
                      >
                        Learn more &rarr;
                      </Link>
                    </div>
                  </BlurFade>

                  {/* Illustration column */}
                  <BlurFade
                    inView={true}
                    delay={0.2}
                    className={isEven ? "md:order-1" : ""}
                  >
                    <div className="w-full flex items-center justify-center">
                      <LottieAnimation
                        src={service.lottie}
                        className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                      />
                    </div>
                  </BlurFade>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
