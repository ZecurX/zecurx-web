"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

const internships = [
    {
        id: 'cybersec-ai-intern',
        title: 'Cybersecurity AI Developer',
        description: 'Build next-gen security solutions using Artificial Intelligence. Work on threat detection models and automated response systems.',
        skills: ['Python', 'Machine Learning', 'Security Ops', 'LLMs']
    },
    {
        id: 'web-dev-intern',
        title: 'Website Developer',
        description: 'Design and develop secure, high-performance web applications. learn secure coding practices and modern frontend frameworks.',
        skills: ['Next.js', 'React', 'Tailwind', 'Secure Coding']
    },
    {
        id: 'app-dev-intern',
        title: 'App Developer',
        description: 'Create secure mobile applications for Android and iOS. Focus on mobile security standards and user-centric design.',
        skills: ['React Native', 'Flutter', 'Mobile Security', 'API Integration']
    },
    {
        id: 'pentester-intern',
        title: 'Penetration Tester',
        description: 'Simulate cyber attacks to identify vulnerabilities. Perform ethical hacking on web apps, networks, and cloud infrastructure.',
        skills: ['Network Security', 'Burp Suite', 'Python', 'Reporting']
    }
];

function InternshipCard({ role, index }: { role: typeof internships[0], index: number }) {
    const [duration, setDuration] = React.useState<'3months' | '6months'>('3months');

    const pricing = {
        '3months': { price: 3200, label: '3 Months' },
        '6months': { price: 6400, label: '6 Months' }
    };

    const current = pricing[duration];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-background/50 border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all duration-300 rounded-2xl overflow-hidden"
        >
            <div className="flex flex-col flex-1 p-8">
                {/* Header / Toggle */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    {/* Minimal Toggle */}
                    <div className="flex bg-muted/40 rounded-lg p-1 gap-1">
                        {(['3months', '6months'] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded-md transition-all ${duration === d
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {d === '3months' ? '3 Mo' : '6 Mo'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-manrope font-light text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {role.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[40px]">
                    {role.description}
                </p>

                {/* Skills (Minimal List) */}
                <ul className="space-y-2 mb-8 flex-1">
                    {role.skills.map((skill, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                            <span>{skill}</span>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-border/50">
                    <div className="flex items-end justify-between gap-4 mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Fee ({current.label})</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-foreground">₹{current.price.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href={`/checkout?itemId=${role.id}&itemName=${encodeURIComponent(role.title + ` Internship (${current.label})`)}&price=${current.price}&type=internship`}
                        className="flex w-full items-center justify-center py-3 px-4 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-lg"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function InternshipsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Note: Navbar is here but page is hidden from menu links */}
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border/50 border border-foreground/10 text-xs font-medium text-muted-foreground backdrop-blur-md mb-8">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Live Internship Program</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter">
                            Launch Your Career <br /> with Real Experience
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl mb-12">
                            Build enterprise-grade security solutions. Work on live projects. Get hired.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                View Positions
                            </button>
                            <Link href="/why-zecurx" className="px-8 py-4 border border-border text-foreground font-semibold rounded-full hover:bg-muted/50 transition-colors">
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PROGRAM DETAILS - ACADEMY STYLE STATS */}
            <section className="pb-20 border-b border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { label: 'Duration', value: '3 / 6 Months' },
                            { label: 'Mode', value: 'Remote / Hybrid' },
                            { label: 'Focus', value: 'Live Projects' },
                            { label: 'Outcome', value: 'Certification' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROLES GRID */}
            <section id="roles" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-5xl font-manrope font-light text-foreground mb-6">
                            Available Roles
                        </h2>
                        <p className="text-muted-foreground max-w-xl text-lg font-light">
                            Select a domain to start your journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {internships.map((role, idx) => (
                            <InternshipCard key={role.id} role={role} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-24 bg-foreground text-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Why ZecurX Internships?</h2>
                            <p className="text-xl font-light text-background/80 mb-8">
                                We bridge the gap between academic learning and industry demands.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Real-world project exposure',
                                    'Professional mentorship',
                                    'Hands-on Labs & Tools',
                                    'Ethical and compliant practices',
                                    'Conversion-ready talent opportunities'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-background/10 backdrop-blur-sm p-8 rounded-3xl border border-background/20">
                            <h3 className="text-xl font-bold mb-4">Program Structure</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold">Onboarding & Training</h4>
                                        <p className="text-sm text-background/70">Intensive bootcamp on core skills and tools.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold">Project Execution</h4>
                                        <p className="text-sm text-background/70">Work on live modules under mentorship.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold">Evaluation & Certification</h4>
                                        <p className="text-sm text-background/70">Performance review and internship certificate.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
