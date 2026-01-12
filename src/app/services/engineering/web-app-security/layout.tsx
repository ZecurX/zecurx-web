import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Application Security Testing | OWASP Top 10 & API Security",
  description: "Comprehensive web application security testing services. OWASP Top 10, API security, authentication testing, business logic testing, and security assessments for modern web applications.",
  keywords: [
    "web application security testing",
    "OWASP testing",
    "API security testing",
    "web app pentest",
    "authentication testing",
    "business logic testing",
    "web security assessment India"
  ],
  alternates: {
    canonical: "https://zecurx.com/services/engineering/web-app-security",
  },
  openGraph: {
    title: "Web Application Security Testing - ZecurX",
    description: "OWASP Top 10 testing, API security, and comprehensive web application security assessments.",
    url: "https://zecurx.com/services/engineering/web-app-security",
  },
};

export default function WebAppSecLayout({ children }: { children: React.ReactNode }) {
  return children;
}
