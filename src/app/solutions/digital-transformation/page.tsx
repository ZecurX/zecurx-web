"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Zap, Shield, Cloud, Lock, Settings, Globe } from "lucide-react";

const digitalTransformationData = {
    badge: "Security Solution",
    title: "Digital",
    subtitle: "Transformation",
    description: "Enable secure modernization while adopting cloud, automation, and emerging technologies. Our comprehensive approach ensures your digital initiatives are protected from inception through deployment, letting you innovate with confidence.",
    capabilities: [
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "Cloud Migration Security",
            description: "Secure your journey to the cloud with comprehensive visibility and protection across AWS, Azure, and GCP environments."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automation Security",
            description: "Integrate security into your automation workflows with policy-as-code and continuous compliance validation."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "DevSecOps Integration",
            description: "Embed security throughout your CI/CD pipeline with automated scanning, testing, and remediation."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Data Protection",
            description: "Protect sensitive data across hybrid environments with encryption, DLP, and access governance."
        },
        {
            icon: <Settings className="w-6 h-6" />,
            title: "Infrastructure as Code",
            description: "Secure your IaC templates with automated policy enforcement and drift detection."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "API Security",
            description: "Protect your API ecosystem with real-time threat detection and automated vulnerability management."
        }
    ],
    features: [
        {
            title: "Accelerate Innovation Without Compromising Security",
            description: "Digital transformation initiatives fail when security becomes a bottleneck. Our platform enables security teams to move at the speed of development while maintaining enterprise-grade protection.",
            image: "/images/features/digital-transform.png",
            points: [
                "Automated security policies that scale with your infrastructure",
                "Real-time visibility into cloud assets and configurations",
                "Self-service security capabilities for development teams",
                "Continuous compliance monitoring and reporting"
            ]
        },
        {
            title: "Unified Security Across Legacy and Modern Systems",
            description: "Transformation doesn't happen overnight. Our platform provides consistent security visibility and control across your entire technology estate—from mainframes to microservices.",
            image: "/images/features/cloud-security.png",
            points: [
                "Single pane of glass for hybrid environment visibility",
                "Consistent policy enforcement across all platforms",
                "Automated asset discovery and classification",
                "Integrated risk scoring and prioritization"
            ]
        },
        {
            title: "Future-Ready Security Architecture",
            description: "Build a security foundation that evolves with your business. Our platform adapts to emerging technologies and threats, ensuring your transformation investments remain protected.",
            image: "/images/features/automation-workflow.png",
            points: [
                "AI-powered threat detection that learns and adapts",
                "Extensible platform with open APIs and integrations",
                "Modular architecture for phased adoption",
                "Expert guidance on security architecture patterns"
            ]
        }
    ],
    stats: [
        { value: "60%", label: "Risk Reduction" },
        { value: "40%", label: "Faster Deployments" },
        { value: "100+", label: "Integrations" },
        { value: "24/7", label: "Security Monitoring" }
    ]
};

export default function DigitalTransformationPage() {
    return <FeaturePageLayout data={digitalTransformationData} />;
}
