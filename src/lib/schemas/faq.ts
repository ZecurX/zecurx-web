// FAQ Schema for structured data

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Academy FAQs
export const academyFAQs: FAQItem[] = [
  {
    question: "What cybersecurity courses does ZecurX Academy offer?",
    answer: "ZecurX Academy offers professional cybersecurity courses including zxCPEH (Certified Professional Ethical Hacker), zxCPPT (Certified Professional Penetration Tester), zxGAIP (Generative AI Professional), and foundational courses like zxCCF (Certified Cybersecurity Foundations). All courses are ISO verified with hands-on labs."
  },
  {
    question: "Are ZecurX certifications recognized internationally?",
    answer: "Yes, all ZecurX certifications are ISO verified and recognized internationally. Our curriculum is aligned with global standards like CEH, CISSP, OSCP, and CompTIA certifications, making them valuable for careers worldwide."
  },
  {
    question: "What is the pass rate for ZecurX certification exams?",
    answer: "ZecurX Academy maintains a 95% pass rate across all certification exams. This high success rate is achieved through comprehensive training, hands-on labs, and real-world attack simulations."
  },
  {
    question: "Do you offer placement assistance after course completion?",
    answer: "Yes, ZecurX Academy provides internship opportunities and career acceleration support. Our graduates have achieved 15-30% salary increases, and we have a proven track record of placing students in top security roles."
  },
  {
    question: "What are the prerequisites for the zxCPEH course?",
    answer: "The zxCPEH (Certified Professional Ethical Hacker) course is designed for intermediate learners. Basic understanding of networking concepts and operating systems is recommended. No prior hacking experience is required."
  },
  {
    question: "How long are the cybersecurity courses?",
    answer: "Course durations vary: zxCPEH is 60 hours, zxCPPT is 80 hours, zxGAIP is 40 hours, and the Cybersecurity + Generative AI Bundle is a 3-month comprehensive program. All courses include hands-on labs and practical exposure."
  },
  {
    question: "What payment options are available for courses?",
    answer: "ZecurX Academy accepts payments through Razorpay, supporting credit/debit cards, UPI, net banking, and EMI options. We offer competitive pricing with significant discounts on original course prices."
  },
  {
    question: "Do courses include practical labs?",
    answer: "Yes, all ZecurX courses include extensive hands-on labs with real-world attack simulations. Students practice on live targets in our dedicated cloud infrastructure, learning practical skills that directly apply to industry roles."
  },
  {
    question: "What is included in the ISO Certified Exam Voucher?",
    answer: "The ISO Certified Exam Voucher includes one attempt at the official certification exam, which upon passing, grants you an internationally recognized ISO verified certificate with a unique verification ID."
  },
  {
    question: "Can organizations enroll their teams for corporate training?",
    answer: "Yes, ZecurX Academy offers enterprise training with customized security capability building for engineering and operations teams. Contact our sales team for custom duration and pricing for institutional enrollments."
  },
  {
    question: "How does zxCPEH compare to CEH certification?",
    answer: "zxCPEH offers more hands-on practical training compared to CEH, with focus on real-world exploitation techniques. It's more affordable, includes ISO certification, and provides internship opportunities. Our curriculum covers advanced topics like Active Directory attacks and privilege escalation."
  },
  {
    question: "What topics are covered in the Penetration Testing course?",
    answer: "The zxCPPT course covers Red Teaming Methodology, Advanced Evasion Techniques, Report Writing & Documentation, Custom Exploit Development, and industry standard tools. It's designed for advanced learners seeking professional penetration testing skills."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Please contact our support team for information about our refund policy. We are committed to student satisfaction and will work with you to ensure you get value from your investment in cybersecurity education."
  },
  {
    question: "How do I download the course brochure?",
    answer: "Course brochures are available for download directly from the Academy page. Click on the 'Download Brochure' button on any course card to get detailed information about curriculum, duration, and certification details."
  },
  {
    question: "What career opportunities are available after certification?",
    answer: "ZecurX certified professionals work as Ethical Hackers, Penetration Testers, Security Analysts, SOC Analysts, Security Consultants, and Red Team members. Our certifications are valued by top companies in India and globally."
  }
];

