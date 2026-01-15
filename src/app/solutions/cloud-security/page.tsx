"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Cloud, Shield, Eye, Settings, Lock, Code } from "lucide-react";

const cloudSecurityData = {
    badge: "Security Solution",
    title: "Cloud",
    subtitle: "Security",
    description: "Secure your multi-cloud environments—AWS, Azure, GCP—with comprehensive visibility and protection. Our cloud-native platform protects everything you build and run in the cloud, from infrastructure to applications to data.",
    heroImage: "/images/pages/cloud-security-solution.jpeg",
    capabilities: [
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Complete Visibility",
            description: "Agentless discovery and continuous monitoring of all cloud assets across AWS, Azure, and GCP."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "CNAPP Protection",
            description: "Unified cloud-native application protection platform covering posture, workloads, and identities."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Posture Management",
            description: "Continuous security posture assessment with automated drift detection and remediation."
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: "Infrastructure as Code",
            description: "Shift-left security for IaC templates with policy validation before deployment."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Data Security",
            description: "Discover and protect sensitive data across cloud storage and databases."
        },
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "Container Security",
            description: "Full lifecycle protection for containers and Kubernetes from build to runtime."
        }
    ],
    features: [
        {
            title: "Unified Visibility Across Multi-Cloud",
            description: "You can't protect what you can't see. Our agentless platform provides comprehensive visibility across your entire cloud footprint, discovering assets, mapping relationships, and identifying risks.",
            points: [
                "Single console for AWS, Azure, and GCP environments",
                "Automatic asset discovery and inventory management",
                "Visual attack path analysis for risk prioritization",
                "Real-time configuration and compliance monitoring"
            ]
        },
        {
            title: "Secure the Full Cloud Stack",
            description: "Cloud security requires protecting multiple layers—from infrastructure to applications to data. Our CNAPP approach provides integrated protection across the entire stack.",
            points: [
                "Cloud Security Posture Management (CSPM)",
                "Cloud Workload Protection Platform (CWPP)",
                "Cloud Infrastructure Entitlement Management (CIEM)",
                "Cloud-Native Application Protection (CNAPP)"
            ]
        },
        {
            title: "Enable Secure Cloud Development",
            description: "Security shouldn’t slow down development. Our platform integrates into CI/CD pipelines, enabling developers to build securely without friction.",
            points: [
                "IaC scanning in pull requests with fix suggestions",
                "Container image scanning before registry push",
                "Secrets detection to prevent credential exposure",
                "Developer-friendly dashboards and integrations"
            ]
        }
    ],
    stats: [
        { value: "3+", label: "Cloud Platforms" },
        { value: "100%", label: "Asset Visibility" },
        { value: "1000+", label: "Security Checks" },
        { value: "Minutes", label: "Time to Value" }
    ]
};

export default function CloudSecurityPage() {
    return <FeaturePageLayout data={cloudSecurityData} />;
}
