import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Directory Scanner | Web Directory Brute Force Tool",
  description: "Free online directory scanner tool. Discover hidden directories and files on web servers. Essential for web application security testing and bug bounty.",
  keywords: ["directory scanner", "directory brute force", "hidden directory finder", "web directory scanner", "dirbuster alternative", "gobuster online"],
  alternates: { canonical: "https://zecurx.com/tools/directory-scanner" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