// Penetration Testing Service FAQs
export const penetrationTestingFAQs: FAQItem[] = [
  {
    question: "What is penetration testing and why do I need it?",
    answer: "Penetration testing is a simulated cyber attack against your systems to identify exploitable vulnerabilities before malicious attackers do. It's essential for validating your security controls, meeting compliance requirements (PCI-DSS, HIPAA, ISO 27001), and protecting your business from data breaches."
  },
  {
    question: "What is the difference between penetration testing and vulnerability assessment?",
    answer: "Vulnerability assessment identifies potential security weaknesses through automated scanning. Penetration testing goes further by actually attempting to exploit those vulnerabilities to demonstrate real business impact. ZecurX combines both for comprehensive security validation."
  },
  {
    question: "How long does a penetration test take?",
    answer: "Duration varies based on scope: web application testing typically takes 1-2 weeks, network penetration testing 2-3 weeks, and full red team engagements can take 4-8 weeks. We provide detailed timelines during the scoping phase."
  },
  {
    question: "Will penetration testing disrupt my business operations?",
    answer: "ZecurX follows careful protocols to minimize disruption. We schedule tests during off-peak hours when possible and coordinate closely with your team. Our methodology includes safeguards to prevent service interruptions while still providing thorough testing."
  },
  {
    question: "What compliance standards do your penetration tests support?",
    answer: "Our penetration testing services are aligned with PCI-DSS, HIPAA, SOC2, ISO 27001, and GDPR requirements. We provide compliance-ready reports that satisfy auditor requirements and help maintain your certifications."
  },
  {
    question: "What types of penetration testing do you offer?",
    answer: "We offer External Penetration Testing (internet-facing assets), Internal Penetration Testing (insider threat simulation), Red Team Operations (full-scope adversarial simulation), Wireless Security Assessment, and Web & Mobile Application Testing."
  },
  {
    question: "What methodology does ZecurX use for penetration testing?",
    answer: "We follow industry-standard methodologies including OWASP, PTES (Penetration Testing Execution Standard), and MITRE ATT&CK framework. Our approach combines automated tools with manual expert testing to find vulnerabilities that scanners miss."
  },
  {
    question: "What's included in the penetration testing report?",
    answer: "Our reports include executive summary for leadership, detailed technical findings with CVSS scores, proof-of-concept demonstrations, reproduction steps for developers, prioritized remediation recommendations, and compliance mapping."
  },
  {
    question: "How is ZecurX different from other penetration testing companies?",
    answer: "ZecurX combines industry-leading automation with expert human intuition. We focus on business logic flaws, not just CVSS scores. Our reports speak to both executives (risk, impact) and developers (reproduction steps, code fixes). We achieve 0 false positives through manual verification."
  },
  {
    question: "Do you provide remediation support after the test?",
    answer: "Yes, we provide remediation guidance and can schedule re-testing to validate fixes. Our team is available to answer technical questions and help your developers understand and fix identified vulnerabilities."
  },
  {
    question: "How do I request a quote for penetration testing services?",
    answer: "Contact us through our website's contact form or book a demo call. We'll discuss your infrastructure, scope requirements, compliance needs, and provide a detailed proposal with transparent pricing."
  },
  {
    question: "What information do you need to scope a penetration test?",
    answer: "We need details about your infrastructure (number of IPs, applications, cloud environments), testing scope (what's in and out of scope), compliance requirements, preferred testing windows, and any specific concerns or previous findings."
  }
];

// General/Homepage FAQs
export const generalFAQs: FAQItem[] = [
  {
    question: "What services does ZecurX provide?",
    answer: "ZecurX provides comprehensive cybersecurity solutions including Penetration Testing, Vulnerability Assessment (VAPT), Secure Development, DevSecOps, Security Consulting, and professional cybersecurity training through ZecurX Academy."
  },
  {
    question: "Where is ZecurX located?",
    answer: "ZecurX is headquartered in India and serves clients globally. We offer both on-site and remote security services, making our expertise accessible to organizations worldwide."
  },
  {
    question: "What industries does ZecurX serve?",
    answer: "We serve diverse industries including Banking & Finance, Healthcare, E-commerce, Technology, Government, Manufacturing, and Startups. Our solutions are tailored to meet industry-specific compliance and security requirements."
  },
  {
    question: "Does ZecurX work with international clients?",
    answer: "Yes, ZecurX serves clients globally. Our services are designed to meet international security standards and compliance requirements including GDPR, PCI-DSS, HIPAA, and ISO 27001."
  },
  {
    question: "What are the VulnHunter tools?",
    answer: "VulnHunter is ZecurX's free security tools suite including Subdomain Finder, Port Radar, Directory Scanner, SSL Analyzer, Header Scanner, and Parameter Finder. These tools help security professionals and organizations identify potential vulnerabilities."
  }
];
