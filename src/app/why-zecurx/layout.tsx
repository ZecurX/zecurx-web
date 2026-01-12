import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Choose ZecurX | Our Approach to Cybersecurity",
  description: "Discover why leading organizations choose ZecurX for their cybersecurity needs. Our expertise, methodology, and commitment to security excellence.",
  keywords: ["why ZecurX", "about ZecurX", "cybersecurity company India", "security expertise", "ZecurX difference"],
  alternates: { canonical: "https://zecurx.com/why-zecurx" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
