import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Internships | ZecurX Career Opportunities",
  description: "Kickstart your cybersecurity career with ZecurX internships. Gain hands-on experience in penetration testing, security operations, and threat analysis.",
  keywords: ["cybersecurity internship", "security internship India", "pentest internship", "SOC internship", "cybersecurity career", "security analyst internship"],
  alternates: { canonical: "https://zecurx.com/internships" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
