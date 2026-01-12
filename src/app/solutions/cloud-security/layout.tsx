import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloud Security Solutions | Secure Cloud Infrastructure",
  description: "Comprehensive cloud security solutions for AWS, Azure, and GCP. Cloud posture management, workload protection, and cloud-native security.",
  keywords: ["cloud security solutions", "AWS security", "Azure security", "GCP security", "cloud native security", "multi-cloud security"],
  alternates: { canonical: "https://zecurx.com/solutions/cloud-security" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
