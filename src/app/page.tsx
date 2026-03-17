import CreativeNavBar from "@/components/landing/CreativeNavBar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { WhyUs } from "@/components/why-us";
import { Industries } from "@/components/industries";
import { Solutions } from "@/components/solutions";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";
import { Metadata } from "next";
import { LogoCarouselBasic } from "@/components/ui/logo-carousel-demo";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export const metadata: Metadata = {
  title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
  description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems with practical, real-world security.",
  keywords: ["cybersecurity services", "application security", "penetration testing", "cloud security", "DevSecOps", "AI security", "startup security"],
  openGraph: {
    title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems.",
    type: "website",
    url: "https://zecurx.com",
  },
  alternates: {
    canonical: "https://zecurx.com",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen font-sans bg-[#0c1a2e]">
      <div className="relative z-10 bg-[#f8fbff] mb-[700px] md:mb-[420px]">
        <CreativeNavBar />
        <Hero />
        <LogoCarouselBasic />

        <div className="relative z-[1] -mt-[220px] w-full overflow-hidden md:-mt-[283px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 344"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            style={{ width: "100%", height: "auto", display: "block", background: "transparent" }}
          >
            <g clipPath="url(#domeClip)">
              <path
                d="M-486 710.949C-486 588.817 -358.992 471.687 -132.917 385.327C93.1578 298.966 399.781 250.449 719.5 250.449C1039.22 250.449 1345.84 298.966 1571.92 385.327C1797.99 471.687 1925 588.817 1925 710.949L719.5 710.949H-486Z"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="160"
                filter="url(#glowDark)"
              />
              <path
                d="M-486 710.949C-486 588.817 -358.992 471.687 -132.917 385.327C93.1578 298.966 399.781 250.449 719.5 250.449C1039.22 250.449 1345.84 298.966 1571.92 385.327C1797.99 471.687 1925 588.817 1925 710.949L719.5 710.949H-486Z"
                fill="none"
                stroke="#BFDBFE"
                strokeWidth="210"
                filter="url(#glowLight)"
              />
              <path
                d="M-486 710.949C-486 588.817 -358.992 471.687 -132.917 385.327C93.1578 298.966 399.781 250.449 719.5 250.449C1039.22 250.449 1345.84 298.966 1571.92 385.327C1797.99 471.687 1925 588.817 1925 710.949L719.5 710.949H-486Z"
                fill="oklch(0.9751 0.0127 244.38)"
              />
            </g>
            <defs>
              <clipPath id="domeClip" clipPathUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1440" height="344" />
              </clipPath>
              <filter
                id="glowDark"
                filterUnits="objectBoundingBox"
                primitiveUnits="objectBoundingBox"
                x="-1.0"
                y="-1.5"
                width="2.6"
                height="3.0"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="0.05" result="b1" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.25" />
                </feComponentTransfer>
              </filter>
              <filter
                id="glowLight"
                filterUnits="objectBoundingBox"
                primitiveUnits="objectBoundingBox"
                x="-1.2"
                y="-2.0"
                width="3.4"
                height="4.0"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="0.12" result="b2" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
        </div>

        <Services />
        <Solutions />
        <Industries />
        <StaggerTestimonials />
        <WhyUs />
        <CTASection />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </main>
  );
}
