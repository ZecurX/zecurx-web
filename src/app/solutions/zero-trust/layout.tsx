import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zero Trust Security | Zero Trust Architecture Implementation",
  description: "Implement zero trust security architecture. Never trust, always verify with identity-centric security, micro-segmentation, and continuous verification.",
  keywords: ["zero trust security", "zero trust architecture", "ZTA", "zero trust network", "micro-segmentation", "identity-centric security"],
  alternates: { canonical: "https://zecurx.com/solutions/zero-trust" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
