"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    active: boolean;
    in_stock: boolean;
};

type GroupedPlan = {
    title: string;
    description: string;
    variants: {
        duration: string;
        months: number;
        plan: Plan;
    }[];
};

function groupPlansByRole(plans: Plan[]): GroupedPlan[] {
    const groups: Record<string, GroupedPlan> = {};
    
    for (const plan of plans) {
        const match = plan.name.match(/^(.+?)\s*(?:Internship\s*)?\((\d+)\s*Months?\)$/i);
        if (!match) continue;
        
        const baseTitle = match[1].trim().replace(/\s*Internship$/i, '');
        const months = parseInt(match[2], 10);
        
        if (!groups[baseTitle]) {
            groups[baseTitle] = {
                title: baseTitle,
                description: plan.description,
                variants: []
            };
        }
        
        groups[baseTitle].variants.push({
            duration: `${months}months`,
            months,
            plan
        });
    }
    
    return Object.values(groups).map(group => ({
        ...group,
        variants: group.variants.sort((a, b) => a.months - b.months)
    }));
}

const SKILLS_MAP: Record<string, string[]> = {
    'Cybersecurity AI Developer': ['Python', 'Machine Learning', 'Security Ops', 'LLMs'],
    'Website Developer': ['Next.js', 'React', 'Tailwind', 'Secure Coding'],
    'App Developer': ['React Native', 'Flutter', 'Mobile Security', 'API Integration'],
    'Penetration Tester': ['Network Security', 'Burp Suite', 'Python', 'Reporting']
};

function InternshipCard({ group, index }: { group: GroupedPlan, index: number }) {
    const [selectedDuration, setSelectedDuration] = useState<string>(
        group.variants.find(v => v.months === 6)?.duration || group.variants[group.variants.length - 1]?.duration || '6months'
    );
    
    const currentVariant = group.variants.find(v => v.duration === selectedDuration) || group.variants[0];
    const currentPlan = currentVariant?.plan;
    const skills = SKILLS_MAP[group.title] || [];
    
    if (!currentPlan) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative flex flex-col h-full bg-background border border-border/40 hover:border-border transition-colors duration-500 rounded-3xl overflow-hidden"
        >
            <div className="flex flex-col flex-1 p-8 md:p-10">
                <div className="flex justify-between items-start gap-4 mb-6">
                    <h3 className="text-3xl font-manrope font-semibold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                        {group.title}
                    </h3>

                    <div className="flex shrink-0 bg-secondary/50 p-1 rounded-full gap-1 self-start">
                        {group.variants.length > 1 ? (
                            group.variants.map((variant) => (
                                <button
                                    key={variant.duration}
                                    onClick={() => setSelectedDuration(variant.duration)}
                                    className={`relative px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                                        selectedDuration === variant.duration
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {variant.months} MO
                                </button>
                            ))
                        ) : (
                             <div className="px-4 py-1.5 bg-secondary/30 text-muted-foreground text-[11px] font-bold uppercase tracking-wider rounded-full">
                                {currentVariant.months} MO
                             </div>
                        )}
                    </div>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed font-light mb-8 max-w-lg">
                    {group.description}
                </p>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10 flex-1 content-start">
                        {skills.map((skill, idx) => (
                            <span 
                                key={idx} 
                                className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/30 border border-border/40 rounded-lg group-hover:border-border/60 group-hover:bg-secondary/50 transition-colors"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-8 border-t border-border/30 flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                            Program Fee
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground tracking-tight">
                                ₹{currentPlan.price.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    {currentPlan.in_stock ? (
                        <Link
                            href={`/checkout?itemId=${currentPlan.id}&itemName=${encodeURIComponent(currentPlan.name)}&price=${currentPlan.price}&type=internship`}
                            className="relative px-8 py-3.5 bg-foreground text-background text-sm font-semibold rounded-full hover:bg-foreground/90 transition-all duration-300 flex items-center gap-2 group/btn shadow-lg shadow-foreground/5 hover:shadow-foreground/10 hover:-translate-y-0.5"
                        >
                            <span>Apply Now</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                    ) : (
                        <div className="px-6 py-3.5 bg-muted text-muted-foreground text-sm font-semibold rounded-full cursor-not-allowed border border-border/50">
                            Currently Unavailable
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function InternshipsClient({ plans }: { plans: Plan[] }) {
    const groupedPlans = groupPlansByRole(plans);
    
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <CreativeNavBar />

            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
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
                            Launch Your Career <br />with Real Experience
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

                    {groupedPlans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {groupedPlans.map((group, idx) => (
                                <InternshipCard key={group.title} group={group} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No internship positions available at the moment.</p>
                            <p className="text-muted-foreground/70 mt-2">Check back soon for new opportunities.</p>
                        </div>
                    )}
                </div>
            </section>

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
