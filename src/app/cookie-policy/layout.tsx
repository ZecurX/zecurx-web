import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ZecurX",
  description: "ZecurX cookie policy. Learn how we use cookies and similar technologies on our website.",
  alternates: { canonical: "https://zecurx.com/cookie-policy" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
