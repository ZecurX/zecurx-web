import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Security Solutions | SAST, DAST & Runtime Protection",
  description: "Comprehensive application security with static analysis (SAST), dynamic testing (DAST), runtime application self-protection (RASP), and API security for modern applications.",
  keywords: ["application security", "SAST", "DAST", "RASP", "API security", "AppSec", "software security", "secure coding"],
  alternates: { canonical: "https://zecurx.com/platform/application-security" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
