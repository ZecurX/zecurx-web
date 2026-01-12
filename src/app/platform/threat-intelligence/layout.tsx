import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threat Intelligence Platform | CTI & Threat Feeds",
  description: "Cyber threat intelligence (CTI) platform with real-time threat feeds, IOC management, threat hunting, and intelligence-driven security operations.",
  keywords: ["threat intelligence", "CTI", "threat feeds", "IOC", "threat hunting", "cyber threat intelligence", "security intelligence"],
  alternates: { canonical: "https://zecurx.com/platform/threat-intelligence" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
