import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Solutions | PCI-DSS, HIPAA, SOC2, ISO 27001",
  description: "Meet regulatory compliance requirements with our security solutions. PCI-DSS, HIPAA, SOC2, ISO 27001, GDPR compliance support and continuous monitoring.",
  keywords: ["compliance solutions", "PCI DSS compliance", "HIPAA compliance", "SOC2", "ISO 27001", "GDPR compliance", "regulatory compliance"],
  alternates: { canonical: "https://zecurx.com/solutions/compliance" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
