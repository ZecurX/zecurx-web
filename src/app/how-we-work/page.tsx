import { Metadata } from "next";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { getCdnUrl } from "@/lib/cdn";

export const metadata: Metadata = {
  title: "How We Work - Security Approach & Model",
  description:
    "Learn how ZecurX delivers practical, real-world security. Our approach, engagement model, and bundles for startups, SMEs, and AI teams.",
  keywords: [
    "cybersecurity approach",
    "security engagement",
    "penetration testing process",
    "security assessment",
  ],
  openGraph: {
    title: "How We Work - Security Approach & Model | ZecurX",
    description:
      "Learn how ZecurX delivers practical, real-world security. Our approach, engagement model, and security bundles for startups, SMEs, and AI teams.",
    type: "website",
    url: "https://zecurx.com/how-we-work",
  },
  alternates: {
    canonical: "https://zecurx.com/how-we-work",
  },
};

const workflow = [
  {
    step: "01",
    title: "Scope & Threat Mapping",
    description:
      "We align on business-critical assets, architecture boundaries, and risk priorities before any testing begins.",
  },
  {
    step: "02",
    title: "Hands-on Validation",
    description:
      "Our team performs manual and automated testing to surface exploitable paths across web, cloud, APIs, and AI layers.",
  },
  {
    step: "03",
    title: "Fix Partnering",
    description:
      "We work alongside engineering teams to validate fixes, reduce regression, and accelerate secure releases.",
  },
  {
    step: "04",
    title: "Continuous Assurance",
    description:
      "Security becomes a repeating loop with retesting, controls hardening, and measurable maturity improvements.",
  },
];

const deliveryModes = [
  {
    title: "Sprint Engagements",
    text: "Focused assessments for launches, certifications, or pre-release milestones.",
  },
  {
    title: "Embedded Security",
    text: "Ongoing support integrated with your engineering cadence and release cycles.",
  },
  {
    title: "Program Partnerships",
    text: "Multi-quarter roadmap support for teams building long-term security maturity.",
  },
];

export default function HowWeWorkPage() {
  return (
    <main className="relative min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 overflow-hidden">
      <div className="relative z-10 bg-background mb-[700px] md:mb-[420px]">
        <CreativeNavBar />

      {/* HERO */}
      <section className="relative px-4 md:px-6 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[90vw] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(73,106,232,0.12),transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#4c69e4] font-medium mb-4">Our Execution Model</p>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-manrope font-bold text-foreground leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Security that <span className="text-[#4c69e4]" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2em" }}>works</span>
              <br />
              with how your team ships.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Inspired by our services delivery model, this workflow is designed
              to be practical, transparent, and engineered for teams that move
              fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Start an Engagement <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-border text-foreground hover:bg-muted transition-colors font-medium"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-0"
          >
            <div className="h-[320px] md:h-[380px]">
              <LottieAnimation
                src={getCdnUrl("lottie/work_hero.json")}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* WORKFLOW STEPS */}
      <section className="py-10 md:py-16 px-4 md:px-6 border-y border-border/40 bg-muted/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-bold">Execution in four clear phases</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              A consistent, measurable process that keeps leadership aligned and engineering unblocked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {workflow.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-border bg-background p-6 md:p-8"
              >
                <div className="text-[#4c69e4] text-sm font-semibold tracking-wider mb-3">STEP {item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY MODES + PLACEHOLDER */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-5">Delivery models that match your velocity</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We adapt to your product stage and risk profile, from short validation sprints to embedded long-term partnerships.
            </p>
            <ul className="space-y-4">
              {deliveryModes.map((mode) => (
                <li key={mode.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4c69e4] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{mode.title}</p>
                    <p className="text-muted-foreground">{mode.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-1 p-0"
          >
            <div className="h-[280px] md:h-[340px]">
              <LottieAnimation
                src={getCdnUrl("lottie/deliver.json")}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-muted/20 backdrop-blur-sm p-10 md:p-20 text-center">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(74, 111, 250, 0.1) 0%, transparent 60%)",
                  filter: "blur(40px)",
                }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-foreground mb-6 tracking-tight">
                Build fast. Stay secure.
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto font-inter">
                Let&apos;s map your environment and define the right engagement
                model for your team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="group w-full sm:w-auto">
                  <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer transition-all duration-300 hover:bg-[#375bde] hover:shadow-[0_0_20px_rgba(74,111,250,0.4)] hover:-translate-y-0.5">
                    Get Enterprise Access
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/services#ptaas" className="group w-full sm:w-auto">
                  <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-transparent text-foreground rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer border border-border/50 transition-all duration-300 hover:bg-muted/50 hover:border-border hover:-translate-y-0.5">
                    Explore PTaaS
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </main>
  );
}
