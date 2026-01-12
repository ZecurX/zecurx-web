import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity Training Courses India | ISO Certified | ZecurX Academy",
  description: "Master ethical hacking, penetration testing & VAPT with ZecurX Academy. ISO certified courses including zxCPEH, zxCPPT, zxGAIP. 1200+ students trained, 95% pass rate. Hands-on labs, internship opportunities. Enroll now!",
  keywords: [
    "cybersecurity courses India",
    "ethical hacking training",
    "penetration testing certification",
    "VAPT course",
    "ISO certified cybersecurity",
    "zxCPEH",
    "zxCPPT",
    "zxGAIP",
    "CEH alternative India",
    "cyber security training academy",
    "ethical hacking course online",
    "security certification India",
    "cybersecurity bootcamp",
    "hacking course with placement",
    "best cybersecurity course India"
  ],
  alternates: {
    canonical: "https://zecurx.com/academy",
  },
  openGraph: {
    title: "ZecurX Academy - ISO Certified Cybersecurity Training",
    description: "Master ethical hacking & penetration testing with hands-on training. 1200+ students trained, 95% pass rate. ISO certified courses with internship opportunities.",
    url: "https://zecurx.com/academy",
    type: "website",
    images: [
      {
        url: "https://zecurx.com/og-academy.png",
        width: 1200,
        height: 630,
        alt: "ZecurX Academy - Cybersecurity Training Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZecurX Academy - ISO Certified Cybersecurity Courses",
    description: "Master ethical hacking & penetration testing. 1200+ students trained, 95% pass rate.",
    images: ["https://zecurx.com/og-academy.png"],
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
