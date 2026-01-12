import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identity Security Solutions | IAM, PAM & Zero Trust Access",
  description: "Identity and access management (IAM) solutions with privileged access management (PAM), zero trust network access, and identity governance for enterprise security.",
  keywords: ["identity security", "IAM", "PAM", "privileged access management", "zero trust", "identity governance", "access management"],
  alternates: { canonical: "https://zecurx.com/platform/identity-security" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
