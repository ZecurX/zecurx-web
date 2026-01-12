import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subdomain Finder | Subdomain Enumeration Tool",
  description: "Free online subdomain finder tool. Discover subdomains for any domain using multiple techniques. Essential for bug bounty hunters and penetration testers.",
  keywords: ["subdomain finder", "subdomain enumeration", "find subdomains", "subdomain scanner", "bug bounty tools", "recon tool"],
  alternates: { canonical: "https://zecurx.com/tools/subdomain-finder" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
