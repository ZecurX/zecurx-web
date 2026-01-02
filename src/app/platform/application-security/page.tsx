"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Code, Shield, Eye, Settings, Lock, Zap } from 'lucide-react';

const applicationSecurityData = {
    badge: "Application Security",
    title: "Secure SDLC",
    subtitle: "Application Protection",
    description: "Security integrated across the application lifecycle, from development to production. AI prioritizes exploitable risks and automates remediation recommendations.",
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
            title: "Faster App Releases",
            description: "Security that enables velocity, not restricts it. Automated scanning and prioritization keeps development moving fast.",
            image: "/images/features/app-security.png",
            points: [
                "Automated security gates in CI/CD",
                "Developer-friendly remediation guidance",
                "IDE integration for real-time feedback",
                "Risk-based prioritization of findings"
            ]
        },
        {
            title: "Reduced Vulnerabilities",
            description: "Catch vulnerabilities before they reach production. Our shift-left approach prevents issues from becoming incidents.",
            image: "/images/features/vulnerability-scan.png",
            points: [
                "Pre-commit hooks for security scanning",
                "Pull request security reviews",
                "Automated dependency updates",
                "Vulnerability SLA tracking"
            ]
        },
    ],
    stats: []
};

export default function ApplicationSecurityPage() {
    return <FeaturePageLayout data={applicationSecurityData} />;
}
