import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Parameter Finder | URL Parameter Discovery Tool",
  description: "Free parameter finder tool. Discover hidden URL parameters on web applications. Essential for finding injection points and security testing.",
  keywords: ["parameter finder", "URL parameter discovery", "hidden parameter finder", "param miner", "web parameter scanner", "injection point finder"],
  alternates: { canonical: "https://zecurx.com/tools/param-finder" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
