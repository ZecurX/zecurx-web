import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SSL Analyzer | SSL/TLS Certificate Checker",
  description: "Free SSL/TLS certificate analyzer. Check SSL certificate validity, expiration, configuration, and security issues. Identify weak ciphers and misconfigurations.",
  keywords: ["SSL checker", "SSL analyzer", "TLS checker", "certificate checker", "SSL security test", "HTTPS checker", "SSL certificate validator"],
  alternates: { canonical: "https://zecurx.com/tools/ssl-analyzer" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
