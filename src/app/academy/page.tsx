"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, Shield, Award, Users,
    Target, BookOpen, Rocket, ArrowRight
} from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import CourseCard from '@/components/academy/CourseCard';
import { FAQSection } from '@/components/seo';
import { Breadcrumb } from '@/components/seo';
import { academyFAQs, getAcademyBreadcrumb, getAllCoursesSchema, getEducationalOrganizationSchema } from '@/lib/schemas';

// Sample courses data - replace with your actual courses
const courses = [
    {
        id: 'cybersec-genai-bundle',
        title: 'CyberSecurity + Generative AI Bundle',
        description: 'Master the future of security with this comprehensive program combining core cybersecurity skills with cutting-edge Generative AI defense strategies.',
        price: 9500,
        originalPrice: 34999,
        duration: '3 Months',
        students: 150,
        level: 'Beginner' as const,
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
        // brochureLink: '/brochures/Bundle.pdf', // Missing
    },
    {
        id: 'zx-cpeh',
        title: 'zxCPEH - Certified Professional Ethical Hacker',
        description: 'Advanced ethical hacking methodology. Learn to think like an adversary to secure critical infrastructure.',
        price: 25000,
        originalPrice: 35499,
        duration: '60 Hours',
        students: 500,
        level: 'Intermediate' as const,
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Advanced Exploitation',
            'Network & Web Security',
            'Privilege Escalation',
            'Active Directory Attacks',
            'Project-Based Learning',
        ],
        brochureLink: '/brochures/zxCPEH_Brochure_v3.pdf',
    },
    {
        id: 'zx-cppt',
        title: 'zxCPPT - Certified Professional Pen Tester',
        description: 'Professional penetration testing certification. Master the art of identifying potential security breaches.',
        price: 35400,
        originalPrice: 49999,
        duration: '80 Hours',
        students: 200,
        level: 'Advanced' as const,
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Red Teaming Methodology',
            'Advanced Evasion Techniques',
            'Report Writing & Documentation',
            'Custom Exploit Development',
            'Industry Standard Tools',
        ],
        brochureLink: '/brochures/zxCPPT_Brochure_v3.pdf',
    },
    {
        id: 'zx-gaip',
        title: 'zxGAIP - Generative AI Professional',
        description: 'Leverage Generative AI for security operations, automation, and threat intelligence.',
        price: 25000,
        originalPrice: 35499,
        duration: '40 Hours',
        students: 120,
        level: 'Intermediate' as const,
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'LLMs for Security',
            'Automated Threat Hunting',
            'Secure AI Deployment',
            'AI Risk Management',
            'Real-world Case Studies',
        ],
        // brochureLink: '/brochures/zxGAIP.pdf', // Missing
    },
    {
        id: 'zx-ccp',
        title: 'zxCCP - Certified Cybersecurity Practitioner',
        description: 'Practical cybersecurity skills for professionals. Focus on defense, incident handling, and everyday security operations.',
        price: "Institution Only",
        duration: 'Custom',
        level: 'Beginner' as const,
        features: [
            'Incident Response Basics',
            'Security Controls Implementation',
            'Policy & Compliance',
            'Log Analysis',
            'Institutional Training',
        ],
        brochureLink: '/brochures/Course_Brochure_zxCCP.pdf',
    },
    {
        id: 'zx-ccf',
        title: 'zxCCF - Certified Cybersecurity Foundations',
        description: 'Foundational knowledge for a career in cybersecurity. Understand the landscape, threats, and basic protections.',
        price: "Institution Only",
        duration: 'Custom',
        level: 'Beginner' as const,
        features: [
            'Core Security Concepts',
            'Network Fundamentals',
            'Cryptography Basics',
            'Security Ethics',
            'Career Roadmap',
        ],
        brochureLink: '/brochures/Course_Brochure_zxCCF.pdf',
    },
    {
        id: 'zx-cce',
        title: 'zxCCE - Certified Cybersecurity Expert',
        description: 'Expert-level training for leadership roles. Strategy, governance, and advanced security architecture.',
        price: "Institution Only",
        duration: 'Custom',
        level: 'Expert' as const,
        features: [
            'Security Governance',
            'Risk Management',
            'C-Level Communication',
            'Enterprise Architecture',
            'Strategic Planning',
        ],
        brochureLink: '/brochures/Course_Brochure_zxCCE.pdf',
    },
    {
        id: 'zx-cfd',
        title: 'zxCFD - Certified Fullstack Dev',
        description: 'Become a security-aware fullstack developer. Build robust, secure applications from the ground up.',
        price: "Contact for Pricing",
        duration: 'Coming Soon',
        level: 'Intermediate' as const,
        features: [
            'ISO Verified Certification',
            'ISO Certified Exam Voucher',
            'Secure Coding Practices',
            'Modern Stack (Next.js, Node)',
            'Database Security',
            'API Development',
            'DevSecOps Basics',
        ],
        // brochureLink: '/brochures/zxCFD.pdf', // Missing
    }
];

