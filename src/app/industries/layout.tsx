import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve | Cybersecurity by Sector",
  description: "Industry-specific cybersecurity solutions for banking, healthcare, e-commerce, technology, government, and manufacturing. Compliance-ready security for your sector.",
  keywords: ["cybersecurity industries", "banking security", "healthcare security", "e-commerce security", "government cybersecurity", "manufacturing security"],
  alternates: { canonical: "https://zecurx.com/industries" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
