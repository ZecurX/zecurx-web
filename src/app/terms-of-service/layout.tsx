import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ZecurX",
  description: "ZecurX terms of service. Read our terms and conditions for using our services and platform.",
  alternates: { canonical: "https://zecurx.com/terms-of-service" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
