import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Protection Solutions | DLP, Encryption & Privacy",
  description: "Enterprise data protection with data loss prevention (DLP), encryption, data classification, and privacy compliance for sensitive data security.",
  keywords: ["data protection", "DLP", "data loss prevention", "encryption", "data classification", "data privacy", "data security"],
  alternates: { canonical: "https://zecurx.com/platform/data-protection" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
