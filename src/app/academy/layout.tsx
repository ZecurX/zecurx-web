import { Metadata } from "next";
import { StructuredData, getEducationalOrganizationSchema, getCourseSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "ZecurX Academy - Cybersecurity Training & ISO-Verified Certifications",
  description: "Master cybersecurity with ZecurX Academy. ISO-verified certifications in ethical hacking, penetration testing, and AI security. Hands-on labs, expert instruction, and internship opportunities.",
  keywords: [
    "cybersecurity training",
    "ethical hacking certification",
    "penetration testing course",
    "security certifications",
    "cybersecurity bootcamp",
    "offensive security training",
    "CEH alternative",
    "ISO certified cybersecurity",
    "generative AI security",
    "cybersecurity academy",
    "ethical hacking course",
    "penetration testing certification",
    "cybersecurity career",
    "security training online"
  ],
  openGraph: {
    title: "ZecurX Academy - Professional Cybersecurity Training & Certifications",
    description: "ISO-verified cybersecurity certifications with hands-on labs. Ethical hacking, penetration testing, and AI security training for career growth.",
    type: "website",
    url: "https://zecurx.com/academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZecurX Academy - Cybersecurity Training & Certifications",
    description: "ISO-verified certifications in ethical hacking, penetration testing, and AI security. Hands-on labs and internship opportunities.",
  },
  alternates: {
    canonical: "https://zecurx.com/academy",
  },
};

const courses = [
  {
    name: 'zxCPEH - Certified Professional Ethical Hacker',
    description: 'Advanced ethical hacking methodology. Learn to think like an adversary to secure critical infrastructure.',
    price: 25000,
    duration: '60 Hours',
    level: 'Intermediate' as const,
  },
  {
    name: 'zxCPPT - Certified Professional Pen Tester',
    description: 'Professional penetration testing certification. Master the art of identifying potential security breaches.',
    price: 35400,
    duration: '80 Hours',
    level: 'Advanced' as const,
  },
  {
    name: 'zxGAIP - Generative AI Professional',
    description: 'Leverage Generative AI for security operations, automation, and threat intelligence.',
    price: 25000,
    duration: '40 Hours',
    level: 'Intermediate' as const,
  },
  {
    name: 'CyberSecurity + Generative AI Bundle',
    description: 'Master the future of security with this comprehensive program combining core cybersecurity skills with cutting-edge Generative AI defense strategies.',
    price: 9500,
    duration: '3 Months',
    level: 'Beginner' as const,
  },
];

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={getEducationalOrganizationSchema()} />
      {courses.map((course, index) => (
        <StructuredData key={index} data={getCourseSchema(course)} />
      ))}
      {children}
    </>
  );
}
