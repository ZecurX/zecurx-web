import { Metadata } from "next";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import * as motion from "framer-motion/client";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { ServicesHeroSection } from "@/components/ui/hero-section";
import CapabilitiesBento from "@/components/ui/capabilities-bento";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export const metadata: Metadata = {
  title: "Cybersecurity Services | ZecurX",
  description:
    "World-class cybersecurity services to build, secure, and scale with confidence. Application security, cloud security, secure AI development, and compliance readiness.",
  keywords: [
    "cybersecurity services",
    "application security",
    "cloud security",
    "DevSecOps",
    "AI security",
    "compliance",
  ],
  openGraph: {
    title: "Cybersecurity Services | ZecurX",
    description:
      "Practical, real-world security for startups, SMEs, and AI teams. We help you ship faster, not slower.",
    type: "website",
    url: "https://zecurx.com/services",
  },
  alternates: {
    canonical: "https://zecurx.com/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
      <CreativeNavBar />

      {/* --- HERO SECTION --- */}
      <ServicesHeroSection />

      {/* --- METRICS / IMPACT SECTION --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-y border-border/40 relative bg-muted/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Efficient security recovery
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Measurable impact across our entire portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border/40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-8 md:pt-0"
            >
              <h3 className="text-4xl md:text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">
                10x
              </h3>
              <p className="text-xl font-medium text-foreground mb-2">
                Faster Compliance
              </p>
              <p className="text-muted-foreground">
                Reduction in time-to-certification.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="pt-12 md:pt-0"
            >
              <h3 className="text-4xl md:text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50">
                24/7
              </h3>
              <p className="text-xl font-medium text-foreground mb-2">
                Continuous Protection
              </p>
              <p className="text-muted-foreground">
                Always-on DevSecOps integration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pt-12 md:pt-0"
            >
              <h3 className="text-4xl md:text-7xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">
                0
              </h3>
              <p className="text-xl font-medium text-foreground mb-2">
                Critical Leaks
              </p>
              <p className="text-muted-foreground">
                Zero high-severity breaches reported for managed clients.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- GUIDING PHILOSOPHY --- */}
      <section className="py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-6 md:mb-8 text-balance leading-tight">
              Hands-on guidance with 24/7/365 support from the team that never
              sleeps.
            </h2>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
              Always-on support prepares, matures, and fortifies all facets of
              your security program. We don't just hand you a PDF report; we
              work alongside your engineers to fix flaws and ship secure code.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- THREAT ARCHITECTURE SECTION --- */}
      <section className="py-8 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full relative drop-shadow-[0_0_50px_rgba(220,38,38,0.15)]"
          >
            <Image
              src={`${CDN_URL}/diagram.png`}
              alt="Threat Architecture Diagram"
              width={1200}
              height={1200}
              className="w-full h-auto object-contain pointer-events-none mix-blend-screen"
              priority
              unoptimized
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMGEiLz48L3N2Zz4="
            />
          </motion.div>
        </div>
      </section>

      {/* --- CAPABILITIES SECTION --- */}
      <CapabilitiesBento />

      {/* --- EXPANDED REACH / TOOLS --- */}
      <section className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
                Expanded reach through open-source tools
              </h2>
              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                We believe in giving back to the community. The{" "}
                <strong className="text-foreground">VulnHunter Suite</strong>{" "}
                provides security teams and developers with reconnaissance and
                testing tools to identify exposure before an adversary does.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Automated reconnaissance",
                  "API security testing",
                  "SBOM generation and scanning",
                ].map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-base md:text-lg text-foreground"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary mr-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/tools"
                className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Explore VulnHunter Suite
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative aspect-square md:aspect-auto md:h-[600px] w-full bg-transparent overflow-hidden flex items-center justify-center p-4 md:p-8"
            >
              {/* VulnHunter Image */}
              <div className="relative w-full max-w-md">
                <Image
                  src={`${CDN_URL}/vulnhunter.png`}
                  alt="VulnHunter Suite"
                  width={800}
                  height={800}
                  unoptimized
                  className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-t border-border/40 bg-background">
        <div className="w-full max-w-6xl mx-auto p-5 md:p-12 rounded-2xl bg-background border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col space-y-4 md:space-y-6 text-center md:text-left items-center md:items-start">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure Your Digital Assets</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                <span className="text-primary">Ready</span> to Secure Your{" "}
                <span className="text-primary">Product?</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Deploy fearlessly with a trusted security partner guarding your
                flank. Schedule a consultation with our advanced security
                architects today.
              </p>
              <div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-8 text-sm md:text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium transition-all active:scale-95"
                >
                  Contact us today
                </Link>
              </div>
            </div>
            <div className="relative w-full min-h-[200px] md:min-h-[320px] flex items-center justify-center">
              <Image
                src={`${CDN_URL}/image.png`}
                alt="ZecurX Security"
                width={500}
                height={500}
                unoptimized
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
