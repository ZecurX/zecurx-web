import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Security Header Scanner | HTTP Header Checker",
  description: "Free security header scanner. Analyze HTTP security headers including CSP, HSTS, X-Frame-Options, and more. Identify missing security headers on any website.",
  keywords: ["security header checker", "HTTP header scanner", "CSP checker", "HSTS checker", "security headers test", "header analyzer"],
  alternates: { canonical: "https://zecurx.com/tools/header-scanner" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
