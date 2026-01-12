import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ransomware Defense | Ransomware Protection & Recovery",
  description: "Comprehensive ransomware defense with prevention, detection, and recovery capabilities. Protect against ransomware attacks with multi-layered security.",
  keywords: ["ransomware defense", "ransomware protection", "ransomware prevention", "ransomware recovery", "anti-ransomware", "ransomware security"],
  alternates: { canonical: "https://zecurx.com/solutions/ransomware-defense" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
