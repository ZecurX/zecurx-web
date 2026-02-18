/**
 * Shared course data used by both the Academy page and the checkout API.
 * This is the single source of truth for course information.
 */

export interface CourseData {
    id: string;
    title: string;
    description: string;
    price: number | string;
    originalPrice?: number;
    duration: string;
    students?: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    features: string[];
    popular?: boolean;
    brochureLink?: string;
}

// Import CDN_ASSETS is only needed for brochure links on the client side.
// For server-side usage (API routes), brochureLink isn't needed.

export const courses: CourseData[] = [
    {
        id: '93a3af86-761a-47a9-80f5-a97534916364',
        title: 'CyberSecurity + Generative AI Bundle',
        description: 'Master the future of security with this comprehensive program combining core cybersecurity skills with cutting-edge Generative AI defense strategies.',
        price: 9500,
        originalPrice: 34999,
        duration: '3 Months',
        students: 150,
        level: 'Beginner',
        features: [
            'Full practical exposure on live targets',
            'ISO Verified Certification',
            '3 ISO Certified Exam Vouchers',
            'AI for Threat Detection & Response',
            'Prompt Engineering for Security Ops',
            'Hands-on Labs & Capstone Project',
            'Internship Opportunity',
        ],
        popular: true,
    },
    {
        id: '06a10be6-115a-4a83-b338-67168abcce1a',
        title: 'zxCPEH - Certified Professional Ethical Hacker',
        description: 'Advanced ethical hacking methodology. Learn to think like an adversary to secure critical infrastructure.',
        price: 25000,
        originalPrice: 35499,
        duration: '60 Hours',
        students: 500,
        level: 'Intermediate',
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Advanced Exploitation',
            'Network & Web Security',
            'Privilege Escalation',
            'Active Directory Attacks',
            'Project-Based Learning',
        ],
    },
    {
        id: '1033198a-bf65-4183-9e6e-aab727903039',
        title: 'zxCPPT - Certified Professional Pen Tester',
        description: 'Professional penetration testing certification. Master the art of identifying potential security breaches.',
        price: 35400,
        originalPrice: 49999,
        duration: '80 Hours',
        students: 200,
        level: 'Advanced',
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Red Teaming Methodology',
            'Advanced Evasion Techniques',
            'Report Writing & Documentation',
            'Custom Exploit Development',
            'Industry Standard Tools',
        ],
    },
    {
        id: 'b5276793-8c55-4759-8206-3d1a833fe304',
        title: 'zxGAIP - Generative AI Professional',
        description: 'Leverage Generative AI for security operations, automation, and threat intelligence.',
        price: 25000,
        originalPrice: 35499,
        duration: '40 Hours',
        students: 120,
        level: 'Intermediate',
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'LLMs for Security',
            'Automated Threat Hunting',
            'Secure AI Deployment',
            'AI Risk Management',
            'Real-world Case Studies',
        ],
    },
    {
        id: '7f0e2cb3-82c1-4634-9a95-67a2ae14a815',
        title: 'zxCCP - Certified Cybersecurity Practitioner',
        description: 'Practical cybersecurity skills for professionals. Focus on defense, incident handling, and everyday security operations.',
        price: 'Institution Only',
        duration: 'Custom',
        level: 'Beginner',
        features: [
            'Incident Response Basics',
            'Security Controls Implementation',
            'Policy & Compliance',
            'Log Analysis',
            'Institutional Training',
        ],
    },
    {
        id: '3613d162-d801-47c6-9305-719f999738c8',
        title: 'zxCCF - Certified Cybersecurity Foundations',
        description: 'Foundational knowledge for a career in cybersecurity. Understand the landscape, threats, and basic protections.',
        price: 'Institution Only',
        duration: 'Custom',
        level: 'Beginner',
        features: [
            'Core Security Concepts',
            'Network Fundamentals',
            'Cryptography Basics',
            'Security Ethics',
            'Career Roadmap',
        ],
    },
    {
        id: 'ef34cbc8-c918-4e64-bd88-799863b299e1',
        title: 'zxCCE - Certified Cybersecurity Expert',
        description: 'Expert-level training for leadership roles. Strategy, governance, and advanced security architecture.',
        price: 'Institution Only',
        duration: 'Custom',
        level: 'Expert',
        features: [
            'Security Governance',
            'Risk Management',
            'C-Level Communication',
            'Enterprise Architecture',
            'Strategic Planning',
        ],
    },
    {
        id: '9bce53be-103e-46b9-9fa0-2b91260f38db',
        title: 'zxCFD - Certified Fullstack Dev',
        description: 'Become a security-aware fullstack developer. Build robust, secure applications from the ground up.',
        price: 'Contact for Pricing',
        duration: 'Coming Soon',
        level: 'Intermediate',
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Secure Coding Practices',
            'Modern Stack (Next.js, Node)',
            'Database Security',
            'API Development',
            'DevSecOps Basics',
        ],
    },
];

/**
 * Look up a course by its UUID.
 * Returns the course data if found, or undefined.
 */
export function getCourseById(id: string): CourseData | undefined {
    return courses.find(course => course.id === id);
}
