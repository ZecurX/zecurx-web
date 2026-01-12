import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Resources | Blog, Whitepapers & Research",
  description: "Cybersecurity resources hub. Access blogs, whitepapers, research papers, guides, and webinars on security best practices, threat intelligence, and industry insights.",
  keywords: ["cybersecurity resources", "security blog", "whitepapers", "security research", "cyber security guides", "security webinars"],
  alternates: { canonical: "https://zecurx.com/resources" },
  openGraph: {
    title: "ZecurX Resources - Cybersecurity Knowledge Hub",
    description: "Access blogs, whitepapers, research, and guides on cybersecurity best practices.",
    url: "https://zecurx.com/resources",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
