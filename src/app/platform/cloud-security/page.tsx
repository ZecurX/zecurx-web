"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Cloud, Shield, Eye, Settings, Lock, Zap } from 'lucide-react';

const cloudSecurityData = {
    badge: "Cloud Security",
    title: "Multi-Cloud",
    subtitle: "Visibility & Protection",
    description: "Unified visibility across multi-cloud and hybrid environments with policy-driven security controls. AI continuously analyzes cloud posture and auto-remediates risks.",
    capabilities: [
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "Multi-Cloud Support",
            description: "Comprehensive security coverage across AWS, Azure, GCP, and hybrid environments from a single platform."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Cloud Posture Management",
            description: "Continuous monitoring and assessment of cloud configurations against security best practices and compliance frameworks."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Workload Protection",
            description: "Runtime protection for containers, serverless functions, and virtual machines across all cloud environments."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Auto-Remediation",
            description: "Automatically fix misconfigurations and policy violations before they become security incidents."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Network Security",
            description: "Cloud-native network segmentation and micro-segmentation to limit blast radius of potential breaches."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Infrastructure as Code Scanning",
            description: "Shift-left security by scanning Terraform, CloudFormation, and Kubernetes manifests before deployment."
        },
    ],
    features: [
        {
            title: "Secure Cloud Adoption",
            description: "Enable rapid cloud adoption without compromising security. Our platform provides guardrails that allow innovation while maintaining compliance.",
            image: "/images/features/cloud-security.png",
            points: [
                "Pre-deployment security scanning",
                "Real-time drift detection",
                "Automated policy enforcement",
                "Multi-cloud governance framework"
            ]
        },
        {
            title: "Reduced Misconfigurations",
            description: "Cloud misconfigurations are the leading cause of breaches. Our AI-powered detection finds and fixes issues continuously.",
            image: "/images/features/network-security.png",
            points: [
                "500+ pre-built security checks",
                "Custom policy creation",
                "Prioritized remediation guidance",
                "Integration with CI/CD pipelines"
            ]
        },
    ],
    stats: []
};

export default function CloudSecurityPage() {
    return <FeaturePageLayout data={cloudSecurityData} />;
}
