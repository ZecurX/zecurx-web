import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevSecOps Services | CI/CD Security & Pipeline Integration",
  description: "DevSecOps implementation and consulting services. CI/CD security integration, automated security testing, container security, infrastructure as code security, and DevOps security best practices.",
  keywords: [
    "DevSecOps services India",
    "CI/CD security",
    "pipeline security",
    "container security",
    "infrastructure as code security",
    "automated security testing",
    "DevOps security",
    "shift left security"
  ],
  alternates: {
    canonical: "https://zecurx.com/services/engineering/devsecops",
  },
  openGraph: {
    title: "DevSecOps Services - ZecurX",
    description: "Integrate security into your CI/CD pipeline. Container security, IaC security, and automated testing.",
    url: "https://zecurx.com/services/engineering/devsecops",
  },
};

export default function DevSecOpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
