import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Development Services | SSDLC & Secure Coding",
  description: "Secure software development lifecycle (SSDLC) services. Secure coding practices, code review, threat modeling, and security architecture design. Build security into your applications from the ground up.",
  keywords: [
    "secure development services",
    "SSDLC",
    "secure coding practices",
    "security code review",
    "threat modeling",
    "security architecture",
    "secure SDLC",
    "application security India"
  ],
  alternates: {
    canonical: "https://zecurx.com/services/engineering/secure-development",
  },
  openGraph: {
    title: "Secure Development Services - ZecurX",
    description: "Build security into your SDLC. Secure coding, code review, threat modeling, and security architecture.",
    url: "https://zecurx.com/services/engineering/secure-development",
  },
};

export default function SecureDevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
