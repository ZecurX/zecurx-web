import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Platform | Cloud, Endpoint & Application Security",
  description: "ZecurX unified cybersecurity platform featuring endpoint security, cloud security, identity security, application security, AI detection, threat intelligence, security automation, and data protection.",
  keywords: [
    "cybersecurity platform",
    "unified security platform",
    "cloud security platform",
    "endpoint protection",
    "identity security",
    "security automation",
    "threat intelligence platform",
    "SIEM alternative"
  ],
  alternates: {
    canonical: "https://zecurx.com/platform",
  },
  openGraph: {
    title: "ZecurX Cybersecurity Platform",
    description: "Unified security platform for endpoint, cloud, identity, and application protection.",
    url: "https://zecurx.com/platform",
    images: [{ url: "https://zecurx.com/og-platform.png", width: 1200, height: 630, alt: "ZecurX Platform" }],
  },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children;
}
