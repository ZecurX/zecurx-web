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

// Sample courses data - replace with your actual courses
const courses = [
    {
        id: 'cybersec-genai-bundle',
        title: 'CyberSecurity + Generative AI Bundle',
        description: 'Master the future of security with this comprehensive 3-month program combining core cybersecurity skills with cutting-edge Generative AI defense strategies.',
        price: 9500,
        originalPrice: 12999,
        duration: '3 Months (Weekend Batches)',
        students: 120,
        level: 'Beginner' as const,
        features: [
            'Full practical exposure on live targets',
            'AI for Threat Detection & Response',
            'Prompt Engineering for Security Ops',
            'Hands-on Labs & Capstone Project',
            'Internship Opportunity for Top Performers',
        ],
        popular: true,
    },
    {
        id: 'zx-ceh',
        title: 'zxCEH (Certified Ethical Hacker)',
        description: 'ZecurX\'s flagship ethical hacking program. Learn advanced penetration testing methodologies used by nation-state actors and red teams.',
        price: 24999,
        originalPrice: 34999,
        duration: '60 hours',
        students: 485,
        level: 'Intermediate' as const,
        features: [
            'Advanced Exploitation Techniques',
            'Active Directory Attacks',
            'Buffer Overflow & Exploit Dev',
            'Red Team Report Writing',
            'Exam Voucher Included',
        ],
        popular: false,
    },
    {
        id: 'soc-analyst',
        title: 'SOC Analyst L1 & L2',
        description: 'Become a proficient Security Operations Center analyst. Master SIEM tools, threat hunting, and incident response playbooks.',
        price: 19999,
        originalPrice: 27999,
        duration: '50 hours',
        students: 312,
        level: 'Beginner' as const,
        features: [
            'SIEM Mastery (Splunk, ELK)',
            'Live Attack Analysis',
            'Threat Intelligence Feeds',
            'Phishing Analysis & Forensics',
            'Complete Career Guidance',
        ],
    },
    {
        id: 'web-app-security',
        title: 'Web Application Security',
        description: 'Deep dive into OWASP Top 10 and beyond. Learn to find and fix critical vulnerabilities in modern web applications and APIs.',
        price: 12999,
        originalPrice: 17999,
        duration: '35 hours',
        students: 245,
        level: 'Intermediate' as const,
        features: [
            'OWASP Top 10 Deep Dive',
            'API Security (GraphQL/REST)',
            'Secure Code Review',
            'Burp Suite Pro Mastery',
            'Bug Bounty Hunter Tips',
        ],
    },
    {
        id: 'cloud-security',
        title: 'Cloud Security Fundamentals',
        description: 'Secure AWS, Azure, and GCP environments. Learn identify and access management, cloud compliance, and container security.',
        price: 18999,
        originalPrice: 24999,
        duration: '45 hours',
        students: 180,
        level: 'Advanced' as const,
        features: [
            'Multi-cloud Architecture',
            'Kubernetes & Docker Security',
            'Cloud Compliance Frameworks',
            'Serverless Security',
            'Infrastructure as Code (IaC)',
        ],
    },
    {
        id: 'corporate-training',
        title: 'Corporate Security Awareness',
        description: 'Tailored training for organizations to build a human firewall. Phishing simulations, password hygiene, and social engineering defense.',
        price: 4999,
        originalPrice: 7999,
        duration: 'Custom',
        students: 1500,
        level: 'Beginner' as const,
        features: [
            'Role-based Training Modules',
            'Phishing Simulation Campaigns',
            'Compliance (GDPR/ISO 27001)',
            'Executive Briefings',
            'Analytics & Reporting',
        ],
    },
];

const stats = [
    { icon: Users, value: '10,000+', label: 'Students Trained' },
    { icon: Award, value: '95%', label: 'Pass Rate' },
    { icon: BookOpen, value: '25+', label: 'Courses' },
    { icon: GraduationCap, value: '50+', label: 'Expert Instructors' },
];

export default function AcademyPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
                            <GraduationCap className="w-4 h-4" />
                            <span>ZecurX Academy</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Master <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                                Cybersecurity Excellence
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                            Industry-leading cybersecurity training programs designed by experts.
                            From foundational skills to elite certifications, accelerate your security career.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="#courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200"
                            >
                                <span>Browse Courses</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors border border-border"
                            >
                                <span>Enterprise Training</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-sm hover:border-primary/20 transition-colors"
                            >
                                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="py-24 bg-muted/30 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Industry Recognized',
                                description: 'Our courses align with globally recognized certifications like CEH, CISSP, OSCP, and CompTIA.',
                            },
                            {
                                icon: Target,
                                title: 'Hands-On Labs',
                                description: 'Practice in real-world environments with our dedicated cybersecurity lab infrastructure.',
                            },
                            {
                                icon: Rocket,
                                title: 'Career Acceleration',
                                description: 'Certified professionals earn 15-30% higher salaries and are preferred by 89% of employers.',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-5 p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="p-3.5 h-fit rounded-xl bg-primary/10 text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COURSES SECTION */}
            <section id="courses" className="py-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-50" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Professional Training Programs
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Structured pathways that transform beginners into elite practitioners
                            with industry-recognized credentials.
                        </p>
                    </motion.div>

                    {/* New Grid Layout for large cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ENTERPRISE CTA */}
            <section className="py-24 border-t border-border/50 bg-muted/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Enterprise Training Solutions
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                            Transform your workforce from a vulnerability into a security asset.
                            Custom training programs, role-based upskilling, and AI-powered simulations for teams of all sizes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="/contact"
                                className="px-8 py-4 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all shadow-lg hover:scale-105 duration-200"
                            >
                                Talk to Sales
                            </a>
                            <a
                                href="/services"
                                className="px-8 py-4 bg-background text-foreground border border-border font-semibold rounded-lg hover:bg-muted transition-colors"
                            >
                                View All Services
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
