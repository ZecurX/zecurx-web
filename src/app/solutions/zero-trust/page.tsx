"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';
import Image from 'next/image';
import { CDN_ASSETS } from '@/lib/cdn';

export default function ZeroTrustPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 overflow-hidden border-b border-border/40">
                {/* Background Pattern - REMOVED for pitch black */}
                {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none" /> */}
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block mb-6">
                                <span className="text-xs font-mono font-medium text-primary tracking-widest uppercase border-b border-primary/20 pb-1">
                                    Solutions / Zero Trust
                                </span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                                Never Trust. <br />
                                <span className="text-foreground/80">Always Verify.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-light">
                                Implement a Zero Trust architecture that secures users, devices, and applications regardless of location or network.
                            </p>
                            
                            <div className="mt-10">
                                <ServiceHeroEmailCapture serviceName="Zero Trust Architecture" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                        >
                            <Image
                                src={CDN_ASSETS.pages.zeroTrust}
                                alt="Zero Trust Architecture"
                                fill
                                className="object-cover dark:invert dark:hue-rotate-180"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-8">
                            Protect Critical Assets
                        </h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                            <p>
                                Zero Trust assumes the network is compromised. We help you define your protect surface and wrap security controls around your most critical data and applications.
                            </p>
                            <p>
                                Identify and classify DAAS (Data, Assets, Applications, Services), map transaction flows, and architect micro-perimeters that monitor and maintain security posture in real-time.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-border/50 pt-12">
                        <StatMetric value="100%" label="Verified Access" className="border-none pl-0" />
                        <StatMetric value="0" label="Implicit Trust" />
                        <StatMetric value="50%" label="Faster Access" />
                        <StatMetric value="24/7" label="Protection" />
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Architecture</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">Core Pillars</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="Continuous Verification"
                            description="Verify identity and context for every access request, not just at login."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                        <TypographicCard
                            index={2}
                            title="Least Privilege"
                            description="Grant only the minimum access necessary for users to perform their jobs."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                        <TypographicCard
                            index={3}
                            title="Micro-Segmentation"
                            description="Segment your network to prevent lateral movement and contain breaches."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                        <TypographicCard
                            index={4}
                            title="Full Visibility"
                            description="See and monitor all traffic, users, and devices across your environment."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                        <TypographicCard
                            index={5}
                            title="Device Trust"
                            description="Ensure only healthy, managed devices can access corporate resources."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                        <TypographicCard
                            index={6}
                            title="Adaptive Access"
                            description="Dynamically adjust access policies based on real-time risk assessment."
                            className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to adopt Zero Trust?"
                description="Secure your organization from the inside out with our comprehensive Zero Trust implementation services."
                primaryLabel="Start Your Journey"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
