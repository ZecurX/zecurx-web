import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZecurX Shop | Security Merchandise & Resources",
  description: "ZecurX shop for security merchandise, resources, and exclusive content. Support cybersecurity education and awareness.",
  keywords: ["ZecurX shop", "security merchandise", "cybersecurity resources"],
  alternates: { canonical: "https://zecurx.com/shop" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
