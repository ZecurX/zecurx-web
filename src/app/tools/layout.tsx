import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Security Tools | VulnHunter Suite | ZecurX",
  description: "Free cybersecurity tools for security professionals. Subdomain finder, port scanner, directory scanner, SSL analyzer, header scanner, and parameter finder. VulnHunter Suite by ZecurX.",
  keywords: [
    "free security tools",
    "subdomain finder",
    "port scanner online",
    "directory scanner",
    "SSL checker",
    "security header checker",
    "parameter finder",
    "bug bounty tools",
    "penetration testing tools free"
  ],
  alternates: { canonical: "https://zecurx.com/tools" },
  openGraph: {
    title: "VulnHunter Suite - Free Security Tools by ZecurX",
    description: "Free cybersecurity tools for reconnaissance and vulnerability discovery. Subdomain enumeration, port scanning, SSL analysis, and more.",
    url: "https://zecurx.com/tools",
    images: [{ url: "https://zecurx.com/og-tools.png", width: 1200, height: 630, alt: "VulnHunter Security Tools" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
