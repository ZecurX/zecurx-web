import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Consulting Services | vCISO & Strategy",
  description: "Expert cybersecurity consulting services. Virtual CISO (vCISO), security strategy, risk assessment, compliance consulting, security program development, and security governance advisory.",
  keywords: [
    "security consulting India",
    "vCISO services",
    "cybersecurity strategy",
    "security risk assessment",
    "compliance consulting",
    "security program development",
    "CISO advisory",
    "security governance"
  ],
  alternates: {
    canonical: "https://zecurx.com/services/engineering/consulting",
  },
  openGraph: {
    title: "Security Consulting Services - ZecurX",
    description: "Expert vCISO, security strategy, and compliance consulting services.",
    url: "https://zecurx.com/services/engineering/consulting",
  },
};

export default function ConsultingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
