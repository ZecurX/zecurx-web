import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Port Scanner | Online Port Radar Tool",
  description: "Free online port scanner tool. Scan open ports on any target. Identify running services and potential vulnerabilities. Fast and accurate port scanning.",
  keywords: ["port scanner", "online port scanner", "port scan", "open port checker", "network scanner", "nmap alternative online"],
  alternates: { canonical: "https://zecurx.com/tools/port-radar" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
