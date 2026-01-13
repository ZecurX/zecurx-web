"use client";

import React from 'react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { Settings, RefreshCw, Box, Terminal, Shield, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCTA from '@/components/services/ServiceCTA';
import ServiceHeroEmailCapture from '@/components/services/ServiceHeroEmailCapture';

export default function DevSecOpsPage() {
    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-foreground/20 text-xs font-medium text-foreground mb-6">
                            <Settings className="w-3 h-3" />
                            <span>Engineering Services</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                            Automated Security. <br />
                            <span className="text-foreground">Continuous Delivery.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Bridge the gap between speed and security. We integrate automated security controls directly into your CI/CD pipelines, enabling you to ship faster and safer.
                        </p>
                        
                        <ServiceHeroEmailCapture serviceName="DevSecOps Implementation" />
                    </motion.div>
                </div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="py-20 border-t border-border/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Security as Code
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    In a cloud-native world, manual security reviews create bottlenecks. DevSecOps isn&apos;t just about tools; it&apos;s a cultural shift where security is a shared responsibility and an automated standard.
                                </p>
                                <p>
                                    ZecurX architects DevSecOps pipelines that treat security policies as code. We automate scanning, infrastructure provisioning, and compliance checks, ensuring that every commit is verified against your security standards without slowing down developers.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard number="10x" label="Faster Release Cycles" />
                            <StatCard number="Auto" label="Remediation Workflows" />
                            <StatCard number="100%" label="Pipeline Coverage" />
                            <StatCard number="Shift" label="Left Security" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CAPABILITIES SECTION */}
            <section className="py-24 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Pipeline Integration Services</h2>
                        <p className="text-muted-foreground">
                            Seamless integration with Jenkins, GitLab CI, GitHub Actions, Azure DevOps, and more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CapabilityCard
                            icon={Workflow}
                            title="CI/CD Security Gates"
                            description="Implement hard breaking points in build pipelines for critical vulnerabilities (SAST/DAST/SCA)."
                        />
                        <CapabilityCard
                            icon={Box}
                            title="Container Security"
                            description="Vulnerability scanning for Docker images and Kubernetes orchestration security (KSPM)."
                        />
                        <CapabilityCard
                            icon={Terminal}
                            title="Infrastructure as Code (IaC)"
                            description="Scan Terraform, CloudFormation, and Ansible scripts for misconfigurations before deployment."
                        />
                        <CapabilityCard
                            icon={RefreshCw}
                            title="Automated Compliance"
                            description="Continuous monitoring and reporting of compliance posture against CIS benchmarks and internal policies."
                        />
                        <CapabilityCard
                            icon={Shield}
                            title="Supply Chain Security"
                            description="Software Composition Analysis (SCA) to identify known vulnerabilities in open source dependencies."
                        />
                        <CapabilityCard
                            icon={Settings}
                            title="Security Orchestration"
                            description="Integrate security findings with issue tracking systems (Jira) to automate ticket creation and assignment."
                        />
                    </div>
                </div>
            </section>

            <ServiceCTA
                title="Ready to automate your security?"
                description="Integrate security into your CI/CD pipelines and ship secure code faster with our DevSecOps expertise."
                ctaLabel="Build Better Pipelines"
                ctaHref="/contact"
            />

            <Footer />
        </main>
    );
}

function StatCard({ number, label }: { number: string, label: string }) {
    return (
        <div className="p-6 rounded-xl bg-muted/10 border border-border/50 text-center">
            <div className="text-3xl font-bold text-foreground mb-1">{number}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    );
}

function CapabilityCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-2xl bg-background border border-border hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center mb-6 text-foreground group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
