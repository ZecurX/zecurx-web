import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloud Security Solutions | CSPM, CWPP & Multi-Cloud Protection",
  description: "Comprehensive cloud security solutions including Cloud Security Posture Management (CSPM), Cloud Workload Protection (CWPP), and multi-cloud visibility for AWS, Azure, and GCP.",
  keywords: ["cloud security", "CSPM", "CWPP", "AWS security", "Azure security", "GCP security", "multi-cloud security", "cloud posture management"],
  alternates: { canonical: "https://zecurx.com/platform/cloud-security" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
