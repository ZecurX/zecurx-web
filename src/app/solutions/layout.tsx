import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Solutions | Industry & Use Case Solutions",
  description: "Tailored cybersecurity solutions for digital transformation, AI-powered SOC, zero trust architecture, ransomware defense, cloud security, and compliance requirements.",
  keywords: ["cybersecurity solutions", "enterprise security", "digital transformation security", "zero trust", "ransomware defense", "compliance solutions"],
  alternates: { canonical: "https://zecurx.com/solutions" },
  openGraph: {
    title: "ZecurX Cybersecurity Solutions",
    description: "Tailored security solutions for enterprise challenges.",
    url: "https://zecurx.com/solutions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
