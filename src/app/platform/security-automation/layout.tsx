import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Automation | SOAR & Orchestration",
  description: "Security orchestration, automation and response (SOAR) platform. Automate incident response, playbook execution, and security workflows for faster threat remediation.",
  keywords: ["security automation", "SOAR", "security orchestration", "incident response automation", "playbook automation", "security workflows"],
  alternates: { canonical: "https://zecurx.com/platform/security-automation" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
