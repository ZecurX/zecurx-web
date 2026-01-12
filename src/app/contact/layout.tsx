import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ZecurX | Get in Touch for Cybersecurity Solutions",
  description: "Contact ZecurX for cybersecurity services, training inquiries, or partnership opportunities. Get a quote for penetration testing, VAPT, or security consulting.",
  keywords: ["contact ZecurX", "cybersecurity quote", "VAPT inquiry", "security services contact", "training inquiry"],
  alternates: { canonical: "https://zecurx.com/contact" },
  openGraph: {
    title: "Contact ZecurX",
    description: "Get in touch for cybersecurity services and training inquiries.",
    url: "https://zecurx.com/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
