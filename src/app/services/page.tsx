import { Metadata } from "next";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialFooter from "@/components/editorial/EditorialFooter";

// Verbatim image src values from the supplied services_code.html mockup.
const serviceImage1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwPSyB1c4xYFNhBCe9TCRHlx5iytuMETBwiQ_kkMx1OFgmLhbo96K_wQr_W5Or2LYx7v0XAPRhe8vv6ybBqGVcf8i5EuB1XFTV3SflR_rQsNO0czM-WxZDH-bATcyCmMkUa6DUZCWDuzE3k586vdHV0JXtdFyuLGflyX4iE9w2uygr4b2GSDzC9fDPjx7WKiUQRuNMTMzlhyNw9pQTeuE3a_sMTuapMn3cA7XQ2JVXJMpma68kHHA7";
const serviceImage2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBC1M7G8Fai9XLRXRxlzHtP5bEKlqs3-CrQxWIopLN37lc3AGJg6GNUEs7nHhmne9D3h_Dtnl7yAuw20gJINTbqkhNYUMvmGCBsTp1_ExzUpNnRVuihoz-V6wGQ4nMPJZS_P6ac29w-fcEl7vRSmFQbIuQCkR8P2nMM9WNzy6z069e6NJCsnUeE5PTjVNbbpEln5_pIlExlxjVvFlyBsY5aCAklH0x7xJB_BZNBypoEaSzvM7UCYGci";
const serviceImage3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCUwXR1MGtfkROHATcMZwhF2PVXA06kiG5Zs4qV6YnCo4aQ3_SG83kU5WHTNb3EYOXeg8uNNMB_JyEC2hW4J1hKh_fhG1oT5-GDQ5_PI6Dz8sF-8-ynesvDgBgegVA-FCuHwH4DXXUo8KRqRgUO6vxn3RWetXQ3Uyoroh9aLTSMSAe7jB5tIWu5Qm6X1DjI1SA60Hq49HTU4LI9ZaD60i_Y5_yNi-w0y2jSiTkY1G2UegWFuPQm1Hm8";

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

const capabilities = [
  {
    id: "01",
    title: "Managed Detection",
    description:
      "Continuous, proactive monitoring and analysis of your security posture, identifying subtle anomalies before they become critical threats.",
    image: serviceImage1,
    offset: "",
  },
  {
    id: "02",
    title: "Incident Response",
    description:
      "Rapid, decisive action in the face of security breaches. Our experts contain, eradicate, and recover systems with forensic precision.",
    image: serviceImage2,
    offset: "md:mt-24",
  },
  {
    id: "03",
    title: "Strategic Consulting",
    description:
      "Architecting resilient security frameworks aligned with your business objectives. Intellectual depth applied to complex risk management.",
    image: serviceImage3,
    offset: "md:mt-48",
  },
];

export default function ServicesPage() {
  return (
    <div className="zx-editorial min-h-screen bg-[color:var(--zx-background)] text-[color:var(--zx-on-background)] font-manrope">
      <EditorialHeader active="services" />

      <main className="w-full pt-20">
        <div className="relative w-full overflow-hidden bg-[color:var(--zx-background)]">
          {/* --- HERO --- */}
          <div className="w-full pt-48 pb-32 px-5 md:px-8 lg:px-12 max-w-[1280px] mx-auto relative z-10 flex flex-col items-center text-center">
            <h1 className="font-libre-caslon text-[40px] md:text-[64px] text-[color:var(--zx-on-background)] mb-12 max-w-4xl tracking-tight">
              Refined Defense
            </h1>
            <p className="text-lg leading-relaxed text-[color:var(--zx-on-surface-variant)] max-w-2xl">
              Sophisticated protection for the digital age. We merge intellectual depth with technical precision to
              secure your most critical assets.
            </p>
          </div>

          {/* --- CAPABILITIES --- */}
          <div className="w-full pb-[120px] px-5 md:px-8 lg:px-12 max-w-[1280px] mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {capabilities.map((cap) => (
                <div key={cap.id} className={`flex flex-col gap-6 group ${cap.offset}`}>
                  <div className="w-full aspect-[4/5] relative rounded-[2rem] overflow-hidden bg-[color:var(--zx-primary-fixed)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <img
                      src={cap.image}
                      alt={cap.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--zx-background)]/80 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col gap-2 pl-4 border-l border-[color:var(--zx-outline-variant)]/30">
                    <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-tertiary)] tracking-widest uppercase">
                      {cap.id}
                    </span>
                    <h3 className="font-libre-caslon text-[24px] text-[color:var(--zx-on-background)]">
                      {cap.title}
                    </h3>
                    <p className="text-[color:var(--zx-on-surface-variant)] mt-2">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
