"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';
import { TypographicCard } from '@/components/services/ui/TypographicCard';
import { StatMetric } from '@/components/services/ui/StatMetric';
import CTASection from '@/components/landing/CTASection';

export default function DevSecOpsPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-block mb-6">
                            <span className="text-xs font-mono font-medium text-primary tracking-widest uppercase border-b border-primary/20 pb-1">
                                Engineering / 02
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tighter leading-[0.9]">
                            Automated Security. <br />
                            <span className="text-foreground/80">Continuous Delivery.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            Bridge the gap between speed and security. We integrate automated security controls directly into your CI/CD pipelines, enabling you to ship faster and safer.
                        </p>
                        
                        <div className="mt-10">
                            <ServiceHeroEmailCapture serviceName="DevSecOps Implementation" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-8">
                                Security as Code
                            </h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    In a cloud-native world, manual security reviews create bottlenecks. DevSecOps isn&apos;t just about tools; it&apos;s a cultural shift where security is a shared responsibility and an automated standard.
                                </p>
                                <p>
                                    ZecurX architects DevSecOps pipelines that treat security policies as code. We automate scanning, infrastructure provisioning, and compliance checks, ensuring that every commit is verified against your security standards without slowing down developers.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            <StatMetric value="10x" label="Faster Release Cycles" />
                            <StatMetric value="Auto" label="Remediation Workflows" />
                            <StatMetric value="100%" label="Pipeline Coverage" />
                            <StatMetric value="Shift" label="Left Security" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-32 bg-foreground/[0.02] border-y border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Pipeline</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-semibold text-foreground">Integration Services</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                        <TypographicCard
                            index={1}
                            title="CI/CD Security Gates"
                            description="Implement hard breaking points in build pipelines for critical vulnerabilities (SAST/DAST/SCA)."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={2}
                            title="Container Security"
                            description="Vulnerability scanning for Docker images and Kubernetes orchestration security (KSPM)."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={3}
                            title="Infrastructure as Code"
                            description="Scan Terraform, CloudFormation, and Ansible scripts for misconfigurations before deployment."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={4}
                            title="Automated Compliance"
                            description="Continuous monitoring and reporting of compliance posture against CIS benchmarks and internal policies."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={5}
                            title="Supply Chain Security"
                            description="Software Composition Analysis (SCA) to identify known vulnerabilities in open source dependencies."
                            className="bg-background"
                        />
                        <TypographicCard
                            index={6}
                            title="Security Orchestration"
                            description="Integrate security findings with issue tracking systems (Jira) to automate ticket creation and assignment."
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to automate your security?"
                description="Integrate security into your CI/CD pipelines and ship secure code faster with our DevSecOps expertise."
                primaryLabel="Build Better Pipelines"
                primaryHref="/contact"
            />

            <Footer />
        </main>
    );
}
