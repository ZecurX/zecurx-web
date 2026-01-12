import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Endpoint Security Solutions | EDR & Threat Prevention",
  description: "Advanced endpoint detection and response (EDR) solutions. Protect endpoints from malware, ransomware, and advanced threats with AI-powered threat prevention and real-time monitoring.",
  keywords: ["endpoint security", "EDR", "endpoint detection response", "malware protection", "ransomware prevention", "endpoint protection platform"],
  alternates: { canonical: "https://zecurx.com/platform/endpoint-security" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
