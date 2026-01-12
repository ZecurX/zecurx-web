import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo | See ZecurX Platform in Action",
  description: "Schedule a personalized demo of ZecurX cybersecurity platform. See how our solutions can protect your organization from advanced threats.",
  keywords: ["book demo", "ZecurX demo", "cybersecurity demo", "platform demo", "security solution demo"],
  alternates: { canonical: "https://zecurx.com/book-demo" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
