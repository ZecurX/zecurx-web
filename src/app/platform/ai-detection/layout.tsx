import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Threat Detection | Machine Learning Security",
  description: "AI-powered threat detection using machine learning and behavioral analysis. Detect zero-day attacks, anomalies, and advanced persistent threats in real-time.",
  keywords: ["AI threat detection", "machine learning security", "behavioral analysis", "zero-day detection", "anomaly detection", "AI security"],
  alternates: { canonical: "https://zecurx.com/platform/ai-detection" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
