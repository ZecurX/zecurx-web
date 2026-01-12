import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered SOC | Next-Gen Security Operations Center",
  description: "AI-powered Security Operations Center (SOC) with automated threat detection, intelligent alert prioritization, and accelerated incident response.",
  keywords: ["AI SOC", "security operations center", "automated SOC", "AI threat detection", "SIEM alternative", "security analytics"],
  alternates: { canonical: "https://zecurx.com/solutions/ai-powered-soc" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
