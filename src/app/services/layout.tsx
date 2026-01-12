import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Services | Penetration Testing & Security Engineering",
  description: "Comprehensive cybersecurity services including penetration testing, vulnerability assessment, secure development, DevSecOps, and security consulting. Enterprise-grade VAPT services for Indian businesses.",
  keywords: [
    "cybersecurity services India",
    "penetration testing company",
    "VAPT services",
    "vulnerability assessment",
    "security consulting",
    "DevSecOps services",
    "application security testing",
    "red team services"
  ],
  alternates: {
    canonical: "https://zecurx.com/services",
  },
  openGraph: {
    title: "ZecurX Cybersecurity Services",
    description: "Enterprise-grade penetration testing, vulnerability assessment, and security engineering services.",
    url: "https://zecurx.com/services",
    images: [{ url: "https://zecurx.com/og-services.png", width: 1200, height: 630, alt: "ZecurX Cybersecurity Services" }],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
