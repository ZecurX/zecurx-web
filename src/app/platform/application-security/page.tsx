"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Code, Shield, Eye, Settings, Lock, Zap } from 'lucide-react';

const applicationSecurityData = {
    badge: "Platform Feature",
    title: "Application",
    subtitle: "Security",
    description: "Secure your applications from code to cloud. Findings are prioritized by risk, allowing developers to fix what matters most.",
    heroImage: "/images/pages/application-security.jpeg",
    capabilities: [
        {
            icon: <Code className="w-6 h-6" />,
            title: "Static Analysis (SAST)",
            description: "Scan source code for vulnerabilities during development, integrated directly into IDE and CI/CD pipelines."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Dynamic Analysis (DAST)",
            description: "Test running applications for vulnerabilities like SQL injection, XSS, and authentication flaws."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Software Composition Analysis",
            description: "Identify vulnerabilities in open-source dependencies and third-party components automatically."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "API Security",
            description: "Discover, test, and protect APIs with automated vulnerability scanning and runtime protection."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Container Security",
            description: "Scan container images for vulnerabilities and misconfigurations before deployment to production."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Runtime Protection",
            description: "RASP capabilities to detect and block attacks against running applications in real-time."
        },
    ],
    features: [
        {
            title: "Reduced Vulnerabilities",
            description: "Find and fix vulnerabilities early in the SDLC with automated scanning and remediation guidance.",
            points: [
                "SAST/DAST integration",
                "Software Composition Analysis (SCA)",
                "API security testing",
                "Infrastructure as Code scanning"
            ]
        },
        {
            title: "Faster Release Cycles",
            description: "Automate security within your DevOps pipeline without slowing down deployment velocity.",
            points: [
                "IDE integration for real-time feedback",
                "Automated build-breaking policies",
                "Compliance policy as code",
                "Developer-friendly remediation"
            ]
        }
    ],
    stats: []
};

export default function ApplicationSecurityPage() {
    return <FeaturePageLayout data={applicationSecurityData} />;
}
