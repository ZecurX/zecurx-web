"use client";

import FeaturePageLayout from "@/components/landing/FeaturePageLayout";
import { Zap, Shield, Cloud, Lock, Settings, Globe, Code, Smartphone, LayoutGrid } from "lucide-react";
import { StaticThreatMesh } from "@/components/diagrams/static/StaticThreatMesh";

import { StaticAutomationFlow } from "@/components/diagrams/static/StaticAutomationFlow";
import { StaticInfrastructureMap } from "@/components/diagrams/static/StaticInfrastructureMap";

const digitalTransformationData = {
    badge: "Security Solution",
    title: "Digital",
    subtitle: "Transformation",
    description: "Enable secure modernization while adopting cloud, automation, and emerging technologies. Our comprehensive approach ensures your digital initiatives accelerate business growth without introducing new risks.",
    capabilities: [
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "Cloud Migration",
            description: "Securely migrate workloads to the cloud with built-in compliance and visibility."
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: "DevSecOps",
            description: "Embed security into your agile development lifecycle without slowing down release cycles."
        },
        {
            icon: <Smartphone className="w-6 h-6" />,
            title: "Mobile Security",
            description: "Protect mobile apps and devices enabling your workforce to operate from anywhere."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automation",
            description: "Automate manual security processes to scale with your digital footprint."
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "IoT Security",
            description: "Secure connected devices and edge computing environments from tampering and botnets."
        },
        {
            icon: <LayoutGrid className="w-6 h-6" />,
            title: "API Security",
            description: "Protect the APIs that connect your digital ecosystem from abuse and data leakage."
        }
    ],
    features: [
        {
            title: "Accelerate Innovation Without Compromising Security",
            description: "Digital transformation requires speed, but moving fast shouldn't mean leaving doors open. Our platform integrates security seamlessly into your digital workflows.",
            points: [
                "Automated security gates in CI/CD pipelines",
                "Real-time API discovery and protection",
                "Secure-by-design architecture blueprints",
                "Continuous automated penetration testing"
            ]
        },
        {
            title: "Future-Ready Security Architecture",
            description: "Legacy security tools can't support modern digital initiatives. Our platform provides a flexible, scalable architecture that grows with your transformation.",
            component: <StaticInfrastructureMap />,
            points: [
                "Zero Trust architecture implementation",
                "Scalable cloud-native security controls",
                "Unified visibility across hybrid environments",
                "AI-driven adaptation to new threat surfaces"
            ]
        },
        {
            title: "Secure the Modern Workforce",
            description: "Empower your employees to work from anywhere, on any device, with seamless security that doesn't hinder productivity.",
            points: [
                "Context-aware access controls",
                "Mobile threat defense for iOS and Android",
                "Secure remote access without VPN bottlenecks",
                "User behavior analytics to detect compromised accounts"
            ]
        }
    ],
    stats: [
        { value: "50%", label: "Faster Deployment" },
        { value: "100%", label: "Cloud Coverage" },
        { value: "0", label: "Breaches" },
        { value: "24/7", label: "Digital Trust" }
    ]
};

export default function DigitalTransformationPage() {
    return <FeaturePageLayout data={digitalTransformationData} />;
}
