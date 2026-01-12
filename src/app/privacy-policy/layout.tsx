import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ZecurX",
  description: "ZecurX privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://zecurx.com/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
