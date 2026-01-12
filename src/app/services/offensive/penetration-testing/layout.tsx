import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Penetration Testing Services India | Advanced VAPT & Red Team",
  description: "Advanced penetration testing and adversary emulation services. External/internal pentesting, red team operations, web/mobile app testing, wireless security assessment. PCI-DSS, HIPAA, SOC2, ISO 27001 compliant.",
  keywords: [
    "penetration testing services India",
    "pentest company India",
    "red team services",
    "external penetration testing",
    "internal penetration testing",
    "web application penetration testing",
    "mobile app security testing",
    "wireless security assessment",
    "PCI DSS penetration testing",
    "VAPT services India",
    "ethical hacking services"
  ],
  alternates: {
    canonical: "https://zecurx.com/services/offensive/penetration-testing",
  },
  openGraph: {
    title: "Penetration Testing Services - ZecurX",
    description: "Advanced penetration testing simulating real-world attacks. Red team operations, web/mobile testing, compliance validation.",
    url: "https://zecurx.com/services/offensive/penetration-testing",
    images: [{ url: "https://zecurx.com/og-pentest.png", width: 1200, height: 630, alt: "ZecurX Penetration Testing Services" }],
  },
};

export default function PenTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