const stats = [
    { icon: Users, value: '1,200+', label: 'Students Trained' },
    { icon: Award, value: '95%', label: 'Pass Rate' },
    { icon: BookOpen, value: '10+', label: 'Courses' },
    { icon: GraduationCap, value: '10+', label: 'Expert Instructors' },
];

// Courses data for schema generation
const coursesForSchema = courses.map(course => ({
    id: course.id,
    name: course.title,
    description: course.description,
    price: course.price,
    originalPrice: course.originalPrice,
    duration: course.duration,
    level: course.level,
    students: course.students,
    features: course.features,
}));

export default function AcademyPage() {
    // Generate structured data
    const coursesSchema = getAllCoursesSchema(coursesForSchema);
    const educationalOrgSchema = getEducationalOrganizationSchema();
    const breadcrumbItems = getAcademyBreadcrumb();

    return (
        <>
            {/* JSON-LD Structured Data for Courses */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(coursesSchema),
                }}
            />
            {/* JSON-LD Structured Data for Educational Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(educationalOrgSchema),
                }}
            />
            
            <main className="min-h-screen bg-background">
                <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                {/* Breadcrumb Navigation */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                
                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter">
                            ZecurX Academy
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl mb-12">
                            Elite cybersecurity training for the modern threat landscape. Master the skills that matter.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <a
                                href="#courses"
                                className="inline-flex items-center gap-2 text-foreground font-semibold border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
                            >
                                <span>Explore Curriculum</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Minimal Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-border pt-12"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <span className="text-4xl font-bold text-foreground tracking-tight">{stat.value}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="py-24 border-y border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
                        {[
                            {
                                title: 'Industry Recognized',
                                description: 'ISO Certified curriculum aligned with global standards like CEH, CISSP, OSCP, and CompTIA.',
                            },
                            {
                                title: 'Hands-On Labs',
                                description: 'Real-world attack simulations and defense scenarios in our dedicated cloud infrastructure.',
                            },
                            {
                                title: 'Career Acceleration',
                                description: 'Proven track record of placing graduates in top security roles with 15-30% salary hikes.',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h3 className="text-lg font-bold text-foreground mb-4">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COURSES SECTION */}
            <section id="courses" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-5xl font-manrope font-light text-foreground mb-6">
                                Professional Programs
                            </h2>
                            <p className="text-muted-foreground max-w-xl text-lg font-light">
                                From foundational security to advanced red teaming.
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {courses.map((course, index) => (
                            <div
                                key={course.id}
                                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]"
                            >
                                <CourseCard
                                    {...course}
                                    delay={index * 0.1}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ENTERPRISE CTA */}
            <section className="py-32 bg-foreground text-background">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                            Enterprise Training
                        </h2>
                        <p className="text-background/80 text-xl font-light leading-relaxed mb-12 max-w-md">
                            Customized security capability building for engineering and operations teams.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground font-semibold hover:bg-background/90 transition-colors"
                        >
                            <span>Contact Sales</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="hidden md:block">
                        {/* Abstract visual or empty for whitespace balance */}
                        <div className="w-full h-px bg-background/20 mb-8" />
                        <div className="w-full h-px bg-background/20 mb-8 ml-12" />
                        <div className="w-full h-px bg-background/20 ml-24" />
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <FAQSection 
                faqs={academyFAQs}
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about our cybersecurity courses and certifications."
            />

            <Footer />
        </main>
        </>
    );
}
